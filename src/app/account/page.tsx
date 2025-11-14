'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { loadQuestionnaire } from '@/lib/questionnaire';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [quotaRemaining, setQuotaRemaining] = useState<string>('—');
  const [planInfo] = useState({
    id: 'FREE_TRIAL',
    quota: '50 msgs/j',
    hours: '10h–22h',
    days: '6j/7'
  });

  useEffect(() => {
    const data = loadQuestionnaire();
    if (data.email) {
      setEmail(data.email);
    }
    const storedQuota = window.localStorage.getItem('mypsy-quota-remaining');
    if (storedQuota) {
      setQuotaRemaining(storedQuota);
    }
  }, []);

  return (
    <PageContainer>
      <h1>Compte</h1>
      <section style={card}>
        <h2>Profil</h2>
        <p>E-mail enregistré : {email || '—'}</p>
        <p>Plan actif : {planInfo.id}</p>
        <p>Quota quotidien : {planInfo.quota}</p>
        <p>Quota estimé restant aujourd’hui : {quotaRemaining}</p>
        <p>Disponibilité : {planInfo.hours} ({planInfo.days})</p>
      </section>
      <section style={card}>
        <h2>Préférence d’affichage</h2>
        <ThemeToggle />
      </section>
    </PageContainer>
  );
}

const card: React.CSSProperties = {
  border: '1px solid var(--color-border)',
  borderRadius: '1rem',
  padding: '1.5rem'
};
