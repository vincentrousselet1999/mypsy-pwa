import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

export function getModel() {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}
