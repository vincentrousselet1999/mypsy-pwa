import { FormEvent, useState } from 'react';

interface ChatResponse {
  reply: string;
}

export default function ChatPage() {
  const [message, setMessage] = useState('Bonjour, peux-tu m’aider ?');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setReply('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!res.ok) {
        throw new Error('La requête a échoué');
      }

      const data: ChatResponse = await res.json();
      setReply(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
    }}>
      <h1>Tester l’API /api/chat</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <button type="submit" disabled={loading} style={{
          background: '#140D07',
          color: '#FFFFCC',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer'
        }}>
          {loading ? 'Envoi…' : 'Envoyer'}
        </button>
      </form>
      {error && <p style={{ color: '#B00020' }}>Erreur : {error}</p>}
      {reply && (
        <section>
          <h2>Réponse</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{reply}</p>
        </section>
      )}
    </main>
  );
}
