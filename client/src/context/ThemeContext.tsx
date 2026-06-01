import { createContext, useState, type ReactNode } from 'react';
import type { ThemeId, ThemeConfig } from '../types';
import { themes } from '../themes';

export interface ThemeContextValue {
  activeTheme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (id: ThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  activeTheme: 'claude',
  themeConfig: themes.claude,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>('claude');

  const value: ThemeContextValue = {
    activeTheme,
    themeConfig: themes[activeTheme],
    setTheme: setActiveTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
