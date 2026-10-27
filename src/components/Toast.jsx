import { useEffect } from 'react';

/**
 * Mensaje de éxito o error que se cierra solo a los 5 segundos 
 * Props:
 *  - notification: { id, type: 'success' | 'error', message } o null
 *  - onClose()
 */
export default function Toast({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return undefined;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div
      className={`pt-toast pt-toast-${notification.type}`}
      role={notification.type === 'error' ? 'alert' : 'status'}
    >
      <span>{notification.message}</span>
      <button type="button" className="pt-toast-close" onClick={onClose} aria-label="Cerrar mensaje">
        ×
      </button>
    </div>
  );
}
