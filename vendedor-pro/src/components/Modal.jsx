import React, { useEffect, useRef } from 'react';

/**
 * M9 FIX: Modal com acessibilidade completa.
 * - role="dialog" + aria-modal="true" — leitores de tela anunciam como diálogo
 * - aria-labelledby — associa o título ao diálogo
 * - Fecha com tecla Escape
 * - Foco movido para o modal ao abrir
 */
export default function Modal({ title, onClose, children }) {
  const modalRef = useRef();

  useEffect(() => {
    // Move foco para o modal ao abrir
    modalRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
        <h2 id="modal-title" style={{ fontSize: 17, marginBottom: 16 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
