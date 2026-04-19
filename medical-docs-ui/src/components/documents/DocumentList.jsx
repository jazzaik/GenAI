import { Search, SlidersHorizontal, Filter, FileText, Plus } from 'lucide-react';
import clsx from 'clsx';
import DataTable from '../shared/DataTable.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import ConfidenceBar from '../shared/ConfidenceBar.jsx';
import { STATUS_CONFIG } from '../../data/mockData.js';
import { useDocumentList } from '../../hooks/useDocumentList.js';
import Button from '../shared/Button.jsx';

const STATUS_OPTIONS = [
  { value: 'all',          label: 'All statuses' },
  { value: 'draft',        label: 'Draft' },
  { value: 'ai_generated', label: 'AI Generated' },
  { value: 'in_review',    label: 'In Review' },
  { value: 'reviewed',     label: 'Reviewed' },
  { value: 'approved',     label: 'Approved' },
  { value: 'rejected',     label: 'Rejected' },
];

const DATE_OPTIONS = [
  { value: 'all',   label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'week',  label: 'This week' },
];

export default function DocumentList({ onOpenDocument }) {
  const {
    documents, total,
    search, setSearch,
    filterStatus, setFilter,
    filterType, setFilterType,
    dateRange, setDateRange,
    docTypes,
  } = useDocumentList();

  const columns = [
    {
      key: 'title',
      header: 'Document',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-medium text-neutral-900 text-sm">{val}</p>
          <p className="text-xs text-neutral-400">{row.type}</p>
        </div>
      ),
    },
    {
      key: 'patient',
      header: 'Patient',
      sortable: true,
      render: (patient) => (
        <div>
          <p className="text-sm text-neutral-700">{patient.name}</p>
          <p className="text-xs text-neutral-400 font-mono">{patient.mrn}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '130px',
      render: (val) => <StatusBadge config={STATUS_CONFIG[val]} />,
    },
    {
      key: 'aiConfidence',
      header: 'AI Confidence',
      sortable: true,
      width: '130px',
      render: (val) => val != null
        ? <ConfidenceBar value={val} showLabel size="sm" />
        : <span className="text-xs text-neutral-400">Manual</span>,
    },
    {
      key: 'assignee',
      header: 'Assignee',
      sortable: true,
      render: (val) => <span className="text-sm text-neutral-600">{val}</span>,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      width: '120px',
      render: (val) => (
        <time dateTime={val} className="text-xs text-neutral-500">
          {new Date(val).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </time>
      ),
    },
  ];

  const hasFilters = filterStatus !== 'all' || filterType !== 'all' || dateRange !== 'all' || search;

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Documents</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Showing {documents.length} of {total} documents
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={13} />}
          className="ml-auto"
          aria-label="Create new document"
        >
          New Document
        </Button>
      </div>

      {/* Filters bar */}
      <div
        role="search"
        aria-label="Document filters"
        className="card p-3 flex flex-wrap items-center gap-2"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents, patients, MRN…"
            aria-label="Search documents"
            className="w-full h-8 pl-7 pr-2.5 text-sm rounded border border-neutral-200 bg-white
                       text-neutral-800 placeholder:text-neutral-400
                       focus:outline-none focus:border-primary-400 focus:shadow-focus transition-shadow"
          />
        </div>

        <FilterSelect
          label="Status"
          value={filterStatus}
          onChange={setFilter}
          options={STATUS_OPTIONS}
        />

        <FilterSelect
          label="Type"
          value={filterType}
          onChange={setFilterType}
          options={docTypes.map(t => ({ value: t, label: t === 'all' ? 'All types' : t }))}
        />

        <FilterSelect
          label="Date"
          value={dateRange}
          onChange={setDateRange}
          options={DATE_OPTIONS}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={() => { setSearch(''); setFilter('all'); setFilterType('all'); setDateRange('all'); }}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={documents}
          caption="Document list with sort and filter"
          onRowClick={onOpenDocument}
          emptyMessage={
            hasFilters
              ? 'No documents match the current filters.'
              : 'No documents yet. Create one to get started.'
          }
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={`Filter by ${label}`}
        className="h-8 px-2 text-sm rounded border border-neutral-200 bg-white text-neutral-700
                   focus:outline-none focus:border-primary-400 focus:shadow-focus transition-shadow"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
