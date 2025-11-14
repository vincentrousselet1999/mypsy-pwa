import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'MyPsy — Écoute & soutien',
  description: 'PWA de soutien psycho-émotionnel non médical. Dialogue sécurisé avec Camille.',
  applicationName: 'MyPsy',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="cream">
      <body>
        <ThemeProvider>
          <AppHeader />
          <main>{children}</main>
          <footer
            style={{
              borderTop: '1px solid var(--color-border)',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <p style={{ margin: 0 }}>Contact : 06 58 31 87 51 — mypsy.comani@gmail.com</p>
            <p style={{ margin: '0.35rem 0 0' }}>
              <a href="/legal/terms">Conditions</a> · <a href="/legal/privacy">Privacy</a> ·{' '}
              <a href="/legal/consent">Consentement</a>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
