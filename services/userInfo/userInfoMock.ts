import type { UserInfo } from '../../types/userInfo';

/**
 * Mock de dados do usuário — simula retorno de uma API real.
 * Substitua por uma chamada real (ex.: Firestore, REST API) quando disponível.
 */
export const userInfoMock: UserInfo = {
  id: 'mock-user-001',
  name: 'Usuário MindEase',
  email: 'usuario@mindease.com',
  avatarUrl: undefined,

  navigationProfile: 'intermediate',

  specificNeeds: ['TDAH', 'Dislexia'],

  studyRoutine: 'Segunda a Sexta, 19h–21h',
  workRoutine: 'Segunda a Sexta, 9h–18h',

  cognitivePreferences: {
    complexityLevel: 'full',
    focusMode: false,
    summaryMode: false,
    spacingLevel: 'normal',
    fontSize: 'medium',
    cognitiveAlerts: true,
    animationsEnabled: true,
    alertIntervalMinutes: 25,
  },
};