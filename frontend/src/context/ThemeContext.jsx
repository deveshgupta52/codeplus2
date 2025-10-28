import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { loader } from "@monaco-editor/react";

const themeModules = import.meta.glob('../themes/*.js', { eager: true });

const themes = Object.entries(themeModules).map(([path, module]) => {
  return { ...Object.values(module)[0] };
});

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('theme') || 'dark');
  const activeTheme = useMemo(() => themes.find(t => t.id === themeId), [themeId]);

  useEffect(() => {
    if (activeTheme) {
      Object.entries(activeTheme.variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      localStorage.setItem('theme', themeId);

      loader.init().then((monaco) => {
        monaco.editor.defineTheme(activeTheme.id, activeTheme.editorTheme);
      });
    }
  }, [activeTheme, themeId]);

  const value = { themeId, setThemeId, themes, activeTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};