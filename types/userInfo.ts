export interface CognitivePreferences {
  /** 'simple' = sem gráficos; 'full' = exibe tudo */
  complexityLevel: 'simple' | 'full';
  focusMode: boolean;
  summaryMode: boolean;
  spacingLevel: 'compact' | 'normal' | 'relaxed';
  fontSize: 'small' | 'medium' | 'large';
  cognitiveAlerts: boolean;
  animationsEnabled: boolean;
  /** Intervalo em minutos para o 1º alerta. O 2º dispara em 2× esse valor. Padrão: 25 */
  alertIntervalMinutes: number;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  navigationProfile: 'beginner' | 'intermediate' | 'advanced';
  specificNeeds: string[];
  studyRoutine?: string;
  workRoutine?: string;
  cognitivePreferences: CognitivePreferences;
}

export const defaultCognitivePreferences: CognitivePreferences = {
  complexityLevel: 'full',
  focusMode: false,
  summaryMode: false,
  spacingLevel: 'normal',
  fontSize: 'medium',
  cognitiveAlerts: true,
  animationsEnabled: true,
  alertIntervalMinutes: 25,
};