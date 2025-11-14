export interface QuestionnaireAnswers {
  email?: string;
  consent?: boolean;
  reason?: string;
  intensity?: number;
  duration?: string;
  triggers?: string;
  goal?: string;
  tone?: 'doux' | 'direct';
  preferredSlot?: string;
}

export const QUESTIONNAIRE_STORAGE_KEY = 'mypsy-questionnaire';

export function saveQuestionnaire(data: QuestionnaireAnswers) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUESTIONNAIRE_STORAGE_KEY, JSON.stringify(data));
}

export function loadQuestionnaire(): QuestionnaireAnswers {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(QUESTIONNAIRE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
