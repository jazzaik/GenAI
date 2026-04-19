import { AlertTriangle, Info, CheckCircle2, XCircle, X } from 'lucide-react';
import clsx from 'clsx';

const VARIANT_CONFIG = {
  info:    { Icon: Info,           bg: 'bg-primary-50',  border: 'border-primary-200', text: 'text-primary-800', icon: 'text-primary-500' },
  success: { Icon: CheckCircle2,   bg: 'bg-success-50',  border: 'border-success-200', text: 'text-success-800', icon: 'text-success-500' },
  warning: { Icon: AlertTriangle,  bg: 'bg-warning-50',  border: 'border-warning-200', text: 'text-warning-800', icon: 'text-warning-500' },
  danger:  { Icon: XCircle,        bg: 'bg-danger-50',   border: 'border-danger-200',  text: 'text-danger-800',  icon: 'text-danger-500'  },
};

export default function Alert({ variant = 'info', title, children, onDismiss, className }) {
  const { Icon, bg, border, text, icon } = VARIANT_CONFIG[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'flex gap-3 p-3 rounded-md border',
        bg, border, className,
      )}
    >
      <Icon aria-hidden="true" size={16} className={clsx('flex-shrink-0 mt-0.5', icon)} />
      <div className="flex-1 min-w-0">
        {title && <p className={clsx('font-medium text-sm', text)}>{title}</p>}
        {children && <div className={clsx('text-sm mt-0.5', text, !title && 'font-medium')}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={clsx('flex-shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors', text)}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
