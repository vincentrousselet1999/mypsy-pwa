'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { loadQuestionnaire } from '@/lib/questionnaire';
import { ensureUserId } from '@/lib/user';

interface ChatMessage {
  id: string;
  from: 'user' | 'camille' | 'system';
  content: string;
  createdAt: number;
}

const HISTORY_KEY = 'mypsy-chat-history';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const welcome: ChatMessage = {
        id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
        from: 'camille',
        content:
          'Bienvenue, je suis Camille. Tu peux m’écrire librement — je t’écoute sans jugement. Pour commencer : qu’est-ce qui te pèse le plus en ce moment ?'
        ,
        createdAt: Date.now()
      };
      setMessages([welcome]);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify([welcome]));
    }
    const storedQuota = window.localStorage.getItem('mypsy-quota-remaining');
    if (storedQuota) {
      setQuotaRemaining(Number(storedQuota));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (!search) return messages;
    return messages.filter((msg) => msg.content.toLowerCase().includes(search.toLowerCase()));
  }, [messages, search]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const pendingMessage: ChatMessage = {
      id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      from: 'user',
      content: input.trim(),
      createdAt: Date.now()
    };
    setMessages((prev) => [...prev, pendingMessage]);
    setInput('');
    setLoading(true);
    try {
      const questionnaire = loadQuestionnaire();
      const userId = ensureUserId();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ message: pendingMessage.content, userId, questionnaire })
      });
      const data = await res.json();
      if (!res.ok) {
        const systemMessage: ChatMessage = {
          id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
          from: 'system',
          content: data?.message ?? 'Service momentanément indisponible.',
          createdAt: Date.now()
        };
        setMessages((prev) => [...prev, systemMessage]);
        return;
      }
      const remaining = data.quotaRemainingToday ?? null;
      setQuotaRemaining(remaining);
      if (typeof window !== 'undefined' && remaining !== null) {
        window.localStorage.setItem('mypsy-quota-remaining', String(remaining));
      }
      const reply: ChatMessage = {
        id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
        from: 'camille',
        content: data.reply,
        createdAt: Date.now()
      };
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      const systemMessage: ChatMessage = {
        id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
        from: 'system',
        content: 'Erreur réseau. Réessaie plus tard.',
        createdAt: Date.now()
      };
      setMessages((prev) => [...prev, systemMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <h1>Espace chat</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <span>Messages restants aujourd’hui : {quotaRemaining ?? '—'}</span>
        <button type="button" onClick={() => (window.location.href = 'tel:3114')} style={urgencyBtn}>
          Urgence 3114 / 112
        </button>
      </div>
      <input
        type="search"
        placeholder="Rechercher dans l’historique"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '40vh' }}>
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <div
              style={{
                background:
                  msg.from === 'user' ? '#140d07' : msg.from === 'camille' ? 'var(--color-card)' : 'transparent',
                color: msg.from === 'user' ? '#ffffcc' : 'inherit',
                border: msg.from === 'system' ? '1px solid var(--color-border)' : 'none',
                padding: '0.8rem 1rem',
                borderRadius: msg.from === 'user' ? '1.2rem 0 1.2rem 1.2rem' : '0 1.2rem 1.2rem 1.2rem'
              }}
            >
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              <small style={{ opacity: 0.7 }}>{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <textarea
          placeholder="Écris ton message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ ...inputStyle, flex: 1, minHeight: '100px' }}
        />
        <button type="button" onClick={sendMessage} disabled={loading} style={primaryBtn}>
          {loading ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </PageContainer>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--color-border)'
};

const primaryBtn: React.CSSProperties = {
  padding: '0.85rem 1.7rem',
  borderRadius: '0.9rem',
  border: 'none',
  background: '#140d07',
  color: '#ffffcc',
  fontWeight: 600,
  cursor: 'pointer'
};

const urgencyBtn: React.CSSProperties = {
  padding: '0.4rem 0.9rem',
  borderRadius: '0.75rem',
  border: '1px solid #c62828',
  background: 'transparent',
  color: '#c62828',
  fontWeight: 600
};
