import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
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
    const element = portalElRef.current;
    if (!element || typeof document === 'undefined') return;
    document.body.appendChild(element);
    return () => {
      if (element.parentNode) element.parentNode.removeChild(element);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose?.();
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

  const handleBackdropMouseDown = () => {
    onClose?.();
  };

  const handleDialogMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return ReactDOM.createPortal(
    open ? (
      <div className={styles.backdrop} onMouseDown={handleBackdropMouseDown} aria-hidden>
        <div
          className={clsx(styles.paper, className)}
          role="dialog"
          aria-modal="true"
          onMouseDown={handleDialogMouseDown}
        >
          <div className={styles.paperInner}>{children}</div>
        </div>
      </div>
    ) : null,
    portalElRef.current,
  );
};

Modal.displayName = 'Modal';
