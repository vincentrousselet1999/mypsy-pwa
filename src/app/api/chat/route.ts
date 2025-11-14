import { NextRequest, NextResponse } from 'next/server';
import { authAndQuota } from '@/lib/quota';
import { psyPrompt } from '@/psyPrompt';
import { openai, getModel } from '@/lib/openaiClient';

const CRISIS_MESSAGE = 'Si tu es en danger ou en détresse aiguë, appelle 3114 (France) ou 112 tout de suite.';

export async function POST(request: NextRequest) {
  const authResult = await authAndQuota(request);
  if (!authResult.ok) {
    return NextResponse.json(authResult.body, { status: authResult.status });
  }

  let payload: { message?: string; questionnaire?: Record<string, string | number | boolean | null>; userId?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Requête invalide.' }, { status: 400 });
  }

  const userMessage = payload.message?.trim();
  if (!userMessage) {
    return NextResponse.json({ message: 'Message requis.' }, { status: 400 });
  }

  if (!openai) {
    return NextResponse.json({ message: 'OpenAI non configuré.' }, { status: 500 });
  }

  try {
    const moderation = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input: userMessage
    });
    const result = moderation.results?.[0];
    const categories = (result?.categories ?? {}) as Record<string, boolean>;
    const flaggedCrisis = Boolean(
      result?.flagged || categories['self-harm'] || categories['self_harm'] || categories['violence'] || categories['sexual/minors']
    );
    if (flaggedCrisis) {
      return NextResponse.json({ reply: CRISIS_MESSAGE, quotaRemainingToday: authResult.quotaRemaining }, { status: 200 });
    }
  } catch (error) {
    console.error('Moderation error', error);
  }

  const contextParts: string[] = [];
  const questionnaire = payload.questionnaire || {};
  if (questionnaire.reason) contextParts.push(`Motif : ${questionnaire.reason}`);
  if (questionnaire.intensity) contextParts.push(`Intensité : ${questionnaire.intensity}/10`);
  if (questionnaire.goal) contextParts.push(`Objectif court terme : ${questionnaire.goal}`);
  if (questionnaire.tone) contextParts.push(`Ton préféré : ${questionnaire.tone}`);
  if (questionnaire.preferredSlot) contextParts.push(`Créneau préféré : ${questionnaire.preferredSlot}`);

  const contextSummary = contextParts.join(' • ') || 'Pas d’informations additionnelles.';

  try {
    const response = await openai.responses.create({
      model: getModel(),
      input: [
        {
          role: 'system',
          content: `${psyPrompt}\nContexte utilisateur : ${contextSummary}. Plan actuel : ${authResult.plan.name}. SLA : ${authResult.plan.sla}.`
        },
        { role: 'user', content: userMessage }
      ],
      metadata: { userId: authResult.userId }
    });

    const replyText = (response.output_text ?? '').trim() ||
      'Camille est indisponible pour le moment. Merci de réessayer plus tard.';

    const res = NextResponse.json({ reply: replyText, quotaRemainingToday: authResult.quotaRemaining });
    if (authResult.quotaCookie && typeof authResult.quotaCookie === 'object' && 'name' in authResult.quotaCookie) {
      res.cookies.set(authResult.quotaCookie);
    }
    return res;
  } catch (error) {
    console.error('Chat error', error);
    return NextResponse.json(
      {
        message:
          'Impossible de générer une réponse pour l’instant. Réessaie dans quelques minutes ou contacte le 3114 / 112 en cas d’urgence.'
      },
      { status: 500 }
    );
  }
}
