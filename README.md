# Mind Ease
Hackaton final - Postech Fiap

## Escopo do projeto
Objetivo é facilitar a vida acadêmica e profissional de pessoas neurodivergentes e/ou com desafios de processamento cognitivo:

## Competências aplicadas
- Arquitetura (Clean, Componentização)
- Desenvolvimento Web (React, Next.js)
- Acessibilidade digital
- Testes, CI/CD e boas práticas

## Requisitos funcionais
### 1. Painel Cognitivo Personalizável
Dashboard onde o usuário ajusta:

- Nível de complexidade da interface
- Modo de foco (esconde distrações)
- Modo resumo / modo detalhado
- Contraste, espaçamento e tamanho de fonte
- Alertas cognitivos (ex.: “você está muito tempo nesta tarefa”)

### 2. Organizador de Tarefas com Suporte Cognitivo
Sistema de tarefas com:

- Etapas visuais (Kanban simplificado)
- Timers com controle de foco (método Pomodoro adaptado)
- Checklist inteligente para reduzir sobrecarga
- Avisos de transição suave entre atividades

### 3. Perfil do Usuário + Configurações Persistentes
Armazenar preferências como:

- Modo de foco
- Intensidade de contraste e espaçamento
- Perfil de navegação
- Necessidades específicas
- Rotinas de estudo ou trabalho

## Tecnologias esperadas
### Arquitetura
- Separação clara entre módulos (painel, biblioteca, tarefas, perfil)
- Comunicação entre microapps caso utilize

### Desenvolvimento Web
- TypeScript
- React + Next.js

### Clean Architecture
- Camada de domínio isolada
- Casos de uso independentes de UI
- Adaptadores e interfaces claras

## Acessibilidade cognitiva (obrigatório)
- Níveis ajustáveis de complexidade
- Componentes de foco
- Ritmos guiados na interface
- Redução de estímulos visuais
- Animações controláveis

## Entregável
- Projetos no GitHub
- Subir o link do vídeo e do projeto na plataforma da FIAP em um arquivo .docx ou .txt

## Checklist de funcionalidades
- [ ] Painel cognitivo personalizável
- [ ] Organizador de tarefas com suporte cognitivo
- [ ] Perfil do usuário + configurações persistentes
- [ ] Acessibilidade cognitiva (níveis, foco, ritmos, estímulos, animações)

## Checklist técnico
- [ ] Separação clara entre módulos (painel, biblioteca, tarefas, perfil)
- [ ] Comunicação entre microapps (se aplicável)
- [ ] Arquitetura de microfrontend definida (se aplicável)
- [ ] Design System (tokens, tipografia, cores, espaçamentos)
- [ ] Web em TypeScript
- [ ] Web em React + Next.js
- [ ] Domínio isolado (Clean Architecture)
- [ ] Casos de uso independentes de UI
- [ ] Adaptadores e interfaces claras
- [ ] Acessibilidade cognitiva implementada
- [ ] State management com Context API (ou equivalente)
- [ ] Testes unitários, integração e e2e
- [ ] GitHub Actions para CI/CD
- [ ] Segurança: hash de senhas com bcrypt, validação de entrada e armazenamento seguro
- [ ] Eficiência: memoização (React.memo), hooks de otimização (useMemo/useCallback), lazy loading e code splitting
- [ ] Observabilidade: logs estruturados e monitoramento de erros
- [ ] Performance: cache local, debounce/throttle em inputs, compressão de assets