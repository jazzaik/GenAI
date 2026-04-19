import { Sparkles, FileText, Clock, CheckCircle, ShieldCheck, XCircle } from 'lucide-react';
import clsx from 'clsx';

const ICON_MAP = {
  FileText, Sparkles, Clock, CheckCircle, ShieldCheck, XCircle,
};

// Color-to-class map — each pair has bg + text, ensuring WCAG AA contrast
const COLOR_CLASSES = {
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  ai:      'bg-ai-100     text-ai-700     border-ai-200',
  warning: 'bg-warning-100 text-warning-700 border-warning-200',
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  success: 'bg-success-100 text-success-700 border-success-200',
  danger:  'bg-danger-100  text-danger-700  border-danger-200',
};

const DOT_CLASSES = {
  neutral: 'bg-neutral-400',
  ai:      'bg-ai-500',
  warning: 'bg-warning-500',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  danger:  'bg-danger-500',
};

/**
 * StatusBadge — encodes document/workflow status with color + icon + label.
 * Never relies on color alone (icon + text provide redundancy — WCAG 1.4.1).
 *
 * @param {object} config  - STATUS_CONFIG entry { label, color, icon }
 * @param {string} size    - 'sm' | 'md' (default 'md')
 * @param {boolean} dot    - show dot instead of icon
 */
export default function StatusBadge({ config, size = 'md', dot = false }) {
  if (!config) return null;
  const { label, color, icon } = config;
  const IconComponent = ICON_MAP[icon];

  return (
    <span
      role="status"
      aria-label={`Status: ${label}`}
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-sm border',
        COLOR_CLASSES[color],
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs',
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', DOT_CLASSES[color])}
        />
      ) : (
        IconComponent && (
          <IconComponent aria-hidden="true" size={size === 'sm' ? 10 : 12} className="flex-shrink-0" />
        )
      )}
      {label}
    </span>
  );
}
