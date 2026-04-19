import { useState, useMemo } from 'react';
import { DOCUMENTS } from '../data/mockData.js';

/**
 * useDocumentList — filtering, sorting, and selection for the document table.
 */
export function useDocumentList() {
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // 'today' | 'week' | 'all'
  const [selected, setSelected]   = useState(null);

  const docTypes = useMemo(() => {
    const types = [...new Set(DOCUMENTS.map(d => d.type))];
    return ['all', ...types];
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

    return DOCUMENTS.filter(doc => {
      const matchSearch = !search || (
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.patient.mrn.toLowerCase().includes(search.toLowerCase())
      );
      const matchStatus = filterStatus === 'all' || doc.status === filterStatus;
      const matchType   = filterType   === 'all' || doc.type   === filterType;

      let matchDate = true;
      if (dateRange === 'today') {
        matchDate = new Date(doc.updatedAt) >= todayStart;
      } else if (dateRange === 'week') {
        matchDate = new Date(doc.updatedAt) >= weekStart;
      }

      return matchSearch && matchStatus && matchType && matchDate;
    });
  }, [search, filterStatus, filterType, dateRange]);

  return {
    documents: filtered,
    search, setSearch,
    filterStatus, setFilter,
    filterType, setFilterType,
    dateRange, setDateRange,
    docTypes,
    selected, setSelected,
    total: DOCUMENTS.length,
  };
}
