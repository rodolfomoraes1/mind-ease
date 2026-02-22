import { getProfileConfig } from '../../utils/navigationProfile';

describe('getProfileConfig', () => {
  it('retorna configuração correta para perfil beginner', () => {
    const config = getProfileConfig('beginner');

    expect(config.maxTasksInDoing).toBe(1);
    expect(config.simplifiedKanban).toBe(true);
    expect(config.showTooltips).toBe(true);
    expect(config.showOnboarding).toBe(true);
    expect(config.showAnalytics).toBe(false);
  });

  it('retorna configuração correta para perfil intermediate', () => {
    const config = getProfileConfig('intermediate');

    expect(config.maxTasksInDoing).toBe(3);
    expect(config.simplifiedKanban).toBe(false);
    expect(config.showTooltips).toBe(false);
    expect(config.showAnalytics).toBe(false);
  });

  it('retorna configuração correta para perfil advanced', () => {
    const config = getProfileConfig('advanced');

    expect(config.maxTasksInDoing).toBe(5);
    expect(config.simplifiedKanban).toBe(false);
    expect(config.showAnalytics).toBe(true);
  });

  it('beginner tem limite menor de tarefas em andamento que advanced', () => {
    const beginner = getProfileConfig('beginner');
    const advanced = getProfileConfig('advanced');

    expect(beginner.maxTasksInDoing).toBeLessThan(advanced.maxTasksInDoing);
  });
});
