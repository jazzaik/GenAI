import clsx from 'clsx';

/**
 * Button — enterprise-grade, accessible button.
 *
 * @param {string}   variant   'primary' | 'secondary' | 'ghost' | 'danger' | 'ai'
 * @param {string}   size      'xs' | 'sm' | 'md' | 'lg'
 * @param {boolean}  loading   shows spinner and disables
 * @param {ReactNode} leftIcon  icon before label
 * @param {ReactNode} rightIcon icon after label
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) {
  const base = 'btn-base';

  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-xs',
    secondary:
      'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 shadow-xs',
    ghost:
      'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
    danger:
      'bg-danger-500 text-white hover:bg-danger-700 active:bg-danger-800 shadow-xs',
    ai:
      'bg-ai-500 text-white hover:bg-ai-700 active:bg-ai-700 shadow-xs',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-2.5 py-1.5 text-sm gap-1.5',
    md: 'px-3 py-2 text-sm gap-1.5',
    lg: 'px-4 py-2.5 text-base gap-2',
  };

  return (
    <button
      type="button"
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0"
        />
      )}
      {!loading && leftIcon && <span aria-hidden="true" className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span aria-hidden="true" className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
