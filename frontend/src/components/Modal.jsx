import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          <button onClick={onClose} className="btn btn-icon" style={{ background: 'transparent', color: 'var(--text-light)' }}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}



