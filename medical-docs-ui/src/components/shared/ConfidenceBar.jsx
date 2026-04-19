import clsx from 'clsx';

/**
 * ConfidenceBar — visual AI confidence indicator.
 * Uses both color + text label to satisfy WCAG 1.4.1 (color not only means).
 *
 * @param {number} value  0–1 confidence score
 * @param {boolean} showLabel
 * @param {string} size   'sm' | 'md'
 */
export default function ConfidenceBar({ value, showLabel = true, size = 'md' }) {
  if (value == null) return null;

  const pct = Math.round(value * 100);

  let color, tier;
  if (pct >= 90)      { color = 'bg-success-500'; tier = 'High'; }
  else if (pct >= 75) { color = 'bg-warning-500'; tier = 'Medium'; }
  else                { color = 'bg-danger-500';  tier = 'Low'; }

  return (
    <div
      className={clsx('flex items-center gap-2', size === 'sm' ? 'text-xs' : 'text-sm')}
      role="meter"
      aria-label={`AI confidence: ${pct}% (${tier})`}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={clsx('bg-neutral-200 rounded-full overflow-hidden flex-1', size === 'sm' ? 'h-1' : 'h-1.5')}>
        <div
          className={clsx('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      {showLabel && (
        <span className={clsx('tabular-nums font-medium flex-shrink-0', {
          'text-success-700': pct >= 90,
          'text-warning-700': pct >= 75 && pct < 90,
          'text-danger-700':  pct < 75,
        })}>
          {pct}%
        </span>
      )}
    </div>
  );
}
