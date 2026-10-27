import Modal from './Modal.jsx';

/**
 * Diálogo de confirmación reutilizable.
 * Props:
 *  - isOpen (boolean)
 *  - title (string)
 *  - message (string | node)
 *  - confirmText (string), por defecto "Confirmar"
 *  - cancelText (string), por defecto "Cancelar"
 *  - variant ('primary' | 'danger'), por defecto 'primary'
 *  - loading (boolean): deshabilita los botones mientras se procesa
 *  - onConfirm()
 *  - onCancel()
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={loading ? () => {} : onCancel} size="sm">
      <div className="confirm-message">{message}</div>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          {cancelText}
        </button>
        <button
          type="button"
          className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Procesando...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
