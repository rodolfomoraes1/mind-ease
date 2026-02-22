import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { startPomodoroSession, completePomodoroSession } from '../services/task';
import { POMODORO_DURATIONS } from '../types/task';
import type { PomodoroSession } from '../types/task';

type TimerPhase = PomodoroSession['type'];

interface UsePomodoroResult {
  phase: TimerPhase;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  pomodoroCount: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  /** Completa o pomodoro atual manualmente e chama onComplete */
  complete: () => void;
  progress: number; // 0–100
}

interface UsePomodoroOptions {
  taskId: string;
  onPomodoroComplete?: () => void;
}

/**
 * Hook de timer Pomodoro.
 * Ciclo: focus → shortBreak → focus → shortBreak → focus → shortBreak → focus → longBreak
 * Registra as sessões no Firestore via pomodoroService.
 */
export function usePomodoro({ taskId, onPomodoroComplete }: UsePomodoroOptions): UsePomodoroResult {
  const { user } = useAuth();
  const [phase, setPhase] = useState<TimerPhase>('focus');
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_DURATIONS.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = POMODORO_DURATIONS[phase] * 60;
  const progress = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advancePhase = useCallback(
    async (currentPhase: TimerPhase, currentCount: number) => {
      // Registrar conclusão da sessão
      if (sessionIdRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 60000);
        await completePomodoroSession(sessionIdRef.current, duration).catch(() => {});
        sessionIdRef.current = null;
      }

      let nextPhase: TimerPhase;
      let nextCount = currentCount;

      if (currentPhase === 'focus') {
        nextCount = currentCount + 1;
        setPomodoroCount(nextCount);
        onPomodoroComplete?.();
        // A cada 4 focos, pausa longa
        nextPhase = nextCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      } else {
        nextPhase = 'focus';
      }

      setPhase(nextPhase);
      setSecondsLeft(POMODORO_DURATIONS[nextPhase] * 60);
      setIsRunning(false);
    },
    [onPomodoroComplete],
  );

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          advancePhase(phase, pomodoroCount);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, phase, pomodoroCount, clearTimer, advancePhase]);

  const start = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();

    if (user && phase === 'focus') {
      const id = await startPomodoroSession(user.uid, taskId, phase).catch(() => null);
      sessionIdRef.current = id;
    }
  }, [isRunning, user, taskId, phase]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setPhase('focus');
    setSecondsLeft(POMODORO_DURATIONS.focus * 60);
    sessionIdRef.current = null;
  }, [clearTimer]);

  const complete = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    advancePhase(phase, pomodoroCount);
  }, [clearTimer, advancePhase, phase, pomodoroCount]);

  return {
    phase,
    secondsLeft,
    totalSeconds,
    isRunning,
    pomodoroCount,
    start,
    pause,
    reset,
    complete,
    progress,
  };
}
