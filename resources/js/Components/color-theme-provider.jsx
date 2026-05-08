import React, { createContext, useContext, useEffect, useState } from 'react';

const ColorThemeContext = createContext({
  colorTheme: 'default',
  setColorTheme: () => {},
});

export const useColorTheme = () => useContext(ColorThemeContext);

export function ColorThemeProvider({ children }) {
  const [colorTheme, setColorTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('color-theme') || 'default';
    }
    return 'default';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('color-theme', colorTheme);
  }, [colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}
