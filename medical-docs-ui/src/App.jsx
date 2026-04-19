import { useState } from 'react';
import Sidebar       from './components/layout/Sidebar.jsx';
import TopBar        from './components/layout/TopBar.jsx';
import WorkspaceView from './components/documents/WorkspaceView.jsx';
import DocumentList  from './components/documents/DocumentList.jsx';
import TemplatesView from './components/documents/TemplatesView.jsx';
import AuditView     from './components/documents/AuditView.jsx';
import { CURRENT_USER } from './data/mockData.js';

const PAGE_TITLES = {
  workspace:  'Document Workspace',
  documents:  'Documents',
  templates:  'Templates',
  audit:      'Audit Logs',
  activity:   'Activity',
  settings:   'Settings',
};

export default function App() {
  const [activeView, setActiveView] = useState('documents');

  const handleNavigate = (view) => {
    if (view === 'new') { setActiveView('workspace'); return; }
    setActiveView(view);
  };

  const handleOpenDocument = () => {
    setActiveView('workspace');
  };

  const pageTitle = PAGE_TITLES[activeView] ?? 'MedScript AI';

  return (
    // Skip-nav for keyboard/screen reader users
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2
                   focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-md
                   focus:text-primary-700 focus:font-medium"
      >
        Skip to main content
      </a>

      <div className="flex h-screen overflow-hidden bg-neutral-100">
        <Sidebar activeView={activeView} onNavigate={handleNavigate} />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar user={CURRENT_USER} pageTitle={pageTitle} />

          <div id="main-content" className="flex flex-1 overflow-hidden">
            {activeView === 'workspace' && <WorkspaceView />}
            {activeView === 'documents' && (
              <DocumentList onOpenDocument={handleOpenDocument} />
            )}
            {activeView === 'templates' && <TemplatesView />}
            {activeView === 'audit'     && <AuditView />}
            {(activeView === 'activity' || activeView === 'settings') && (
              <PlaceholderView title={PAGE_TITLES[activeView]} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PlaceholderView({ title }) {
  return (
    <div className="flex-1 flex items-center justify-center text-neutral-400" role="main">
      <div className="text-center">
        <p className="text-xl font-semibold mb-1">{title}</p>
        <p className="text-sm">This view is under construction.</p>
      </div>
    </div>
  );
}
