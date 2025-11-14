// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // le SDK OpenAI a besoin de Node, pas de l'edge runtime

function inOpenHours() {
  const tz = process.env.TIMEZONE || "Europe/Paris";
  const start = Number(process.env.OPEN_HOURS_START || 10);
  const end = Number(process.env.OPEN_HOURS_END || 22);
  const hour = Number(
    new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(new Date())
  );
  return hour >= start && hour < end;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { message?: string } | null;
    const message = body?.message?.toString().trim();
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    if (!inOpenHours()) {
      return NextResponse.json(
        { reply: "Je réponds entre 10h et 22h (Europe/Paris). En urgence : 3114 / 112." },
        { status: 200 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Modération (cast typé sûr)
    try {
      // @ts-ignore (selon versions SDK)
      const moderation = await openai.moderations.create({
        model: "omni-moderation-latest",
        input: message,
      });
      const result = moderation?.results?.[0];
      const categories = (result?.categories ?? {}) as Record<string, boolean>;
      const flaggedCrisis = Boolean(
        result?.flagged ||
          categories["self-harm"] ||
          categories["self_harm"] ||
          categories["violence"] ||
          categories["sexual/minors"]
      );
      if (flaggedCrisis) {
        return NextResponse.json(
          { reply: "Si tu es en danger ou en détresse aiguë, appelle 3114 (France) ou 112 tout de suite." },
          { status: 200 }
        );
      }
    } catch {
      // si la modération échoue, on continue quand même
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const system =
      "Tu es Camille, soutien psycho-émotionnel non médical. " +
      "Accueil chaleureux, questions ouvertes, pas de sophrologie/respiration guidée ni conseils médicaux. " +
      "Si risque (suicide/violence/détresse), orienter immédiatement vers 3114/112.";

    const r = await openai.responses.create({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
    });

    const text = (r as any)?.output_text || "Je suis là. Dis-m’en un peu plus.";
    return NextResponse.json({ reply: text }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Échec serveur" }, { status: 500 });
  }
}
