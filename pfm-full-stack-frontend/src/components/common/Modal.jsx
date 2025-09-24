import React from 'react';

const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000,
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000,
};

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <>
      <div style={overlayStyles} onClick={onClose} />
      <div style={modalStyles}>
        {children}
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          X
        </button>
      </div>
    </>
  );
};

export default Modal;