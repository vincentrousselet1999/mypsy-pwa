'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/questionnaire', label: 'Questionnaire' },
  { href: '/plans', label: 'Plans' },
  { href: '/chat', label: 'Chat' },
  { href: '/account', label: 'Compte' }
];

export function AppHeader() {
  const pathname = usePathname();
  return (
    <header style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
          MyPsy
        </Link>
        <nav style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                border: pathname === link.href ? '2px solid #140d07' : '1px solid transparent',
                background: pathname === link.href ? 'var(--color-card)' : 'transparent'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
