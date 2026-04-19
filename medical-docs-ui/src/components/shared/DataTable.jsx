import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import clsx from 'clsx';

/**
 * DataTable — sortable, accessible enterprise table.
 * Satisfies WCAG 1.3.1 (info & relationships) via aria-sort.
 *
 * @param {Array}  columns  { key, header, render, sortable, width, align }
 * @param {Array}  data     row objects
 * @param {string} caption  accessible table caption
 * @param {function} onRowClick
 */
export default function DataTable({ columns, data, caption, onRowClick, emptyMessage = 'No records found.' }) {
  const [sortKey, setSortKey]     = useState(null);
  const [sortDir, setSortDir]     = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av == null) return 1; if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className="overflow-x-auto scrollbar-thin rounded-md border border-neutral-200">
      <table className="w-full text-sm" role="grid">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              const ariaSort = isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? ariaSort : undefined}
                  style={{ width: col.width }}
                  className={clsx(
                    'px-3 py-2.5 font-medium text-neutral-500 text-xs uppercase tracking-wider select-none',
                    col.align === 'right' ? 'text-right' : 'text-left',
                    col.sortable && 'cursor-pointer hover:text-neutral-800 hover:bg-neutral-100 transition-colors',
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  onKeyDown={col.sortable ? (e) => e.key === 'Enter' && handleSort(col.key) : undefined}
                  tabIndex={col.sortable ? 0 : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span aria-hidden="true" className="flex-shrink-0">
                        {!isSorted && <ChevronsUpDown size={12} className="text-neutral-400" />}
                        {isSorted && sortDir === 'asc'  && <ChevronUp size={12} />}
                        {isSorted && sortDir === 'desc' && <ChevronDown size={12} />}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-neutral-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : sorted.map((row, i) => (
            <tr
              key={row.id || i}
              className={clsx(
                'bg-white transition-colors',
                onRowClick && 'cursor-pointer hover:bg-neutral-50',
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'button' : undefined}
              aria-label={onRowClick ? `Open ${row.title || row.name || 'record'}` : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={clsx(
                    'px-3 py-2.5 text-neutral-700',
                    col.align === 'right' && 'text-right',
                  )}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
