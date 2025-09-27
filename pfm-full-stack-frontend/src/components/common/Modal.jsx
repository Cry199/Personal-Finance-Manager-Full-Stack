import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ open, onClose, children }) => {
  
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">&times;</button>
        {children}
      </div>
    </div>,
    document.body 
  );
};

export default Modal;