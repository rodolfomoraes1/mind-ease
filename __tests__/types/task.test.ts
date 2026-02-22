import {
  COGNITIVE_LOAD_COLORS,
  COGNITIVE_LOAD_LABELS,
  POMODORO_DURATIONS,
} from '../../types/task';

describe('COGNITIVE_LOAD_COLORS', () => {
  it('define uma cor para cada nível de carga cognitiva', () => {
    expect(COGNITIVE_LOAD_COLORS.low).toBeDefined();
    expect(COGNITIVE_LOAD_COLORS.medium).toBeDefined();
    expect(COGNITIVE_LOAD_COLORS.high).toBeDefined();
  });

  it('todas as cores são strings hex válidas (#RRGGBB)', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    Object.values(COGNITIVE_LOAD_COLORS).forEach((color) => {
      expect(color).toMatch(hexRegex);
    });
  });
});

describe('COGNITIVE_LOAD_LABELS', () => {
  it('rótulos estão em português', () => {
    expect(COGNITIVE_LOAD_LABELS.low).toBe('Leve');
    expect(COGNITIVE_LOAD_LABELS.medium).toBe('Moderada');
    expect(COGNITIVE_LOAD_LABELS.high).toBe('Intensa');
  });
});

describe('POMODORO_DURATIONS', () => {
  it('ciclo de foco é maior que as pausas', () => {
    expect(POMODORO_DURATIONS.focus).toBeGreaterThan(POMODORO_DURATIONS.shortBreak);
    expect(POMODORO_DURATIONS.focus).toBeGreaterThan(POMODORO_DURATIONS.longBreak);
  });

  it('pausa longa é maior que pausa curta', () => {
    expect(POMODORO_DURATIONS.longBreak).toBeGreaterThan(POMODORO_DURATIONS.shortBreak);
  });

  it('valores padrão são 25/5/15 minutos', () => {
    expect(POMODORO_DURATIONS.focus).toBe(25);
    expect(POMODORO_DURATIONS.shortBreak).toBe(5);
    expect(POMODORO_DURATIONS.longBreak).toBe(15);
  });
});
