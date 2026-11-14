'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DataTable, Column } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { NGO } from '@/types';
import { Building2, CheckCircle, XCircle, Trash2, Eye, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminNGOsPage() {
  const { ngos, approveNGO, rejectNGO, deleteNGO } = useAppData();
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Incomplete KYC accreditation or verification documents.');

  const columns: Column<NGO>[] = [
    {
      header: 'Organization',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <p className="font-bold text-brand-text">{row.name}</p>
          <p className="text-xs text-brand-muted">{row.city} • Est. {row.foundedYear}</p>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      accessorKey: 'contactPerson',
      cell: (row) => (
        <div>
          <p className="font-medium text-brand-text">{row.contactPerson}</p>
          <p className="text-xs text-brand-muted">{row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Darpan ID / Reg',
      accessorKey: 'darpanId',
      cell: (row) => (
        <span className="font-mono text-xs text-brand-primary bg-brand-bgLight px-2 py-1 rounded">
          {row.darpanId}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const isApproved = row.status === 'APPROVED';
        const isPending = row.status === 'PENDING';
        return (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isApproved
                ? 'bg-emerald-100 text-emerald-800'
                : isPending
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedNGO(row)}
            className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-bgLight"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => approveNGO(row.id)}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                title="Approve NGO"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedNGO(row);
                  setRejectModalOpen(true);
                }}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                title="Reject NGO"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.name}?`)) {
                deleteNGO(row.id);
              }
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="NGO Partner Governance"
      subtitle="Verify NGO applications, inspect Darpan credentials, and manage accreditations"
    >
      <div className="space-y-6">
        <DataTable
          data={ngos}
          columns={columns}
          searchPlaceholder="Search NGO by name, contact, city..."
          searchFields={['name', 'contactPerson', 'city', 'darpanId']}
          filterColumn={{
            header: 'Status',
            field: 'status',
            options: [
              { label: 'Pending Review', value: 'PENDING' },
              { label: 'Approved & Active', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' },
            ],
          }}
          exportFilename="Bharathi_Foundation_NGO_Partners"
        />

        {/* View NGO Details Modal */}
        {selectedNGO && !rejectModalOpen && (
          <Modal
            isOpen={!!selectedNGO}
            onClose={() => setSelectedNGO(null)}
            title={selectedNGO.name}
            subtitle={`Accreditation Status: ${selectedNGO.status}`}
          >
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-brand-bgLight rounded-2xl">
                <div>
                  <p className="text-brand-muted">Darpan ID:</p>
                  <p className="font-bold text-brand-text">{selectedNGO.darpanId}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Registration Number:</p>
                  <p className="font-bold text-brand-text">{selectedNGO.regNumber}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Contact Person:</p>
                  <p className="font-bold text-brand-text">{selectedNGO.contactPerson}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Contact Phone:</p>
                  <p className="font-bold text-brand-text">{selectedNGO.phone}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Official Email:</p>
                  <p className="font-bold text-brand-text">{selectedNGO.email}</p>
                </div>
                <div>
                  <p className="text-brand-muted">Founded Year:</p>
                  <p className="font-bold text-brand-text">{selectedNGO.foundedYear}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-brand-text mb-1">Official Address:</p>
                <p className="text-brand-muted bg-white p-3 rounded-xl border border-brand-border">
                  {selectedNGO.address}, {selectedNGO.city}
                </p>
              </div>

              {selectedNGO.documents && (
                <div>
                  <p className="font-bold text-brand-text mb-2">Attached Verification Documents:</p>
                  <div className="space-y-1.5">
                    {selectedNGO.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border bg-white"
                      >
                        <span className="font-medium text-brand-text">{doc.name}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          Document Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedNGO.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-brand-border">
                  <button
                    onClick={() => {
                      approveNGO(selectedNGO.id);
                      setSelectedNGO(null);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors text-xs"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2.5 rounded-xl transition-colors text-xs"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Rejection Reason Modal */}
        {rejectModalOpen && selectedNGO && (
          <Modal
            isOpen={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            title="Specify Rejection Reason"
            subtitle={`Declining accreditation for ${selectedNGO.name}`}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Reason for Decline:</label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    rejectNGO(selectedNGO.id, rejectReason);
                    setRejectModalOpen(false);
                    setSelectedNGO(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 bg-brand-bgLight text-brand-muted font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}

