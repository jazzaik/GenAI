import {
  FileText, LayoutTemplate, ShieldCheck, Settings,
  ChevronRight, Plus, Activity,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { id: 'documents',  icon: FileText,       label: 'Documents',    badge: '3' },
      { id: 'templates',  icon: LayoutTemplate, label: 'Templates'                },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { id: 'audit',      icon: ShieldCheck,    label: 'Audit Logs'               },
      { id: 'activity',   icon: Activity,       label: 'Activity'                 },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings',   icon: Settings,       label: 'Settings'                 },
    ],
  },
];

/**
 * Sidebar — persistent left-nav with collapsible sections.
 * Keyboard navigable, ARIA landmark (navigation).
 */
export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside
      aria-label="Main navigation"
      className="w-56 flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col h-full"
    >
      {/* Logo / Brand */}
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center"
          aria-hidden="true"
        >
          <FileText size={14} className="text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-neutral-900 leading-tight block">MedScript</span>
          <span className="text-xs text-neutral-400 leading-tight">AI Documentation</span>
        </div>
      </div>

      {/* Quick action */}
      <div className="px-3 py-2 border-b border-neutral-100">
        <button
          type="button"
          onClick={() => onNavigate('new')}
          className="w-full flex items-center gap-1.5 px-2.5 py-2 bg-primary-600 hover:bg-primary-700
                     text-white text-sm font-medium rounded transition-colors"
          aria-label="Create new document"
        >
          <Plus size={14} aria-hidden="true" />
          New Document
        </button>
      </div>

      {/* Nav sections */}
      <nav aria-label="Site navigation" className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400 select-none">
              {section.label}
            </p>
            <ul role="list" className="space-y-0.5">
              {section.items.map(({ id, icon: Icon, label, badge }) => {
                const isActive = activeView === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => onNavigate(id)}
                      className={clsx(
                        'nav-item w-full',
                        isActive && 'active',
                      )}
                    >
                      <Icon
                        size={15}
                        aria-hidden="true"
                        className={clsx(isActive ? 'text-primary-600' : 'text-neutral-400')}
                      />
                      <span className="flex-1 text-left">{label}</span>
                      {badge && (
                        <span
                          className="ml-auto bg-primary-100 text-primary-700 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                          aria-label={`${badge} items`}
                        >
                          {badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight size={12} aria-hidden="true" className="text-primary-400 ml-1" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Version / compliance footer */}
      <div className="px-4 py-3 border-t border-neutral-100 text-xs text-neutral-400">
        <p className="font-medium text-neutral-500">HIPAA-Compliant Mode</p>
        <p>v2.4.1 · SOC 2 Type II</p>
      </div>
    </aside>
  );
}
