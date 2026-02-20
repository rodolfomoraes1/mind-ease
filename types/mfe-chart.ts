export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number;
  barPercentage?: number;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface ChartOptions {
  plugins?: {
    title?: {
      display?: boolean;
      text?: string;
      font?: {
        size?: number;
        weight?: string;
        family?: string;
      };
      color?: string;
    };
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      mode?: 'index' | 'point' | 'nearest' | 'dataset' | 'x' | 'y';
      intersect?: boolean;
    };
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
      max?: number;
      grid?: {
        color?: string;
        display?: boolean;
      };
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    x?: {
      grid?: {
        display?: boolean;
      };
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
  responsive?: boolean;
  maintainAspectRatio?: boolean;
}

export interface MfeChartProps {
  title?: string;
  values?: number[];
  labels?: string[];
  datasets?: Dataset[];
  data?: ChartData;
  colors?: string[];
  options?: ChartOptions;
  height?: string | number;
  width?: string | number;
  className?: string;
  onChartReady?: () => void;
}