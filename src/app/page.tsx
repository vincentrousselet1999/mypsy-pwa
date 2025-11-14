import Link from 'next/link';
import Image from 'next/image';
import { PageContainer } from '@/components/PageContainer';

export default function HomePage() {
  return (
    <PageContainer>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Image src="/logo.svg" width={120} height={120} alt="Logo MyPsy" />
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>MyPsy — Écoute & soutien</h1>
        <p style={{ maxWidth: '60ch', lineHeight: 1.6 }}>
          Une application web progressive, hors-store, pour échanger avec Camille, conseillère en soutien psycho-émotionnel non
          médical. Disponible sur les horaires définis, avec réponses écrites structurées et sécurisées.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/questionnaire"
            style={{
              padding: '0.9rem 1.6rem',
              background: '#140d07',
              color: '#ffffcc',
              borderRadius: '999px',
              fontWeight: 600
            }}
          >
            Commencer
          </Link>
          <Link
            href="/chat"
            style={{
              padding: '0.9rem 1.6rem',
              border: '1px solid var(--color-border)',
              borderRadius: '999px'
            }}
          >
            Accéder au chat
          </Link>
        </div>
      </section>
      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[{ title: 'PWA', text: 'Installe-la comme une app sur ton mobile en ajoutant le raccourci à l’écran d’accueil.' },
          { title: 'Soutien non médical', text: 'Camille écoute, reformule et propose des outils psycho-éducatifs.' },
          { title: 'Sécurité', text: 'Données chiffrées côté transport, quotas journaliers et modération systématique.' }].map(
          (card) => (
            <article key={card.title} style={{ border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>{card.title}</h3>
              <p style={{ margin: 0 }}>{card.text}</p>
            </article>
          )
        )}
      </section>
    </PageContainer>
  );
}
