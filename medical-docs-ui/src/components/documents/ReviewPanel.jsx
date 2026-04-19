import { useState } from 'react';
import {
  MessageSquare, Lightbulb, Clock, CheckCircle2,
  ThumbsUp, ThumbsDown, Send, ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';
import Button from '../shared/Button.jsx';
import Alert from '../shared/Alert.jsx';

const TABS = [
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'comments',    label: 'Comments',    icon: MessageSquare },
  { id: 'history',     label: 'History',     icon: Clock },
];

/**
 * ReviewPanel — right panel combining:
 * - AI inline suggestions with accept/reject
 * - Human comment threads
 * - Version/audit history
 * - Approval action
 */
export default function ReviewPanel({
  doc,
  onRespondSuggestion,
  onResolveComment,
  onApprove,
  onShowApproval,
}) {
  const [activeTab, setActiveTab]   = useState('suggestions');
  const [newComment, setNewComment] = useState('');

  const pendingSuggestions = doc.suggestions.filter(s => s.accepted === null);
  const openComments       = doc.comments.filter(c => !c.resolved);

  return (
    <aside
      aria-label="Review and comments panel"
      className="w-72 flex-shrink-0 flex flex-col bg-white border-l border-neutral-200 overflow-hidden"
    >
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Review panel tabs"
        className="flex border-b border-neutral-200 flex-shrink-0"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const count = id === 'suggestions' ? pendingSuggestions.length
                      : id === 'comments'    ? openComments.length
                      : null;
          return (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`tabpanel-${id}`}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium border-b-2 transition-colors',
                activeTab === id
                  ? 'border-primary-500 text-primary-700 bg-primary-50'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50',
              )}
            >
              <span className="flex items-center gap-1">
                <Icon size={12} aria-hidden="true" />
                {label}
              </span>
              {count != null && count > 0 && (
                <span
                  className="bg-primary-100 text-primary-700 text-xs font-semibold px-1.5 rounded-full"
                  aria-label={`${count} ${id}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Suggestions */}
        <div
          role="tabpanel"
          id="tabpanel-suggestions"
          aria-labelledby="tab-suggestions"
          hidden={activeTab !== 'suggestions'}
          className="p-3 space-y-2"
        >
          {pendingSuggestions.length === 0 ? (
            <EmptyState
              icon={<ThumbsUp size={24} />}
              message="All suggestions addressed"
            />
          ) : (
            pendingSuggestions.map(sug => (
              <SuggestionCard
                key={sug.id}
                suggestion={sug}
                onAccept={() => onRespondSuggestion(sug.id, true)}
                onReject={() => onRespondSuggestion(sug.id, false)}
              />
            ))
          )}

          {/* Show resolved */}
          {doc.suggestions.filter(s => s.accepted !== null).length > 0 && (
            <details className="text-xs text-neutral-400">
              <summary className="cursor-pointer hover:text-neutral-600 py-1">
                {doc.suggestions.filter(s => s.accepted !== null).length} resolved suggestion(s)
              </summary>
              <div className="mt-2 space-y-2">
                {doc.suggestions.filter(s => s.accepted !== null).map(sug => (
                  <div key={sug.id} className="p-2 rounded bg-neutral-50 border border-neutral-200">
                    <p className="text-xs text-neutral-500 line-clamp-2">{sug.text}</p>
                    <span className={clsx(
                      'text-xs font-medium mt-1 inline-block',
                      sug.accepted ? 'text-success-600' : 'text-danger-500',
                    )}>
                      {sug.accepted ? '✓ Accepted' : '✗ Rejected'}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Comments */}
        <div
          role="tabpanel"
          id="tabpanel-comments"
          aria-labelledby="tab-comments"
          hidden={activeTab !== 'comments'}
          className="p-3 space-y-3"
        >
          {openComments.length === 0 ? (
            <EmptyState icon={<MessageSquare size={24} />} message="No open comments" />
          ) : (
            openComments.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onResolve={() => onResolveComment(comment.id)}
              />
            ))
          )}

          {/* Add comment */}
          <form
            onSubmit={(e) => { e.preventDefault(); setNewComment(''); }}
            className="border border-neutral-200 rounded overflow-hidden"
          >
            <label htmlFor="new-comment" className="sr-only">Add a comment</label>
            <textarea
              id="new-comment"
              rows={3}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment or question…"
              className="w-full px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400
                         resize-none outline-none border-none bg-white"
            />
            <div className="flex items-center justify-end px-2 py-1.5 bg-neutral-50 border-t border-neutral-100">
              <button
                type="submit"
                disabled={!newComment.trim()}
                aria-label="Post comment"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium
                           bg-primary-600 text-white rounded hover:bg-primary-700
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={11} aria-hidden="true" />
                Comment
              </button>
            </div>
          </form>
        </div>

        {/* History */}
        <div
          role="tabpanel"
          id="tabpanel-history"
          aria-labelledby="tab-history"
          hidden={activeTab !== 'history'}
          className="p-3"
        >
          {/* Version selector */}
          <p className="section-heading">Versions</p>
          <ul className="space-y-1 mb-4" role="list" aria-label="Document versions">
            {doc.versions.map((v, i) => (
              <li key={v.id}>
                <button
                  type="button"
                  className={clsx(
                    'w-full text-left px-2.5 py-2 rounded text-xs transition-colors',
                    i === 0
                      ? 'bg-primary-50 border border-primary-200 text-primary-700 font-medium'
                      : 'hover:bg-neutral-100 text-neutral-600',
                  )}
                  aria-current={i === 0 ? 'true' : undefined}
                >
                  <span className="block font-medium">{v.label}</span>
                  <span className="text-neutral-400">{formatTime(v.timestamp)} · {v.author}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Audit log */}
          <p className="section-heading">Audit Log</p>
          <ol className="space-y-2" role="list" aria-label="Audit log">
            {doc.auditLog.map((entry, i) => (
              <li key={i} className="flex gap-2 text-xs text-neutral-600">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="font-medium text-neutral-700">{entry.user}</span>
                  <span className="text-neutral-400"> · {entry.action}</span>
                  <br />
                  <time className="text-neutral-400" dateTime={entry.timestamp}>
                    {formatTime(entry.timestamp)}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Approval footer */}
      {doc.status !== 'approved' && (
        <div className="p-3 border-t border-neutral-200 flex-shrink-0 space-y-2">
          {pendingSuggestions.length > 0 && (
            <Alert variant="warning">
              {pendingSuggestions.length} AI suggestion(s) still pending review.
            </Alert>
          )}
          <Button
            variant="primary"
            size="md"
            className="w-full"
            leftIcon={<ShieldCheck size={14} />}
            onClick={onShowApproval}
            aria-label="Open approval confirmation"
          >
            Approve Document
          </Button>
        </div>
      )}

      {doc.status === 'approved' && (
        <div className="p-3 border-t border-neutral-200 bg-success-50 flex-shrink-0">
          <div className="flex items-center gap-2 text-success-700">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span className="text-sm font-semibold">Document Approved</span>
          </div>
          <p className="text-xs text-success-600 mt-0.5">Locked for editing. Contact admin to revert.</p>
        </div>
      )}
    </aside>
  );
}

/* ─── Suggestion card ────────────────────────────────────────────────────────── */
function SuggestionCard({ suggestion, onAccept, onReject }) {
  const TYPE_STYLES = {
    addition:   'bg-success-50 border-success-200 text-success-800',
    correction: 'bg-warning-50 border-warning-200 text-warning-800',
    removal:    'bg-danger-50  border-danger-200  text-danger-800',
  };

  return (
    <div
      role="article"
      aria-label="AI suggestion"
      className={clsx('p-3 rounded-md border text-sm space-y-2', TYPE_STYLES[suggestion.type] || TYPE_STYLES.addition)}
    >
      <div className="flex items-start gap-1.5">
        <Lightbulb size={12} aria-hidden="true" className="flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">{suggestion.text}</p>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onAccept}
          aria-label="Accept suggestion"
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded
                     bg-success-500 text-white hover:bg-success-700 transition-colors"
        >
          <ThumbsUp size={10} aria-hidden="true" /> Accept
        </button>
        <button
          type="button"
          onClick={onReject}
          aria-label="Reject suggestion"
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded
                     bg-white border border-current hover:bg-white/50 transition-colors"
        >
          <ThumbsDown size={10} aria-hidden="true" /> Reject
        </button>
      </div>
    </div>
  );
}

/* ─── Comment card ────────────────────────────────────────────────────────── */
function CommentCard({ comment, onResolve }) {
  const ROLE_AVATAR_COLOR = {
    physician: 'bg-primary-600',
    scribe:    'bg-ai-500',
    admin:     'bg-neutral-500',
  };

  return (
    <article
      aria-label={`Comment from ${comment.author}`}
      className="border border-neutral-200 rounded-md overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border-b border-neutral-100">
        <span
          aria-hidden="true"
          className={clsx(
            'w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0',
            ROLE_AVATAR_COLOR[comment.role] || 'bg-neutral-500',
          )}
        >
          {comment.avatar}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-neutral-700 truncate">{comment.author}</p>
          <time className="text-xs text-neutral-400" dateTime={comment.timestamp}>
            {formatTime(comment.timestamp)}
          </time>
        </div>
        <button
          type="button"
          onClick={onResolve}
          aria-label="Resolve comment"
          className="text-xs text-neutral-400 hover:text-success-600 transition-colors"
        >
          Resolve
        </button>
      </div>
      <p className="px-3 py-2 text-xs text-neutral-700 leading-relaxed">{comment.text}</p>
    </article>
  );
}

/* ─── Empty state ─────────────────────────────────────────────────────────── */
function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center py-8 text-neutral-400" role="status">
      <span aria-hidden="true" className="mb-2">{icon}</span>
      <p className="text-xs">{message}</p>
    </div>
  );
}

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
