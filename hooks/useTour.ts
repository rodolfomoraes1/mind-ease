import { useCallback, useEffect } from 'react';
import { useUserInfo } from './useUserInfo';
import type { NavigationProfile } from '../utils/navigationProfile';

const TOUR_STORAGE_KEY = 'mindease_tour_completed';

/**
 * Hook que gerencia o tour guiado (driver.js).
 * O tour é iniciado automaticamente para perfil 'beginner' na primeira visita.
 */
export function useTour() {
  const { userInfo, updateProfile } = useUserInfo();

  const isTourCompleted = useCallback((): boolean => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(`${TOUR_STORAGE_KEY}_${userInfo?.id}`) === 'true';
  }, [userInfo?.id]);

  const markTourCompleted = useCallback(async () => {
    if (typeof window !== 'undefined' && userInfo?.id) {
      localStorage.setItem(`${TOUR_STORAGE_KEY}_${userInfo.id}`, 'true');
    }
  }, [userInfo?.id]);

  const startTour = useCallback(
    async (profile?: NavigationProfile) => {
      const targetProfile = profile ?? (userInfo?.navigationProfile as NavigationProfile) ?? 'beginner';

      // Importação dinâmica para evitar SSR crash
      const [{ driver }, { tourSteps }] = await Promise.all([
        import('driver.js'),
        import('../data/tourSteps'),
      ]);

      const steps = tourSteps[targetProfile] ?? tourSteps.beginner;
      if (!steps.length) return;

      const driverObj = driver({
        showProgress: true,
        progressText: '{{current}} de {{total}}',
        nextBtnText: 'Próximo →',
        prevBtnText: '← Anterior',
        doneBtnText: 'Começar!',
        overlayColor: 'rgba(0, 0, 0, 0.55)',
        smoothScroll: true,
        steps,
        onDestroyed: () => {
          markTourCompleted();
        },
      });

      driverObj.drive();
    },
    [userInfo?.navigationProfile, markTourCompleted],
  );

  /** Inicia tour automaticamente para iniciantes que ainda não viram */
  useEffect(() => {
    if (!userInfo) return;
    if (userInfo.navigationProfile !== 'beginner') return;
    if (isTourCompleted()) return;

    // Pequeno delay para garantir que os elementos do DOM estão montados
    const timer = setTimeout(() => {
      startTour('beginner');
    }, 1200);

    return () => clearTimeout(timer);
  }, [userInfo, isTourCompleted, startTour]);

  return {
    startTour,
    isTourCompleted,
  };
}
