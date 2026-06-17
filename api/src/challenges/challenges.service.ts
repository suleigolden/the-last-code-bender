import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwardXpService } from '../common/award-xp.service';

const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference/chat/completions';

function extractJson(text: string): Record<string, unknown> | null {
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*"total"[\s\S]*\}/);
  if (!jsonMatch) return null;
  const raw = jsonMatch[1] ?? jsonMatch[0];
  try {
    return JSON.parse(raw.trim()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

@Injectable()
export class ChallengesService {
  constructor(
    private prisma: PrismaService,
    private awardXpService: AwardXpService,
  ) {}

  async findAll() {
    const now = new Date();
    const challenges = await this.prisma.challenge.findMany({
      orderBy: { opens_at: 'desc' },
    });
    return challenges.map((c) => ({
      ...c,
      is_active: now >= c.opens_at && now <= c.closes_at,
    }));
  }

  findMySubmissions(handle: string) {
    return this.prisma.challengeSubmission.findMany({
      where: { handle },
      orderBy: { submitted_at: 'desc' },
    });
  }

  async submit(input: {
    challenge_id: string;
    challenge_slug: string;
    handle: string;
    github: string;
    content: string;
    language?: string;
    stack?: unknown;
  }) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { slug: input.challenge_slug },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const submission = await this.prisma.challengeSubmission.create({
      data: {
        challenge_id: input.challenge_id,
        challenge_slug: input.challenge_slug,
        handle: input.handle,
        github: input.github,
        content: input.content,
        language: input.language ?? null,
      },
    });

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return { approved: false, error: 'Missing GITHUB_TOKEN', submission };
    }

    const scoring = challenge.scoring as Record<string, number>;
    const stackBlock = input.stack
      ? `\n\nContributor Stack Context:\n\`\`\`json\n${JSON.stringify(input.stack)}\n\`\`\`\n`
      : '';

    const prompt = `You are a strict but fair code judge for a developer challenge platform.

## Challenge Specification
${challenge.spec}

## Constraints
${challenge.constraints ?? 'N/A'}
${stackBlock}

## Submission
${input.content}

## Your Task
Score the submission:
- Correctness: out of ${scoring.correctness ?? 40}
- Performance: out of ${scoring.performance ?? 30}
- Style: out of ${scoring.style ?? 30}
- Total: out of 100

Respond ONLY with a JSON object (no markdown) in this exact format:
{
  "correctness": <number>,
  "performance": <number>,
  "style": <number>,
  "total": <number>,
  "feedback": {
    "correctness": "<one sentence>",
    "performance": "<one sentence>",
    "style": "<one sentence>"
  }
}`;

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

    const modelData = (await modelRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawText = modelData?.choices?.[0]?.message?.content?.trim() ?? '';
    const parsed = extractJson(rawText);

    if (!parsed) {
      return { approved: false, error: 'Failed to parse AI score', submission };
    }

    const correctness = Number(parsed.correctness);
    const performance = Number(parsed.performance);
    const style = Number(parsed.style);
    const total = Number(parsed.total) || correctness + performance + style;
    const feedback = parsed.feedback as Record<string, string> | undefined;

    const aiFeedback = [
      feedback?.correctness ? `Correctness: ${feedback.correctness}` : null,
      feedback?.performance ? `Performance: ${feedback.performance}` : null,
      feedback?.style ? `Style: ${feedback.style}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const updated = await this.prisma.challengeSubmission.update({
      where: { id: submission.id },
      data: {
        score_total: total,
        score_breakdown: { correctness, performance, style },
        ai_feedback: aiFeedback,
        judged_at: new Date(),
      },
    });

    // Award submission XP
    await this.awardXpService.awardXp(input.handle, 'challenge_submit', challenge.xp_submit, {
      challenge_slug: input.challenge_slug,
      submission_id: submission.id,
    });

    // Calculate placements
    await this.updatePlacements(challenge.id, challenge.xp_winner, input.challenge_slug);

    return {
      approved: true,
      score: { correctness, performance, style, total },
      feedback,
      submission: updated,
    };
  }

  private async updatePlacements(challengeId: string, xpWinner: number, challengeSlug: string) {
    const allSubs = await this.prisma.challengeSubmission.findMany({
      where: { challenge_id: challengeId },
    });

    const judgedSubs = allSubs.filter((s) => s.judged_at);
    const hasUnplaced = allSubs.some((s) => s.placement == null);

    if (judgedSubs.length !== allSubs.length || !hasUnplaced) return;

    const sorted = [...allSubs].sort((a, b) => {
      const at = a.score_total ?? 0;
      const bt = b.score_total ?? 0;
      if (bt !== at) return bt - at;
      return (a.submitted_at?.toISOString() ?? '').localeCompare(
        b.submitted_at?.toISOString() ?? '',
      );
    });

    await Promise.all(
      sorted.map((sub, i) =>
        this.prisma.challengeSubmission.update({
          where: { id: sub.id },
          data: { placement: i + 1 },
        }),
      ),
    );

    const winner = sorted[0];
    if (winner?.handle) {
      await this.awardXpService.awardXp(winner.handle, 'challenge_win', xpWinner, {
        challenge_slug: challengeSlug,
        submission_id: winner.id,
      });
    }
  }
}
