import React, { useEffect, useRef } from 'react';
import { useExternalModule } from '../../hooks/useExternalModule';
import { MfeChartProps } from '../../types/mfe-chart';

// URL do microfrontend distribuído na vercel
const MFE_URL = 'https://mfe-chart-static.vercel.app/main.js';

type MfeBarChartElement = HTMLElement & {
  values?: MfeChartProps['values'];
  labels?: MfeChartProps['labels'];
  datasets?: MfeChartProps['datasets'];
  data?: MfeChartProps['data'];
  colors?: MfeChartProps['colors'];
  options?: MfeChartProps['options'];
};

const MfeChart: React.FC<MfeChartProps> = ({
  title,
  values,
  labels = [],
  datasets,
  data,
  colors = [],
  options = {},
  height = 300,
  width = '100%',
  className = '',
  onChartReady
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loaded, error } = useExternalModule(MFE_URL);

  // Renderizar o gráfico
  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    // Limpar container
    containerRef.current.innerHTML = '';

    const container = containerRef.current;

    // Criar elemento do gráfico
    const chart = document.createElement('mfe-bar-chart') as MfeBarChartElement;

    // Setar atributos simples antes de conectar ao DOM
    if (title) chart.setAttribute('title', title);
    chart.setAttribute('height', typeof height === 'number' ? `${height}px` : height);
    chart.setAttribute('width', typeof width === 'number' ? `${width}px` : width);

    // Conectar ao DOM primeiro para que o Angular inicialize o elemento
    container.appendChild(chart);

    // Aguardar o custom element estar definido antes de setar propriedades complexas
    // (evita NG0201 - Angular DI ainda não está pronto antes do connectedCallback)
    customElements.whenDefined('mfe-bar-chart').then(() => {
      if (!container.contains(chart)) return; // componente desmontado
      if (values) chart.values = values;
      if (labels.length > 0) chart.labels = labels;
      if (datasets) chart.datasets = datasets;
      if (data) chart.data = data;
      if (colors.length > 0) chart.colors = colors;
      if (Object.keys(options).length > 0) chart.options = options;
      onChartReady?.();
    });

  }, [loaded, title, values, labels, datasets, data, colors, options, height, width, onChartReady]);

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        color: '#c00',
        textAlign: 'center' as const
      }}>
        <strong>Erro ao carregar gráfico:</strong> {error.message}
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: typeof height === 'number' ? `${height}px` : height,
        background: '#f8f9fa',
        borderRadius: '8px',
        color: '#666'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }} />
        <p>Carregando gráfico...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        minHeight: '200px'
      }}
    />
  );
};

// Adicionar keyframe para animação (apenas no cliente)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default MfeChart;
