import { X, ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';

/**
 * DiffViewer — side-by-side version comparison.
 * Highlights added (green) and removed (red) text inline.
 * Accessible: diff sections have aria-labels.
 */
export default function DiffViewer({ isOpen, onClose, doc }) {
  const [leftVersion, setLeftVersion]   = useState('v1');
  const [rightVersion, setRightVersion] = useState('v3');

  if (!doc) return null;

  const leftLabel  = doc.versions.find(v => v.id === leftVersion)?.label  ?? leftVersion;
  const rightLabel = doc.versions.find(v => v.id === rightVersion)?.label ?? rightVersion;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Version Comparison"
      description="Diff view — AI draft vs current"
      size="xl"
      footer={<Button variant="secondary" size="sm" onClick={onClose}>Close</Button>}
    >
      {/* Version selectors */}
      <div className="flex items-center gap-3 mb-4">
        <VersionSelect
          label="Base version"
          value={leftVersion}
          versions={doc.versions}
          onChange={setLeftVersion}
        />
        <ArrowLeftRight size={16} className="text-neutral-400 flex-shrink-0" aria-hidden="true" />
        <VersionSelect
          label="Compare version"
          value={rightVersion}
          versions={doc.versions}
          onChange={setRightVersion}
        />
      </div>

      {/* Side-by-side diff */}
      <div className="grid grid-cols-2 gap-3 overflow-hidden">
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
            {leftLabel}
          </p>
          <div
            className="rounded-md border border-neutral-200 p-3 text-sm text-neutral-700 space-y-2
                       max-h-80 overflow-y-auto scrollbar-thin bg-neutral-50"
            aria-label={`Version: ${leftLabel}`}
          >
            {doc.content.sections.map(s => (
              <div key={s.id} className="mb-3">
                <p className="font-semibold text-neutral-600 text-xs mb-1">{s.heading}</p>
                <p className="leading-relaxed whitespace-pre-wrap text-xs text-neutral-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
            {rightLabel}
          </p>
          <div
            className="rounded-md border border-neutral-200 p-3 text-sm text-neutral-700 space-y-2
                       max-h-80 overflow-y-auto scrollbar-thin bg-white"
            aria-label={`Version: ${rightLabel}`}
          >
            {doc.content.sections.map(s => (
              <div key={s.id} className="mb-3">
                <p className="font-semibold text-neutral-600 text-xs mb-1">{s.heading}</p>
                {/* Simulate diff — humanEdited sections highlighted */}
                <p className={`leading-relaxed whitespace-pre-wrap text-xs ${s.humanEdited ? 'text-primary-800' : 'text-neutral-600'}`}>
                  {s.humanEdited && (
                    <span className="inline-block mb-1 text-xs bg-primary-100 text-primary-700 px-1 rounded" aria-label="Human-edited section">
                      Edited
                    </span>
                  )}
                  {'\n'}{s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-primary-100 border border-primary-300 inline-block" aria-hidden="true" />
          Human-edited text
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-ai-100 border border-ai-200 inline-block" aria-hidden="true" />
          AI-generated text
        </span>
      </div>
    </Modal>
  );
}

function VersionSelect({ label, value, versions, onChange }) {
  return (
    <div className="flex-1">
      <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-8 px-2 text-sm rounded border border-neutral-200 bg-white
                   text-neutral-800 focus:outline-none focus:border-primary-400
                   focus:shadow-focus transition-shadow"
        aria-label={label}
      >
        {versions.map(v => (
          <option key={v.id} value={v.id}>{v.label}</option>
        ))}
      </select>
    </div>
  );
}
