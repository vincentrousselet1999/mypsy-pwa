import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>MyPsy — Accueil</title>
        <meta name="description" content="MyPsy – soutien psycho-émotionnel" />
      </Head>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
      }}>
        <h1>MyPsy — Écoute &amp; soutien</h1>
        <p>Testez rapidement l’API de chat interne (backend uniquement) via l’interface minimale.</p>
        <Link href="/chat" legacyBehavior>
          <a style={{
            background: '#140D07',
            color: '#FFFFCC',
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            textDecoration: 'none'
          }}>
            Ouvrir le chat</a>
        </Link>
      </main>
    </>
  );
}
