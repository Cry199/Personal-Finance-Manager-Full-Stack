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
    // Overlay
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center transition-opacity duration-300"
    >
      {/* Conteúdo do Modal */}
      <div
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
        className="bg-white rounded-lg shadow-xl p-6 z-50 w-full max-w-lg relative animate-fade-in-down"
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;