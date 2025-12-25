import React, { useEffect, useRef } from 'react';
import { PixelButton } from './PixelButton';
import './PixelModal.css';

interface PixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function PixelModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true
}: PixelModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="pixel-modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="pixel-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="pixel-modal__header">
          <h2 id="modal-title" className="pixel-modal__title heading">
            {title}
          </h2>
          {showCloseButton && (
            <button
              className="pixel-modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          )}
        </div>
        <div className="pixel-modal__content">
          {children}
        </div>
      </div>
    </div>
  );
}

// Confirmation dialog variant
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <PixelModal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="pixel-modal__message">{message}</p>
      <div className="pixel-modal__actions">
        <PixelButton variant="ghost" onClick={onClose}>
          {cancelText}
        </PixelButton>
        <PixelButton variant={variant} onClick={handleConfirm}>
          {confirmText}
        </PixelButton>
      </div>
    </PixelModal>
  );
}
