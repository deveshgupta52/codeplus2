import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { loader } from "@monaco-editor/react";
import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';

const themes = [darkTheme, lightTheme];

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('theme') || 'dark');
  
  const activeTheme = useMemo(() => {
      return themes.find(t => t.id === themeId) || darkTheme; 
  }, [themeId]);

  const toggleTheme = () => {
    setThemeId(prevId => (prevId === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (activeTheme) {
      Object.entries(activeTheme.variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      localStorage.setItem('theme', themeId);

      loader.init().then((monaco) => {
        try {
            monaco.editor.defineTheme(darkTheme.id, darkTheme.editorTheme);
            monaco.editor.defineTheme(lightTheme.id, lightTheme.editorTheme);
        } catch (e) {
        }
      });
    }
  }, [activeTheme, themeId]);

  const value = { themeId, setThemeId, themes, activeTheme, toggleTheme };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};