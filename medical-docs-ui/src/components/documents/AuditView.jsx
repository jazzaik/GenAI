import { ShieldCheck, Download } from 'lucide-react';
import DataTable from '../shared/DataTable.jsx';
import Button from '../shared/Button.jsx';
import { AUDIT_LOGS } from '../../data/mockData.js';

const COLUMNS = [
  {
    key: 'timestamp',
    header: 'Timestamp',
    sortable: true,
    width: '160px',
    render: (v) => (
      <time dateTime={v} className="font-mono text-xs text-neutral-600">
        {new Date(v).toLocaleString('en-US', {
          month: 'short', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        })}
      </time>
    ),
  },
  {
    key: 'user',
    header: 'User / Actor',
    sortable: true,
    render: (v) => <span className="text-sm text-neutral-800 font-medium">{v}</span>,
  },
  {
    key: 'action',
    header: 'Action',
    render: (v) => <span className="text-sm text-neutral-700">{v}</span>,
  },
  {
    key: 'document',
    header: 'Document',
    render: (v) => <span className="text-sm text-neutral-600">{v}</span>,
  },
  {
    key: 'ip',
    header: 'IP Address',
    width: '120px',
    render: (v) => <span className="font-mono text-xs text-neutral-500">{v}</span>,
  },
];

export default function AuditView() {
  return (
    <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-4">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Audit Logs</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Immutable record of all document actions — SOC 2 / HIPAA compliant
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Download size={13} />}
          className="ml-auto"
          aria-label="Export audit log as CSV"
        >
          Export CSV
        </Button>
      </div>

      <div className="card p-3 flex items-center gap-2 text-sm text-success-700 bg-success-50 border-success-200">
        <ShieldCheck size={15} aria-hidden="true" />
        All entries are cryptographically signed and tamper-evident. Last verified: today.
      </div>

      <DataTable
        columns={COLUMNS}
        data={AUDIT_LOGS}
        caption="Audit log of all document actions"
        emptyMessage="No audit entries found."
      />
    </div>
  );
}
