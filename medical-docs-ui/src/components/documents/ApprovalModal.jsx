import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';
import Alert from '../shared/Alert.jsx';

/**
 * ApprovalModal — final approval confirmation with HIPAA-mindful messaging.
 * Requires explicit checkbox consent before submit.
 */
export default function ApprovalModal({ isOpen, onClose, onApprove, doc }) {
  const [confirmed, setConfirmed] = useState(false);
  const pendingSuggestions = doc?.suggestions?.filter(s => s.accepted === null).length ?? 0;

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Approve Document"
      description={`${doc?.title ?? 'Document'} — final review`}
      size="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!confirmed}
            leftIcon={<ShieldCheck size={14} />}
            onClick={() => { onApprove(); handleClose(); }}
            aria-label={confirmed ? 'Confirm document approval' : 'You must confirm before approving'}
          >
            Approve &amp; Sign
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {pendingSuggestions > 0 && (
          <Alert variant="warning" title={`${pendingSuggestions} suggestion(s) not yet reviewed`}>
            Approving without addressing all suggestions is permitted but must be documented.
          </Alert>
        )}

        {/* Summary */}
        <div className="bg-neutral-50 rounded-md border border-neutral-200 p-3 space-y-1 text-sm">
          <Row label="Document" value={doc?.title} />
          <Row label="Patient"  value={doc?.patient?.name} />
          <Row label="MRN"      value={doc?.patient?.mrn} />
          <Row label="Type"     value={doc?.type || 'Discharge Summary'} />
          <Row label="AI Confidence" value={doc?.aiConfidence ? `${Math.round(doc.aiConfidence * 100)}%` : 'N/A'} />
        </div>

        {/* Consent checkbox */}
        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="approval-consent"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-600
                       focus:ring-2 focus:ring-primary-400 cursor-pointer flex-shrink-0"
            aria-describedby="approval-consent-desc"
          />
          <label htmlFor="approval-consent" className="text-sm text-neutral-700 cursor-pointer leading-snug">
            <span id="approval-consent-desc">
              I, <strong>{doc?.patient ? 'Dr. Sarah Chen' : 'the reviewing clinician'}</strong>, confirm that
              I have reviewed this AI-assisted document for clinical accuracy and completeness,
              and take full responsibility for its content.
            </span>
          </label>
        </div>

        {/* Legal disclaimer */}
        <p className="text-xs text-neutral-400 leading-relaxed">
          This approval will be timestamped, attributed to your credentials, and recorded in the immutable audit log
          in compliance with documentation standards. This action cannot be undone without administrator authorization.
        </p>
      </div>
    </Modal>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-xs font-medium text-neutral-800 truncate">{value}</span>
    </div>
  );
}
