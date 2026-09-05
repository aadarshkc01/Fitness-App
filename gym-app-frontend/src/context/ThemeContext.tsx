import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    (localStorage.getItem('theme-mode') as ThemeMode) || 'system'
  );

  function applyTheme(m: ThemeMode) {
    const resolved = m === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : m;
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }

  function setMode(m: ThemeMode) {
    localStorage.setItem('theme-mode', m);
    setModeState(m);
    applyTheme(m);
  }

  useEffect(() => {
    applyTheme(mode);
    if (mode === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mql.addEventListener('change', listener);
      return () => mql.removeEventListener('change', listener);
    }
  }, [mode]);

  return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
