'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { exportService } from '@/services/exportService';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filterColumn?: {
    header: string;
    field: keyof T;
    options: { label: string; value: string }[];
  };
  exportFilename?: string;
  pageSize?: number;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFields = [],
  filterColumn,
  exportFilename = 'Bharathi_Foundation_Export',
  pageSize = 8,
  emptyMessage = 'No records found matching criteria.',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and Search Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Dropdown filter check
      if (filterColumn && selectedFilter !== 'ALL') {
        const itemVal = String(item[filterColumn.field]);
        if (itemVal !== selectedFilter) return false;
      }

      // 2. Search query check
      if (!searchTerm.trim()) return true;
      const lower = searchTerm.toLowerCase();

      if (searchFields.length > 0) {
        return searchFields.some((field) => {
          const val = item[field];
          return val ? String(val).toLowerCase().includes(lower) : false;
        });
      }

      // Default: check all string properties
      return Object.values(item).some((val) =>
        val ? String(val).toLowerCase().includes(lower) : false
      );
    });
  }, [data, searchTerm, selectedFilter, searchFields, filterColumn]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = columns.map((c) => c.header);
    const rows = filteredData.map((row) =>
      columns.map((col) => {
        if (col.accessorKey) {
          const val = row[col.accessorKey];
          return val !== undefined && val !== null ? String(val) : '';
        }
        return '';
      })
    );
    exportService.exportToCSV(exportFilename, headers, rows);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-bgLight/30">
        <div className="flex flex-1 items-center gap-2.5 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-brand-border bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Filter Dropdown */}
          {filterColumn && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-brand-muted shrink-0 hidden sm:inline" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2 px-3 text-xs font-medium rounded-xl border border-brand-border bg-white text-brand-text focus:outline-hidden"
              >
                <option value="ALL">All {filterColumn.header}</option>
                {filterColumn.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-brand-primary hover:text-white border border-brand-primary/50 hover:bg-brand-primary rounded-xl transition-all w-full sm:w-auto justify-center"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-brand-bgLight/70 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="py-3 px-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60 text-sm">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-sm text-brand-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-brand-bgLight/40 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3.5 px-4 text-brand-text align-middle">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted bg-white">
        <p>
          Showing <span className="font-bold text-brand-text">{filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-bold text-brand-text">
            {Math.min(currentPage * pageSize, filteredData.length)}
          </span>{' '}
          of <span className="font-bold text-brand-text">{filteredData.length}</span> entries
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-brand-border text-brand-text hover:bg-brand-bgLight disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-brand-primary">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-brand-border text-brand-text hover:bg-brand-bgLight disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

