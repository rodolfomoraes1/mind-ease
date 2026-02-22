import React, { createContext, useContext, ReactNode } from 'react';
import { useCognitiveFeatures } from '../../hooks/useCognitiveFeatures';

interface SummaryModeContextValue {
  isSummaryMode: boolean;
}

const SummaryModeContext = createContext<SummaryModeContextValue>({ isSummaryMode: false });

/**
 * Hook para consumir o estado de Summary Mode em qualquer componente filho.
 * Componentes usam esse hook para decidir se mostram versão resumida ou completa.
 *
 * @example
 * const { isSummaryMode } = useSummaryMode();
 * return isSummaryMode ? <TaskCardCompact /> : <TaskCardFull />;
 */
export const useSummaryMode = () => useContext(SummaryModeContext);

/**
 * Provider que disponibiliza o estado de summaryMode para toda a árvore filha.
 * Deve envolver a área do dashboard.
 */
export const SummaryModeWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { preferences } = useCognitiveFeatures();
  const isSummaryMode = preferences?.summaryMode ?? false;

  return (
    <SummaryModeContext.Provider value={{ isSummaryMode }}>
      {children}
    </SummaryModeContext.Provider>
  );
};
