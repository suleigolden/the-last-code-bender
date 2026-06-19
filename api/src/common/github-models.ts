import { HttpException, HttpStatus } from '@nestjs/common';

const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export interface ChatCompletionOptions {
  max_tokens: number;
  temperature: number;
}

function githubModelsHttpException(status: number, errText: string): HttpException {
  try {
    const parsed = JSON.parse(errText) as {
      error?: { code?: string; message?: string };
    };
    if (parsed.error?.code === 'no_access') {
      return new HttpException(
        'GitHub Models access denied. Set GITHUB_TOKEN to a fine-grained PAT with Models → Read-only (models:read).',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    const detail = parsed.error?.message ?? errText;
    return new HttpException(
      `GitHub Models API error (${status}): ${detail}`,
      status === 403 ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.BAD_GATEWAY,
    );
  } catch {
    return new HttpException(
      `GitHub Models API error (${status}): ${errText}`,
      HttpStatus.BAD_GATEWAY,
    );
  }
}

export async function chatCompletion(
  prompt: string,
  options: ChatCompletionOptions,
): Promise<string> {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new HttpException(
      'GitHub Models not configured (GITHUB_TOKEN missing on API server).',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  const model = process.env.GITHUB_MODEL ?? DEFAULT_MODEL;

  const modelRes = await fetch(GITHUB_MODELS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.max_tokens,
      temperature: options.temperature,
    }),
  });

  if (!modelRes.ok) {
    const errText = await modelRes.text();
    throw githubModelsHttpException(modelRes.status, errText);
  }

  const modelData = (await modelRes.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (modelData.error) {
    throw new HttpException(
      `GitHub Models API error: ${modelData.error.message ?? JSON.stringify(modelData.error)}`,
      HttpStatus.BAD_GATEWAY,
    );
  }

  const content = modelData?.choices?.[0]?.message?.content?.trim() ?? '';
  if (!content) {
    throw new HttpException('GitHub Models returned empty content', HttpStatus.BAD_GATEWAY);
  }

  return content;
}
