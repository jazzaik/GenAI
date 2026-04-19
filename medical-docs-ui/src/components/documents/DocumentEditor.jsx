import { useState, useRef } from 'react';
import {
  Sparkles, User, RefreshCw, Wand2, History, MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import Button from '../shared/Button.jsx';
import ConfidenceBar from '../shared/ConfidenceBar.jsx';
import Alert from '../shared/Alert.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { STATUS_CONFIG } from '../../data/mockData.js';

/**
 * DocumentEditor — rich (contentEditable-based) document view with:
 * - AI vs human-edited section indicators
 * - Per-section confidence meters
 * - Per-section refine action
 * - Version history toggle
 * - Loading skeleton during AI generation
 */
export default function DocumentEditor({
  doc,
  aiState,
  onUpdateSection,
  onRegenerate,
  onRefine,
  onShowDiff,
}) {
  const [focusedSection, setFocusedSection] = useState(null);
  const isLoading = aiState === 'loading';

  return (
    <main
      aria-label="Document editor"
      className="flex-1 min-w-0 flex flex-col bg-neutral-50 overflow-hidden"
    >
      {/* Document toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-neutral-200 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-neutral-900 truncate" title={doc.title}>
            {doc.title}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusBadge config={STATUS_CONFIG[doc.status]} size="sm" />
            <span className="text-xs text-neutral-400">
              Updated {formatRelativeTime(doc.updatedAt)}
            </span>
            {doc.aiConfidence != null && (
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Sparkles size={10} className="text-ai-500" aria-hidden="true" />
                AI
                <span className="sr-only">confidence</span>
                {Math.round(doc.aiConfidence * 100)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<History size={13} />}
            onClick={onShowDiff}
            aria-label="View version history and diff"
          >
            History
          </Button>
          <Button
            variant="secondary"
            size="sm"
            loading={isLoading}
            leftIcon={<RefreshCw size={13} />}
            onClick={onRegenerate}
            aria-label="Regenerate entire document with AI"
          >
            Regenerate
          </Button>
          <button
            type="button"
            aria-label="More document options"
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* AI disclaimer banner */}
      {doc.status === 'ai_generated' || doc.status === 'in_review' ? (
        <div className="px-4 py-2 bg-ai-50 border-b border-ai-200 flex-shrink-0">
          <p className="text-xs text-ai-700 flex items-center gap-1.5">
            <Sparkles size={12} aria-hidden="true" />
            <strong>AI-generated content.</strong>
            &nbsp;Clinical accuracy must be verified by a licensed clinician before approval.
          </p>
        </div>
      ) : null}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            doc.content.sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                isFocused={focusedSection === section.id}
                onFocus={() => setFocusedSection(section.id)}
                onBlur={() => setFocusedSection(null)}
                onUpdate={(text) => onUpdateSection(section.id, text)}
                onRefine={() => onRefine(section.id)}
                aiLoading={isLoading}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

/* ─── Section Card ──────────────────────────────────────────────────────────── */
function SectionCard({ section, isFocused, onFocus, onBlur, onUpdate, onRefine }) {
  const editorRef = useRef(null);
  const { heading, text, aiGenerated, humanEdited, confidence } = section;

  return (
    <article
      aria-label={`Section: ${heading}`}
      className={clsx(
        'card transition-shadow',
        isFocused && 'ring-2 ring-primary-300',
      )}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
        <h3 className="flex-1 text-sm font-semibold text-neutral-800">{heading}</h3>

        {/* AI vs human origin tag */}
        <span
          aria-label={humanEdited ? 'Human-edited content' : 'AI-generated content'}
          className={clsx(
            'inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-sm border',
            humanEdited
              ? 'bg-primary-50 text-primary-600 border-primary-200'
              : 'bg-ai-50 text-ai-600 border-ai-200',
          )}
        >
          {humanEdited
            ? <><User size={10} aria-hidden="true" />Edited</>
            : <><Sparkles size={10} aria-hidden="true" />AI</>
          }
        </span>

        {/* Confidence */}
        {confidence != null && (
          <div className="w-24" aria-label={`Confidence: ${Math.round(confidence * 100)}%`}>
            <ConfidenceBar value={confidence} showLabel size="sm" />
          </div>
        )}

        {/* Per-section refine */}
        <button
          type="button"
          onClick={onRefine}
          aria-label={`Refine ${heading} with AI`}
          className="p-1 rounded text-ai-500 hover:text-ai-700 hover:bg-ai-50 transition-colors"
        >
          <Wand2 size={13} aria-hidden="true" />
        </button>
      </div>

      {/* Editable content */}
      <div
        ref={editorRef}
        role="textbox"
        aria-label={`Edit ${heading}`}
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        onFocus={onFocus}
        onBlur={(e) => {
          onBlur();
          onUpdate(e.currentTarget.innerText);
        }}
        className={clsx(
          'px-4 py-3 text-sm text-neutral-800 leading-relaxed outline-none',
          'whitespace-pre-wrap min-h-[60px]',
          humanEdited ? 'human-highlight' : 'ai-highlight',
          'focus:bg-white transition-colors',
        )}
      >
        {text}
      </div>

      {/* Low confidence warning */}
      {confidence != null && confidence < 0.75 && (
        <div className="px-4 py-2 border-t border-warning-100 bg-warning-50">
          <p className="text-xs text-warning-700 flex items-center gap-1">
            <span aria-hidden="true">⚠</span>
            Low confidence section — clinical review strongly recommended.
          </p>
        </div>
      )}
    </article>
  );
}

/* ─── Loading skeleton ─────────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <>
      {/* Announce to screen readers */}
      <div role="status" aria-live="polite" aria-label="AI is generating document content" className="sr-only">
        Generating document, please wait…
      </div>
      {[180, 260, 200, 140].map((h, i) => (
        <div key={i} className="card p-4 space-y-2" aria-hidden="true">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton rounded" style={{ height: h }} />
        </div>
      ))}
    </>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function formatRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
