import type { DriveStep } from 'driver.js';

export const tourSteps: Record<string, DriveStep[]> = {
  beginner: [
    {
      element: '#tour-header',
      popover: {
        title: '👋 Bem-vindo ao Mind Ease!',
        description:
          'Este é o painel principal. Aqui você acompanha tudo de forma clara e organizada.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-user-card',
      popover: {
        title: '👤 Seu perfil',
        description:
          'Veja suas preferências cognitivas, necessidades específicas e rotinas cadastradas.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-task-board',
      popover: {
        title: '✅ Organizador de Tarefas',
        description:
          'Gerencie suas tarefas com o Kanban. Arraste os cards entre as colunas conforme avançar.',
        side: 'top',
      },
    },
    {
      element: '#tour-add-task',
      popover: {
        title: '➕ Criar tarefa',
        description:
          'Clique aqui para adicionar uma nova tarefa. Você pode definir título, carga cognitiva e subtarefas.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-settings',
      popover: {
        title: '⚙️ Configurações',
        description:
          'Personalize fonte, espaçamento, modo de foco, Pomodoro e muito mais nas configurações.',
        side: 'bottom',
      },
    },
  ],

  intermediate: [
    {
      element: '#tour-task-board',
      popover: {
        title: '📋 Kanban completo',
        description:
          'Você tem até 3 tarefas simultâneas em andamento. Arraste entre colunas ou use o menu de cada card.',
        side: 'top',
      },
    },
    {
      element: '#tour-add-task',
      popover: {
        title: '➕ Nova tarefa',
        description:
          'Adicione tarefas com descrição, tags, pomodoros estimados e subtarefas detalhadas.',
        side: 'bottom',
      },
    },
    {
      element: '#tour-settings',
      popover: {
        title: '⚙️ Preferências',
        description:
          'Ajuste o modo resumo, contraste e alertas cognitivos para uma experiência personalizada.',
        side: 'bottom',
      },
    },
  ],

  advanced: [
    {
      element: '#tour-task-board',
      popover: {
        title: '🚀 Modo avançado',
        description:
          'Sem limites na coluna "Fazendo". Use tags e cargas cognitivas para organizar seu fluxo.',
        side: 'top',
      },
    },
  ],
};
