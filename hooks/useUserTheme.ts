import { useUserTheme } from '../context/ThemeContext';

export const useUserThemePreferences = () => {
  const { preferences, updatePreferences, isLoading } = useUserTheme();
  
  const setPrimaryColor = (color: string) => updatePreferences({ primaryColor: color });
  const setFontSize = (size: 'small' | 'medium' | 'large') => updatePreferences({ fontSize: size });
  const setMode = (mode: 'light' | 'dark' | 'opaque') => updatePreferences({ mode });
  const setBorderRadius = (radius: number) => updatePreferences({ borderRadius: radius });

  return {
    preferences,
    isLoading,
    setPrimaryColor,
    setFontSize,
    setMode,
    setBorderRadius,
  };
};