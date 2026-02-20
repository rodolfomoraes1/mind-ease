import { useEffect, useState, useRef } from 'react';

export const useExternalModule = (url: string) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Evitar carregar múltiplas vezes
    if (document.querySelector(`script[src="${url}"]`)) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setLoaded(true);
      setError(null);
    };

    script.onerror = () => {
      setError(new Error(`Falha ao carregar microfrontend de ${url}`));
      setLoaded(false);
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Cleanup opcional - não remover se outros componentes usam
      if (scriptRef.current && document.querySelectorAll(`script[src="${url}"]`).length === 1) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [url]);

  return { loaded, error };
};