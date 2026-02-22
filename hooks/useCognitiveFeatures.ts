import { useCallback } from 'react';
import { useUserInfo } from './useUserInfo';
import { useUserTheme } from '../context/ThemeContext';
import type { CognitivePreferences } from '../types/userInfo';

/**
 * Hook que encapsula todas as operações de preferências cognitivas.
 * Sincroniza fontSize e spacingLevel com o tema MUI via useUserTheme.
 */
export function useCognitiveFeatures() {
  const { userInfo, loading, updateCognitivePrefs } = useUserInfo();
  const { updatePreferences } = useUserTheme();

  const preferences = userInfo?.cognitivePreferences;

  const updatePreference = useCallback(
    async <K extends keyof CognitivePreferences>(key: K, value: CognitivePreferences[K]) => {
      await updateCognitivePrefs({ [key]: value });
    },
    [updateCognitivePrefs],
  );

  const toggleFocusMode = useCallback(
    () => updatePreference('focusMode', !preferences?.focusMode),
    [preferences, updatePreference],
  );

  const toggleAnimations = useCallback(
    () => updatePreference('animationsEnabled', !preferences?.animationsEnabled),
    [preferences, updatePreference],
  );

  const toggleSummaryMode = useCallback(
    () => updatePreference('summaryMode', !preferences?.summaryMode),
    [preferences, updatePreference],
  );

  const toggleCognitiveAlerts = useCallback(
    () => updatePreference('cognitiveAlerts', !preferences?.cognitiveAlerts),
    [preferences, updatePreference],
  );

  /** Atualiza fontSize em CognitivePreferences E no tema MUI */
  const setFontSize = useCallback(
    async (size: CognitivePreferences['fontSize']) => {
      await updatePreference('fontSize', size);
      await updatePreferences({ fontSize: size });
    },
    [updatePreference, updatePreferences],
  );

  /** Atualiza spacingLevel em CognitivePreferences E no tema MUI */
  const setSpacingLevel = useCallback(
    async (spacing: CognitivePreferences['spacingLevel']) => {
      await updatePreference('spacingLevel', spacing);
      await updatePreferences({ spacingLevel: spacing });
    },
    [updatePreference, updatePreferences],
  );

  const setComplexityLevel = useCallback(
    (level: CognitivePreferences['complexityLevel']) => updatePreference('complexityLevel', level),
    [updatePreference],
  );

  return {
    preferences,
    loading,
    updatePreference,
    toggleFocusMode,
    toggleAnimations,
    toggleSummaryMode,
    toggleCognitiveAlerts,
    setFontSize,
    setSpacingLevel,
    setComplexityLevel,
  };
}
