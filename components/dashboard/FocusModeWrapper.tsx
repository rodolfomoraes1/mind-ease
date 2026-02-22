import React, { createContext, useContext, ReactNode } from 'react';
import { useCognitiveFeatures } from '../../hooks/useCognitiveFeatures';

interface FocusModeContextValue {
  isFocusMode: boolean;
}

const FocusModeContext = createContext<FocusModeContextValue>({ isFocusMode: false });

/**
 * Hook para consumir o estado de Focus Mode em qualquer componente filho.
 */
export const useFocusMode = () => useContext(FocusModeContext);

/**
 * Provider que disponibiliza o estado de focusMode para toda a árvore filha.
 * Deve envolver a área do dashboard.
 */
export const FocusModeWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { preferences } = useCognitiveFeatures();
  const isFocusMode = preferences?.focusMode ?? false;

  return (
    <FocusModeContext.Provider value={{ isFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
};

/**
 * Wrapper que oculta seu conteúdo quando o Focus Mode está ativo.
 * Use para esconder seções não-essenciais do dashboard.
 *
 * @example
 * <HideInFocusMode>
 *   <RoutineCharts />
 * </HideInFocusMode>
 */
export const HideInFocusMode: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isFocusMode } = useFocusMode();
  if (isFocusMode) return null;
  return <>{children}</>;
};
