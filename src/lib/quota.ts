import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { getNowInTz, secondsUntilMidnight } from './time';
import { getPlan } from './plans';

export interface QuotaRecord {
  date: string;
  used: number;
}

export interface QuotaStore {
  consume(userId: string, dailyLimit: number): { allowed: boolean; remaining: number };
  seed(userId: string, record: QuotaRecord): void;
}

class InMemoryQuotaStore implements QuotaStore {
  private store = new Map<string, QuotaRecord>();

  consume(userId: string, dailyLimit: number) {
    const today = getNowInTz().toISODate();
    const current = this.store.get(userId);
    if (!current || current.date !== today) {
      this.store.set(userId, { date: today, used: 0 });
    }
    const fresh = this.store.get(userId)!;
    if (fresh.used >= dailyLimit) {
      return { allowed: false, remaining: 0 };
    }
    fresh.used += 1;
    this.store.set(userId, fresh);
    return { allowed: true, remaining: Math.max(0, dailyLimit - fresh.used) };
  }

  seed(userId: string, record: QuotaRecord) {
    const today = getNowInTz().toISODate();
    if (record.date === today) {
      this.store.set(userId, record);
    }
  }
}

const quotaStore: QuotaStore = new InMemoryQuotaStore();
const COOKIE_NAME = 'mypsy-quota';
const SECRET = process.env.JWT_SECRET || 'local-dev-secret';

interface QuotaCookiePayload {
  date: string;
  used: number;
  limit: number;
}

function encodeCookie(data: QuotaCookiePayload) {
  const payload = JSON.stringify(data);
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64url') + '.' + signature;
}

function decodeCookie(raw: string | undefined): QuotaCookiePayload | null {
  if (!raw) return null;
  const [payloadB64, signature] = raw.split('.');
  if (!payloadB64 || !signature) return null;
  const payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  if (expected !== signature) return null;
  try {
    return JSON.parse(payload) as QuotaCookiePayload;
  } catch {
    return null;
  }
}

export async function authAndQuota(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return {
      ok: false as const,
      status: 401,
      body: {
        message: 'Utilisateur non identifié. Rafraîchis la page puis relance la conversation.'
      }
    };
  }

  const plan = getPlan('FREE_TRIAL');
  if (!plan) {
    return {
      ok: false as const,
      status: 500,
      body: { message: 'Plan introuvable.' }
    };
  }

  const limit = typeof plan.quotaPerDay === 'number' ? plan.quotaPerDay : Infinity;

  const cookiePayload = decodeCookie(request.cookies.get(COOKIE_NAME)?.value);
  if (cookiePayload && cookiePayload.limit === limit) {
    quotaStore.seed(userId, { date: cookiePayload.date, used: cookiePayload.used });
  }

  if (!withinOperatingHours()) {
    return {
      ok: false as const,
      status: 429,
      body: {
        message:
          'MyPsy répond de 10h à 22h (heure de Paris), 6j/7. Pour une urgence, contacte immédiatement le 3114 ou le 112.'
      }
    };
  }

  if (!Number.isFinite(limit)) {
    return {
      ok: true as const,
      userId,
      plan,
      quotaRemaining: Infinity,
      quotaCookie: ''
    };
  }

  const consumption = quotaStore.consume(userId, limit);
  if (!consumption.allowed) {
    return {
      ok: false as const,
      status: 429,
      body: {
        message:
          'Tu as atteint la limite de messages pour aujourd’hui. Reviens demain, ou contacte le 3114 / 112 en cas d’urgence.'
      }
    };
  }

  const today = getNowInTz().toISODate();
  const cookieValue = encodeCookie({ date: today, used: limit - consumption.remaining, limit });

  return {
    ok: true as const,
    userId,
    plan,
    quotaRemaining: consumption.remaining,
    quotaCookie: {
      name: COOKIE_NAME,
      value: cookieValue,
      maxAge: secondsUntilMidnight(),
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: true,
      path: '/'
    }
  };
}

function withinOperatingHours() {
  const now = getNowInTz();
  if (now.weekday === 7) {
    return false;
  }
  const start = Number(process.env.OPEN_HOURS_START ?? 10);
  const end = Number(process.env.OPEN_HOURS_END ?? 22);
  const hour = now.hour + now.minute / 60;
  return hour >= start && hour < end;
}
