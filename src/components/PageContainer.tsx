import { ReactNode } from 'react';

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      {children}
    </div>
  );
}
