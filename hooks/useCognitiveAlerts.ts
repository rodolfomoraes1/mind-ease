import { useState, useEffect, useCallback, useRef } from 'react';
import { useCognitiveFeatures } from './useCognitiveFeatures';

export interface CognitiveAlertState {
  open: boolean;
  message: string;
  severity: 'info' | 'warning';
  actionLabel?: string;
}

/** Intervalo de polling em ms */
const CHECK_INTERVAL_MS = 30 * 1000;
/** Não mostrar outro alerta por 5 min após o último */
const MIN_BETWEEN_ALERTS_MS = 5 * 60 * 1000;

/**
 * Hook que gerencia alertas cognitivos baseados em tempo de sessão.
 * Mostra notificações não-intrusivas quando o usuário está focado
 * por muito tempo sem pausas.
 */
export function useCognitiveAlerts() {
  const { preferences } = useCognitiveFeatures();
  const [alert, setAlert] = useState<CognitiveAlertState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const sessionStartRef = useRef<number>(Date.now());
  const lastAlertRef = useRef<number>(0);

  const dismiss = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
    // Reinicia o contador de sessão ao dispensar o alerta
    sessionStartRef.current = Date.now();
    lastAlertRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!preferences?.cognitiveAlerts) return;

    const intervalMin = preferences.alertIntervalMinutes ?? 25;
    const FOCUS_ALERT_MS = intervalMin * 60 * 1000;
    const HYPERFOCUS_ALERT_MS = intervalMin * 2 * 60 * 1000;

    // Reinicia sessão ao mudar o intervalo
    sessionStartRef.current = Date.now();
    lastAlertRef.current = 0;

    const interval = setInterval(() => {
      const now = Date.now();
      const sessionMs = now - sessionStartRef.current;
      const timeSinceLastAlert = now - lastAlertRef.current;

      if (timeSinceLastAlert < MIN_BETWEEN_ALERTS_MS && lastAlertRef.current > 0) return;

      if (sessionMs >= HYPERFOCUS_ALERT_MS) {
        setAlert({
          open: true,
          message: `⚠️ Você está focado há mais de ${intervalMin * 2} minutos. Uma pausa mais longa vai te ajudar a manter o foco!`,
          severity: 'warning',
          actionLabel: 'Fazer pausa agora',
        });
        lastAlertRef.current = now;
      } else if (sessionMs >= FOCUS_ALERT_MS) {
        setAlert({
          open: true,
          message: `🧠 ${intervalMin} minutos de foco contínuo! Que tal uma pausa rápida para recarregar?`,
          severity: 'info',
          actionLabel: 'Boa ideia!',
        });
        lastAlertRef.current = now;
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [preferences?.cognitiveAlerts, preferences?.alertIntervalMinutes]);

  return { alert, dismiss };
}
