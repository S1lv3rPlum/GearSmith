import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [accentColor, setAccentColor] = useState('#FF6F61');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const savedMode = await AsyncStorage.getItem('themeMode');
        const savedAccent = await AsyncStorage.getItem('accentColor');
        if (savedMode) setMode(savedMode);
        if (savedAccent) setAccentColor(savedAccent);
      } catch (e) {
        console.warn('Failed to load theme preferences', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('themeMode', mode);
        await AsyncStorage.setItem('accentColor', accentColor);
      } catch (e) {
        console.warn('Failed to save theme preferences', e);
      }
    })();
  }, [mode, accentColor]);
  const toggleThemeMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  // Memoize theme object to optimize rerenders
  const theme = useMemo(() => ({
    mode,
    background: mode === 'light' ? '#fff' : '#121212',
    text: mode === 'light' ? '#000' : '#fff',
    accent: accentColor,
  }), [mode, accentColor]);
  if (isLoading) {
    // Optionally return null or a loading spinner, so children don’t flash default theme
    return null;
  }
  return (
    <ThemeContext.Provider value={{ theme, mode, toggleThemeMode, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};