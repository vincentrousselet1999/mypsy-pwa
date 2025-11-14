'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { loadQuestionnaire, QuestionnaireAnswers, saveQuestionnaire } from '@/lib/questionnaire';

const reasons = ['Anxiété', 'Stress', 'Sommeil', 'Relations', 'Autre'];
const tones: QuestionnaireAnswers['tone'][] = ['doux', 'direct'];

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<QuestionnaireAnswers>({});

  useEffect(() => {
    const saved = loadQuestionnaire();
    setForm(saved);
  }, []);

  const update = (patch: Partial<QuestionnaireAnswers>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const steps = [
    (
      <div key="step-1">
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          E-mail (optionnel)
          <input
            type="email"
            value={form.email ?? ''}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="toi@email.com"
            style={inputStyle}
          />
        </label>
        <label style={checkboxStyle}>
          <input type="checkbox" checked={Boolean(form.consent)} onChange={(e) => update({ consent: e.target.checked })} />
          <span>Je confirme avoir 18 ans ou plus et comprendre que MyPsy n’est pas un service médical.</span>
        </label>
      </div>
    ),
    (
      <div key="step-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Motif principal
          <select value={form.reason ?? ''} onChange={(e) => update({ reason: e.target.value })} style={inputStyle}>
            <option value="">Choisir…</option>
            {reasons.map((reason) => (
              <option key={reason} value={reason.toLowerCase()}>
                {reason}
              </option>
            ))}
          </select>
        </label>
        <label>
          Intensité actuelle : {form.intensity ?? 0}/10
          <input
            type="range"
            min={0}
            max={10}
            value={form.intensity ?? 0}
            onChange={(e) => update({ intensity: Number(e.target.value) })}
          />
        </label>
        <label>
          Depuis quand ressens-tu cela ?
          <input
            type="text"
            value={form.duration ?? ''}
            onChange={(e) => update({ duration: e.target.value })}
            style={inputStyle}
          />
        </label>
        <label>
          Déclencheurs identifiés
          <textarea
            value={form.triggers ?? ''}
            onChange={(e) => update({ triggers: e.target.value })}
            style={{ ...inputStyle, minHeight: '90px' }}
          />
        </label>
      </div>
    ),
    (
      <div key="step-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Objectif pour les 2 prochaines semaines
          <textarea
            value={form.goal ?? ''}
            onChange={(e) => update({ goal: e.target.value })}
            style={{ ...inputStyle, minHeight: '90px' }}
          />
        </label>
        <label>
          Préférence de ton
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {tones.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => update({ tone })}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '999px',
                  border: form.tone === tone ? '2px solid #140d07' : '1px solid var(--color-border)',
                  background: form.tone === tone ? 'var(--color-card)' : 'transparent'
                }}
              >
                {tone === 'doux' ? 'Doux' : 'Direct'}
              </button>
            ))}
          </div>
        </label>
        <label>
          Créneau préféré pour échanger
          <input
            type="text"
            value={form.preferredSlot ?? ''}
            onChange={(e) => update({ preferredSlot: e.target.value })}
            placeholder="ex : fin d’après-midi"
            style={inputStyle}
          />
        </label>
      </div>
    )
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      saveQuestionnaire(form);
      router.push('/plans');
    }
  };

  const canProceed = step !== 0 || Boolean(form.consent);

  return (
    <PageContainer>
      <h1>Questionnaire</h1>
      <p>Ces réponses restent localement sur ton appareil et servent à personnaliser Camille.</p>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem' }}>{steps[step]}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" disabled={step === 0} onClick={() => setStep((prev) => Math.max(0, prev - 1))} style={navBtn}>
          Retour
        </button>
        <button type="button" onClick={handleNext} disabled={!canProceed} style={primaryBtn}>
          {step === steps.length - 1 ? 'Continuer vers les plans' : 'Continuer'}
        </button>
      </div>
    </PageContainer>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--color-border)',
  marginTop: '0.3rem'
};

const checkboxStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'flex-start'
};

const navBtn: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: '999px',
  border: '1px solid var(--color-border)',
  background: 'transparent'
};

const primaryBtn: React.CSSProperties = {
  padding: '0.85rem 1.7rem',
  borderRadius: '999px',
  border: 'none',
  background: '#140d07',
  color: '#ffffcc',
  fontWeight: 600,
  cursor: 'pointer'
};
