export type FontSize = 'small' | 'medium' | 'large';
export type ThemeMode = 'light' | 'dark' | 'opaque';
export type SpacingLevel = 'compact' | 'normal' | 'relaxed';

export interface UserThemePreferences {
  primaryColor: string;       // Cor primária escolhida (ex: "#FF6B6B")
  secondaryColor?: string;    // Cor secundária (opcional)
  mode: ThemeMode;            // light | dark | opaque
  fontSize: FontSize;         // small | medium | large
  spacingLevel?: SpacingLevel; // compact | normal | relaxed
  borderRadius?: number;      // 4, 8, 12 etc
  reducedMotion?: boolean;    // Para acessibilidade
  highContrast?: boolean;     // Para acessibilidade
}

export interface UserThemeContextType {
  preferences: UserThemePreferences;
  updatePreferences: (newPrefs: Partial<UserThemePreferences>) => Promise<void>;
  isLoading: boolean;
}