import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import Button from './Button.jsx';

/**
 * Modal — accessible dialog with focus trap + Escape key close.
 * Satisfies WCAG 2.1 Success Criteria 2.1.2, 4.1.2.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dangerous = false,
}) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Trap focus inside the modal
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    const el = dialogRef.current;
    if (!el) return;

    const focusableSelectors =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const firstFocusable = el.querySelectorAll(focusableSelectors)[0];
    const allFocusable = [...el.querySelectorAll(focusableSelectors)];
    const lastFocusable = allFocusable[allFocusable.length - 1];

    setTimeout(() => firstFocusable?.focus(), 10);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        className={clsx(
          'relative z-10 w-full mx-4 card shadow-xl',
          sizeClass,
        )}
      >
        {/* Header */}
        <div className={clsx(
          'flex items-start justify-between p-4 border-b border-neutral-200',
          dangerous && 'bg-danger-50',
        )}>
          <div>
            <h2
              id="modal-title"
              className={clsx('text-lg font-semibold', dangerous ? 'text-danger-800' : 'text-neutral-900')}
            >
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-neutral-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="ml-4 p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-neutral-200 bg-neutral-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
