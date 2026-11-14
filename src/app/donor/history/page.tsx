'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DataTable, Column } from '@/components/dashboard/DataTable';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { exportService } from '@/services/exportService';
import { DonationRecord } from '@/types';
import { FileDown } from 'lucide-react';

export default function DonorHistoryPage() {
  const { currentUser } = useAuth();
  const { donations, donors } = useAppData();
  const currentDonor = donors.find((d) => d.userId === currentUser?.id) || donors[0];

  const myDonations = donations.filter(
    (d) =>
      d.donorId === currentDonor?.id ||
      d.donorEmail.toLowerCase() === currentDonor?.email.toLowerCase() ||
      d.donorEmail.toLowerCase() === currentUser?.email.toLowerCase()
  );

  const columns: Column<DonationRecord>[] = [
    {
      header: 'Date',
      cell: (row) => (
        <span className="text-xs text-brand-muted">
          {new Date(row.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Campaign',
      accessorKey: 'campaignTitle',
      cell: (row) => <span className="font-bold text-xs text-brand-text">{row.campaignTitle}</span>,
    },
    {
      header: 'Purpose',
      cell: (row) => (
        <div>
          <span className="text-xs font-semibold text-brand-primary bg-purple-50 px-2 py-0.5 rounded-full inline-block">
            {row.purpose || 'General Foundation Support'}
          </span>
          {row.otherPurpose && (
            <p className="text-[10px] text-brand-muted italic mt-0.5">({row.otherPurpose})</p>
          )}
        </div>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row) => (
        <span className="font-extrabold text-sm text-emerald-700">₹{row.amount.toLocaleString('en-IN')}</span>
      ),
    },
    {
      header: 'UTR Reference',
      accessorKey: 'utrReference',
      cell: (row) => (
        <span className="font-mono text-xs text-brand-primary bg-brand-bgLight px-2 py-0.5 rounded">
          {row.utrReference}
        </span>
      ),
    },
    {
      header: 'Verification Status',
      accessorKey: 'status',
      cell: (row) => (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            row.status === 'VERIFIED'
              ? 'bg-emerald-100 text-emerald-800'
              : row.status === 'PENDING'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Receipt',
      cell: (row) =>
        row.status === 'VERIFIED' ? (
          <button
            onClick={() => exportService.generateDonationReceipt(row)}
            className="flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download 80G</span>
          </button>
        ) : (
          <span className="text-[10px] text-brand-muted italic">Pending Audit</span>
        ),
    },
  ];

  return (
    <DashboardLayout
      allowedRole="DONOR"
      title="Complete Donation History & Receipts"
      subtitle="Comprehensive audit ledger of all personal contributions made to Bharathi Foundation"
    >
      <div className="space-y-6">
        <DataTable
          data={myDonations}
          columns={columns}
          searchPlaceholder="Search by campaign or UTR..."
          searchFields={['campaignTitle', 'utrReference']}
          exportFilename="My_Bharathi_Donation_History"
        />
      </div>
    </DashboardLayout>
  );
}

