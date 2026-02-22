/**
 * Configurações de comportamento por perfil de navegação.
 * Define limites, dicas e funcionalidades disponíveis para cada nível.
 */
export const profileConfig = {
  beginner: {
    /** Exibe tooltips explicativos nos elementos */
    showTooltips: true,
    /** Limite de tarefas simultâneas em "Fazendo" */
    maxTasksInDoing: 1,
    /** Exibe chip de limite de tarefas em andamento */
    showLimits: true,
    /** Oculta coluna "Feito" para reduzir sobrecarga visual */
    simplifiedKanban: true,
    /** Inicia o tour automático na primeira visita */
    showOnboarding: true,
    /** Exibe banner de boas-vindas com dicas */
    showWelcomeBanner: true,
    /** Mostra estatísticas avançadas */
    showAnalytics: false,
  },
  intermediate: {
    showTooltips: false,
    maxTasksInDoing: 3,
    showLimits: true,
    simplifiedKanban: false,
    showOnboarding: false,
    showWelcomeBanner: false,
    showAnalytics: false,
  },
  advanced: {
    showTooltips: false,
    maxTasksInDoing: 5,
    showLimits: false,
    simplifiedKanban: false,
    showOnboarding: false,
    showWelcomeBanner: false,
    showAnalytics: true,
  },
} as const;

export type NavigationProfile = keyof typeof profileConfig;

export function getProfileConfig(profile: NavigationProfile) {
  return profileConfig[profile] ?? profileConfig.intermediate;
}
