import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const ROLE_LABELS = {
  physician: { label: 'Physician',  color: 'bg-primary-100 text-primary-700' },
  scribe:    { label: 'Scribe',     color: 'bg-ai-100 text-ai-700'           },
  admin:     { label: 'Admin',      color: 'bg-neutral-100 text-neutral-700' },
};

/**
 * TopBar — global search, role indicator, notifications, user menu.
 */
export default function TopBar({ user, pageTitle }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue]     = useState('');
  const roleConfig = ROLE_LABELS[user.role] || ROLE_LABELS.admin;

  return (
    <header
      role="banner"
      className="h-12 flex items-center gap-3 px-4 bg-white border-b border-neutral-200 flex-shrink-0"
    >
      {/* Page title */}
      <h1 className="text-base font-semibold text-neutral-800 mr-2 whitespace-nowrap">
        {pageTitle}
      </h1>

      {/* Global search */}
      <div
        className={clsx(
          'flex items-center gap-2 flex-1 max-w-sm h-8 px-2.5 rounded border transition-all',
          searchFocused
            ? 'border-primary-400 bg-white shadow-focus'
            : 'border-neutral-200 bg-neutral-50',
        )}
        role="search"
      >
        <Search
          size={14}
          aria-hidden="true"
          className={clsx('flex-shrink-0', searchFocused ? 'text-primary-500' : 'text-neutral-400')}
        />
        <input
          type="search"
          placeholder="Search patients, documents…"
          aria-label="Search documents and patients"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400
                     outline-none border-none min-w-0"
        />
        {searchValue && (
          <kbd className="text-xs text-neutral-400 font-mono bg-neutral-100 px-1 rounded flex-shrink-0">
            ↵
          </kbd>
        )}
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Help */}
        <button
          type="button"
          aria-label="Help and documentation"
          className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <HelpCircle size={16} aria-hidden="true" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label={`Notifications — ${user.notifications} unread`}
          className="relative p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <Bell size={16} aria-hidden="true" />
          {user.notifications > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-semibold leading-none"
            >
              {user.notifications}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-neutral-200 mx-1" aria-hidden="true" />

        {/* User menu */}
        <button
          type="button"
          aria-label={`User menu — ${user.name}, ${roleConfig.label}`}
          aria-haspopup="menu"
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
        >
          {/* Avatar */}
          <span
            aria-hidden="true"
            className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold
                       flex items-center justify-center flex-shrink-0"
          >
            {user.avatar}
          </span>
          <span className="text-sm font-medium text-neutral-700 hidden md:block">
            {user.name}
          </span>
          <span
            className={clsx(
              'text-xs font-medium px-1.5 py-0.5 rounded-sm hidden md:block',
              roleConfig.color,
            )}
          >
            {roleConfig.label}
          </span>
          <ChevronDown size={12} aria-hidden="true" className="text-neutral-400" />
        </button>
      </div>
    </header>
  );
}
