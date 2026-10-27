import { useCallback, useEffect, useState } from 'react';

const readParams = () => new URLSearchParams(window.location.search);

/**
 * Sincroniza el estado con los parámetros de la URL (?page=2&limit=20...).
 * Devuelve [params, updateParams].
 * - updateParams({ page: 2, q: '' }) agrega/actualiza claves; un valor vacío elimina la clave.
 * - updateParams(cambios, { replace: true }) reemplaza la entrada del historial en vez de crear una nueva.
 * - Escucha "popstate" para que los botones atrás/adelante del navegador actualicen la tabla.
 */
export default function useUrlParams() {
  const [params, setParams] = useState(readParams);

  useEffect(() => {
    const handlePopState = () => setParams(readParams());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateParams = useCallback((changes, { replace = false } = {}) => {
    const next = new URLSearchParams(window.location.search);

    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    const queryString = next.toString();
    const url = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;

    if (replace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
    setParams(new URLSearchParams(next));
  }, []);

  return [params, updateParams];
}
