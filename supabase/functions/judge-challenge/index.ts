import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference/chat/completions';

function extractJson(text: string) {
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)```/) ||
    text.match(/\{[\s\S]*"total"[\s\S]*\}/);

  if (!jsonMatch) return null;
  const raw = jsonMatch[1] || jsonMatch[0];

  try {
    return JSON.parse(raw.trim());
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const {
    submission_id,
    handle,
    content,
    challenge_slug,
    stack,
  } = (await req.json()) as {
    submission_id: string;
    handle: string;
    content: string;
    challenge_slug: string;
    stack?: unknown;
  };

  if (!submission_id || !handle || !content || !challenge_slug) {
    return new Response(JSON.stringify({ error: 'missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const githubToken = Deno.env.get('GITHUB_TOKEN');
  if (!githubToken) {
    return new Response(JSON.stringify({ error: 'Missing GITHUB_TOKEN secret' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Load challenge
  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('*')
    .eq('slug', challenge_slug)
    .maybeSingle();
  if (challengeError) {
    return new Response(JSON.stringify({ error: challengeError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!challenge) {
    return new Response(JSON.stringify({ error: 'Challenge not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Load submission so we can avoid double-awarding and detect whether it was already judged
  const { data: submission, error: submissionError } = await supabase
    .from('challenge_submissions')
    .select('*')
    .eq('id', submission_id)
    .maybeSingle();
  if (submissionError) {
    return new Response(JSON.stringify({ error: submissionError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!submission) {
    return new Response(JSON.stringify({ error: 'Submission not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const wasAlreadyJudged = Boolean(submission.judged_at);

  const stackBlock = stack
    ? `\n\nContributor Stack Context (from stack.json):\n\`\`\`json\n${JSON.stringify(stack)}\n\`\`\`\n`
    : '';

  // Score via GitHub Models
  const prompt = `You are a strict but fair code judge for a developer challenge platform.

## Challenge Specification
${challenge.spec}

## Constraints
${challenge.constraints ?? 'N/A'}

${stackBlock}

## Submission
${content}

## Your Task
Score the submission according to the weights in this challenge:
- Correctness: out of ${challenge.scoring?.correctness ?? 40}
- Performance: out of ${challenge.scoring?.performance ?? 30}
- Style: out of ${challenge.scoring?.style ?? 30}
- Total: out of 100

Respond ONLY with a JSON object (no markdown) in this exact format:
{
  "correctness": <number 0-40>,
  "performance": <number 0-30>,
  "style": <number 0-30>,
  "total": <number 0-100>,
  "feedback": {
    "correctness": "<one sentence>",
    "performance": "<one sentence>",
    "style": "<one sentence>"
  }
}

Rules:
- Be rigorous. A score of 40/100 is the minimum for a passing submission.
- Total must equal correctness + performance + style.`;

  const modelRes = await fetch(GITHUB_MODELS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2026-03-10',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.1,
    }),
  });

  const modelData = await modelRes.json();
  const rawText = modelData?.choices?.[0]?.message?.content?.trim() ?? '';
  const parsed = extractJson(rawText);

  if (!parsed) {
    return new Response(JSON.stringify({ error: 'Failed to parse score JSON', raw: rawText }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const correctness = Number(parsed.correctness);
  const performance = Number(parsed.performance);
  const style = Number(parsed.style);
  const total = Number(parsed.total);
  const feedback = parsed.feedback ?? {};

  if (!Number.isFinite(correctness) || !Number.isFinite(performance) || !Number.isFinite(style) || !Number.isFinite(total)) {
    return new Response(JSON.stringify({ error: 'Invalid score fields', raw: parsed }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const expectedTotal = correctness + performance + style;
  const finalTotal = total || expectedTotal;

  const aiFeedback = [
    feedback?.correctness ? `Correctness: ${feedback.correctness}` : null,
    feedback?.performance ? `Performance: ${feedback.performance}` : null,
    feedback?.style ? `Style: ${feedback.style}` : null,
  ].filter(Boolean).join('\n');

  // Award submit XP only when we transition from unjudged -> judged
  if (!wasAlreadyJudged) {
    const { error: updateError } = await supabase
      .from('challenge_submissions')
      .update({
        score_total: finalTotal,
        score_breakdown: {
          correctness,
          performance,
          style,
        },
        ai_feedback: aiFeedback,
        judged_at: new Date().toISOString(),
      })
      .eq('id', submission_id);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await supabase.rpc('award_xp', {
      p_handle: handle,
      p_event_type: 'challenge_submit',
      p_xp: challenge.xp_submit ?? 10,
      p_metadata: { challenge_slug, submission_id },
    });
  } else {
    const { error: updateError } = await supabase
      .from('challenge_submissions')
      .update({
        score_total: finalTotal,
        score_breakdown: {
          correctness,
          performance,
          style,
        },
        ai_feedback: aiFeedback,
      })
      .eq('id', submission_id);
    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Calculate placements once all submissions for this challenge are judged.
  const challengeId = challenge.id;
  const { data: allSubs, error: allSubsError } = await supabase
    .from('challenge_submissions')
    .select('*')
    .eq('challenge_id', challengeId);

  if (!allSubsError && allSubs) {
    const judgedSubs = allSubs.filter((s) => s.judged_at);
    const hasUnplaced = allSubs.some((s) => s.placement == null);

    if (judgedSubs.length === allSubs.length && hasUnplaced) {
      const sorted = [...allSubs].sort((a, b) => {
        const at = a.score_total ?? 0;
        const bt = b.score_total ?? 0;
        if (bt !== at) return bt - at;
        return (a.submitted_at ?? '').localeCompare(b.submitted_at ?? '');
      });

      // Update placements
      for (let i = 0; i < sorted.length; i++) {
        const sub = sorted[i];
        await supabase
          .from('challenge_submissions')
          .update({ placement: i + 1 })
          .eq('id', sub.id);
      }

      const winner = sorted[0];

      // Only award the winner bonus once (when the winner was previously unplaced).
      if (winner?.handle && winner.placement == null) {
        await supabase.rpc('award_xp', {
          p_handle: winner.handle,
          p_event_type: 'challenge_win',
          p_xp: challenge.xp_winner ?? 100,
          p_metadata: { challenge_slug, submission_id: winner.id },
        });
      }
    }
  }

  return new Response(
    JSON.stringify({
      approved: true,
      score: {
        correctness,
        performance,
        style,
        total: finalTotal,
      },
      feedback,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});

