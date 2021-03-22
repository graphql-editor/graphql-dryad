import { useState } from 'react';
import { DarkTheme } from '@/Theming/DarkTheme';
import { createContainer } from 'unstated-next';
const useThemeContainer = createContainer(() => {
  const [currentTheme, setCurrentTheme] = useState(DarkTheme);
  return {
    theme: currentTheme,
    setTheme: setCurrentTheme,
  };
});
export const useTheme = useThemeContainer.useContainer;
export const ThemeProvider = useThemeContainer.Provider;
