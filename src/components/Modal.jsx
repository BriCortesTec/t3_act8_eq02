import { useEffect } from 'react';
import { CloseIcon } from './Icons.jsx';

/**
 * Modal reutilizable.
 * Props:
 *  - isOpen (boolean): muestra u oculta el modal. Si es false no renderiza nada (el contenido se reinicia).
 *  - title (string)
 *  - onClose(): se llama al pulsar la X, el fondo oscuro o la tecla Escape.
 *  - size ('sm' | 'md' | 'lg'), por defecto 'md'
 *  - children: contenido del modal
 */
export default function Modal({ isOpen, title, onClose, size = 'md', children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className={`modal modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon size={18} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
