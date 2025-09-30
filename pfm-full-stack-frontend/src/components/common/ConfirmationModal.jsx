import React from 'react';
import Modal from './Modal';

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="confirmation-modal-content">
        <h3>{title || 'Confirmar Ação'}</h3>
        <p>{message || 'Tem a certeza que quer continuar?'}</p>
        <div className="form-actions">
          <button onClick={onClose} className="secondary-button">
            Cancelar
          </button>
          <button onClick={onConfirm} className="delete-button primary-button">
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;