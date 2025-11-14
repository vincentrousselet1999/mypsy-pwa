'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type ThemeChoice = 'cream' | 'dark' | 'white';

const STORAGE_KEY = 'mypsy-theme';

interface ThemeContextValue {
  theme: ThemeChoice;
  setTheme: (next: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>('cream');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
    if (saved) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'cream');
    }
  }, []);

  const setTheme = (next: ThemeChoice) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeChoice() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeChoice must be used within ThemeProvider');
  }
  return ctx;
}
