import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, className }) => {
  const portalElRef = useRef<HTMLDivElement | null>(null);
  if (!portalElRef.current && typeof document !== 'undefined') {
    portalElRef.current = document.createElement('div');
    portalElRef.current.setAttribute('data-modal-root', '');
  }

  useEffect(() => {
    const el = portalElRef.current;
    if (!el || typeof document === 'undefined') return;
    document.body.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!portalElRef.current) return null;

  return ReactDOM.createPortal(
    open ? (
      <div className={styles.backdrop} onMouseDown={() => onClose?.()} aria-hidden>
        <div
          className={[styles.paper, className].filter(Boolean).join(' ')}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    ) : null,
    portalElRef.current,
  );
};

Modal.displayName = 'Modal';
