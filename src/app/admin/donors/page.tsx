'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DataTable, Column } from '@/components/dashboard/DataTable';
import { useAppData } from '@/context/AppDataContext';
import { Donor } from '@/types';
import { HeartHandshake, ShieldCheck } from 'lucide-react';

export default function AdminDonorsPage() {
  const { donors } = useAppData();

  const columns: Column<Donor>[] = [
    {
      header: 'Donor Name',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <p className="font-bold text-brand-text">{row.name}</p>
          <p className="text-xs text-brand-muted">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'PAN Number (80G)',
      accessorKey: 'panNumber',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-brand-primary">
          {row.panNumber || 'NOT REGISTERED'}
        </span>
      ),
    },
    {
      header: 'Total Contributed',
      accessorKey: 'totalDonated',
      cell: (row) => (
        <span className="font-black text-sm text-emerald-700">
          ₹{row.totalDonated.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Donation Count',
      accessorKey: 'donationCount',
      cell: (row) => (
        <span className="bg-brand-bgLight text-brand-primary font-bold px-2 py-0.5 rounded text-xs">
          {row.donationCount} donations
        </span>
      ),
    },
    {
      header: 'Anonymity',
      cell: (row) => (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            row.isAnonymous ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
          }`}
        >
          {row.isAnonymous ? 'ANONYMOUS' : 'PUBLIC'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Donor Portfolio & Stewardship"
      subtitle="Track philanthropic contributors, PAN tax records, and cumulative giving"
    >
      <div className="space-y-6">
        <DataTable
          data={donors}
          columns={columns}
          searchPlaceholder="Search donor by name, email, PAN..."
          searchFields={['name', 'email', 'phone', 'panNumber']}
          exportFilename="Bharathi_Foundation_Donors"
        />
      </div>
    </DashboardLayout>
  );
}

