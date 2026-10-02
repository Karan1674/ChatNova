import React, { useEffect } from 'react';
import { Trash2, X, Loader2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={isLoading ? undefined : onCancel}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-icon-wrapper danger-glow">
          <Trash2 size={24} />
        </div>

        <div className="modal-body">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary modal-cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-danger modal-confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="modal-spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={15} />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

