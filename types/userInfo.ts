export interface CognitivePreferences {
  complexityLevel: 'simple' | 'moderate' | 'full';
  focusMode: boolean;
  summaryMode: boolean;
  contrastLevel: 'low' | 'medium' | 'high';
  spacingLevel: 'compact' | 'normal' | 'relaxed';
  fontSize: 'small' | 'medium' | 'large';
  cognitiveAlerts: boolean;
  animationsEnabled: boolean;
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
  complexityLevel: 'moderate',
  focusMode: false,
  summaryMode: false,
  contrastLevel: 'medium',
  spacingLevel: 'normal',
  fontSize: 'medium',
  cognitiveAlerts: true,
  animationsEnabled: true,
};