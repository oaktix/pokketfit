'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Read saved theme from localStorage
    const saved = localStorage.getItem('pokketfit_theme') as Theme | null;
    if (saved && (saved === 'dark' || saved === 'light' || saved === 'system')) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let active: 'dark' | 'light';
      if (theme === 'system') {
        active = mediaQuery.matches ? 'dark' : 'light';
      } else {
        active = theme;
      }

      setResolvedTheme(active);
      if (active === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    applyTheme();

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('pokketfit_theme', newTheme);
    } catch (e) {
      // Ignored if local storage disabled
    }
  };

  // Inject light-mode overrides when active
  useEffect(() => {
    const styleId = 'pokketfit-light-override';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    if (resolvedTheme === 'light') {
      styleEl.textContent = `
        .light, html.light { --bg-page: #F8F6F4; --surface-card: #FFFFFF; --surface-card-inset: #F0EDE8; --text-primary: #1A140F; --text-secondary: #706760; --border-subtle: rgba(0,0,0,0.07); --primary-orange-subtle: rgba(227, 114, 16, 0.12); }
        html.light body { background-color: #F8F6F4 !important; color: #1A140F !important; }
        html.light .bg-\[\#160D0A\], html.light .bg-\[\#110D0A\] { background-color: #F0EDE8 !important; }
        html.light .bg-\[\#16120E\] { background-color: #FFFFFF !important; border-color: rgba(0,0,0,0.08) !important; }
        html.light .bg-\[\#0A0705\] { background-color: #F8F6F4 !important; }
        html.light .text-\[\#FAF8F5\] { color: #1A140F !important; }
        html.light .text-\[\#C7BFB5\] { color: #3F3730 !important; }
        html.light .text-\[\#A8A096\] { color: #706760 !important; }
        html.light .text-\[\#8A8279\] { color: #706760 !important; }
        html.light .border-\[\#2A241E\] { border-color: rgba(0,0,0,0.08) !important; }
        html.light .shadow-card-dark { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
        html.light .shadow-glow-orange { box-shadow: 0 4px 20px rgba(227,114,16,0.15) !important; }
      `;
    } else {
      styleEl.textContent = '';
    }
    return () => {
      // Keep style element for reuse
    };
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
