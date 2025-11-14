'use client';

import { useThemeChoice } from './ThemeProvider';

const OPTIONS = [
  { value: 'cream', label: 'Crème' },
  { value: 'dark', label: 'Sombre' },
  { value: 'white', label: 'Blanc' }
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useThemeChoice();

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '999px',
            border: option.value === theme ? '2px solid #140d07' : '1px solid var(--color-border)',
            background: option.value === theme ? 'var(--color-card)' : 'transparent',
            cursor: 'pointer'
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
