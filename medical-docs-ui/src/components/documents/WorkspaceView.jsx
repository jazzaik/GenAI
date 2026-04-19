import InputPanel     from './InputPanel.jsx';
import DocumentEditor from './DocumentEditor.jsx';
import ReviewPanel    from './ReviewPanel.jsx';
import ApprovalModal  from './ApprovalModal.jsx';
import DiffViewer     from './DiffViewer.jsx';
import { useDocument } from '../../hooks/useDocument.js';

/**
 * WorkspaceView — assembles the 3-panel document workspace:
 * InputPanel | DocumentEditor | ReviewPanel
 */
export default function WorkspaceView() {
  const {
    doc,
    aiState,
    showApproval, setShowApproval,
    showDiff,     setShowDiff,
    updateSection,
    respondToSuggestion,
    resolveComment,
    regenerate,
    refine,
    approve,
  } = useDocument();

  return (
    <>
      <div className="flex flex-1 overflow-hidden" role="main" aria-label="Document workspace">
        <InputPanel
          doc={doc}
          aiState={aiState}
          onGenerate={regenerate}
        />

        <DocumentEditor
          doc={doc}
          aiState={aiState}
          onUpdateSection={updateSection}
          onRegenerate={regenerate}
          onRefine={refine}
          onShowDiff={() => setShowDiff(true)}
        />

        <ReviewPanel
          doc={doc}
          onRespondSuggestion={respondToSuggestion}
          onResolveComment={resolveComment}
          onApprove={approve}
          onShowApproval={() => setShowApproval(true)}
        />
      </div>

      <ApprovalModal
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        onApprove={approve}
        doc={doc}
      />

      <DiffViewer
        isOpen={showDiff}
        onClose={() => setShowDiff(false)}
        doc={doc}
      />
    </>
  );
}
