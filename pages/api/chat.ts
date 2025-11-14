import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type Data = { reply: string } | { error: string };

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY manquante' });
  }

  const { message } = req.body as { message?: string };
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Le champ "message" est requis' });
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      input: `Tu es Camille, conseillère de soutien non médical. Réponds en français. Message: ${message}`
    });

    const reply = response.output_text?.trim() ?? '';
    return res.status(200).json({ reply: reply || 'Aucune réponse générée.' });
  } catch (error) {
    console.error('OpenAI error', error);
    return res.status(500).json({ error: 'Erreur lors de la génération de la réponse' });
  }
}
