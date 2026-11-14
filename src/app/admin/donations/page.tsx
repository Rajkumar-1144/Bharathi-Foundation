'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DataTable, Column } from '@/components/dashboard/DataTable';
import { useAppData } from '@/context/AppDataContext';
import { DonationRecord } from '@/types';
import { exportService } from '@/services/exportService';
import { IndianRupee, CheckCircle, XCircle, FileDown, ShieldCheck, QrCode, Pencil, X, Save, ArrowRight } from 'lucide-react';

export default function AdminDonationsPage() {
  const { donations, websiteContent, updateWebsiteContent, verifyDonation, rejectDonation, updateDonationRecord } = useAppData();

  // UPI Config State
  const [upiId, setUpiId] = useState(websiteContent.upiId);
  const [upiSaved, setUpiSaved] = useState(false);

  // Edit Donation Modal State
  const [editingDonation, setEditingDonation] = useState<DonationRecord | null>(null);
  const [editPurpose, setEditPurpose] = useState('Food Donation');
  const [editOtherPurpose, setEditOtherPurpose] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editNote, setEditNote] = useState('');

  const handleOpenEdit = (donation: DonationRecord) => {
    setEditingDonation(donation);
    setEditAmount(donation.amount);
    setEditPurpose(donation.purpose || 'General Foundation Support');
    setEditOtherPurpose(donation.otherPurpose || '');
    setEditNote(donation.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonation) return;

    if (editPurpose === 'Other' && !editOtherPurpose.trim()) {
      alert('Please specify the custom donation purpose.');
      return;
    }

    const finalPurpose = editPurpose === 'Other' ? editOtherPurpose.trim() : editPurpose;

    updateDonationRecord(
      editingDonation.id,
      {
        amount: Number(editAmount),
        purpose: finalPurpose,
        otherPurpose: editPurpose === 'Other' ? editOtherPurpose.trim() : undefined,
        notes: editNote,
      },
      editNote || 'Updated by Admin during reconciliation'
    );

    setEditingDonation(null);
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent({ upiId });
    setUpiSaved(true);
    setTimeout(() => setUpiSaved(false), 3000);
  };

  const columns: Column<DonationRecord>[] = [
    {
      header: 'Date & Time',
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
      header: 'Donor Name & Email',
      accessorKey: 'donorName',
      cell: (row) => (
        <div>
          <p className="font-bold text-brand-text">{row.donorName}</p>
          <p className="text-xs text-brand-muted">{row.donorEmail}</p>
        </div>
      ),
    },
    {
      header: 'Donation Purpose',
      cell: (row) => (
        <div>
          <span className="text-xs font-semibold text-brand-primary bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full inline-block">
            {row.purpose || 'General Foundation Support'}
          </span>
          {row.otherPurpose && (
            <p className="text-[11px] text-brand-muted italic mt-0.5 max-w-xs">
              Reason: {row.otherPurpose}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row) => (
        <span className="font-extrabold text-sm text-emerald-700">
          ₹{row.amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: '12-Digit UTR Number',
      accessorKey: 'utrReference',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-brand-primary bg-brand-bgLight px-2 py-1 rounded">
          {row.utrReference}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
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
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-bgLight"
            title="Edit Donation Purpose / Amount"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => verifyDonation(row.id)}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                title="Verify UTR and Approve 80G Receipt"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => rejectDonation(row.id)}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                title="Reject Claim"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {row.status === 'VERIFIED' && (
            <button
              onClick={() => exportService.generateDonationReceipt(row)}
              className="flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline bg-brand-bgLight px-2.5 py-1 rounded-lg"
              title="Download 80G Receipt PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>80G PDF</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Financial Donations & UTR Reconciliation"
      subtitle="Verify UPI bank references, generate automated Section 80G receipts, and manage payment details"
    >
      <div className="space-y-8">
        {/* UPI Gateway Config Box */}
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-text">Active Foundation UPI Destination</h3>
                <p className="text-xs text-brand-muted">
                  Current UPI ID: <span className="font-mono font-bold text-brand-primary">{websiteContent.qrSettings?.upiId || websiteContent.upiId}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/qr-management"
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-brand-primary hover:text-white text-brand-primary text-xs font-bold rounded-xl border border-brand-border transition-all"
              >
                <span>Full UPI QR Management & Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-text">Incoming UPI Donation Claims Ledger</h3>
            <button
              onClick={() => exportService.exportDonationsPDF(donations)}
              className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Audit Ledger PDF</span>
            </button>
          </div>

          <DataTable
            data={donations}
            columns={columns}
            searchPlaceholder="Search donation by donor name, UTR, email, purpose..."
            searchFields={['donorName', 'utrReference', 'donorEmail', 'campaignTitle', 'purpose']}
            filterColumn={{
              header: 'Status',
              field: 'status',
              options: [
                { label: 'Pending Verification', value: 'PENDING' },
                { label: 'Verified & Reconciled', value: 'VERIFIED' },
                { label: 'Rejected / Disputed', value: 'REJECTED' },
              ],
            }}
            exportFilename="Bharathi_Foundation_Donations_Ledger"
          />
        </div>

        {/* Edit Donation Modal */}
        {editingDonation && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-border space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div>
                  <h3 className="text-lg font-bold text-brand-primaryDark">Edit Donation Record</h3>
                  <p className="text-xs text-brand-muted">UTR #{editingDonation.utrReference} • {editingDonation.donorName}</p>
                </div>
                <button
                  onClick={() => setEditingDonation(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    Purpose of Donation <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={editPurpose}
                    onChange={(e) => setEditPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  >
                    <option value="Food Donation">Food Donation</option>
                    <option value="Old Age Home Support">Old Age Home Support</option>
                    <option value="Child Care Home Support">Child Care Home Support</option>
                    <option value="Blood Donation Camps">Blood Donation Camps</option>
                    <option value="Medical Camps & Healthcare">Medical Camps & Healthcare</option>
                    <option value="Education Support">Education Support</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="General Foundation Support">General Foundation Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {editPurpose === 'Other' && (
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      Please Specify Your Donation Purpose <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter the reason for your donation"
                      value={editOtherPurpose}
                      onChange={(e) => setEditOtherPurpose(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border-2 border-brand-primary/40 focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Reconciled Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Admin Audit Reason / Note</label>
                  <textarea
                    rows={2}
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Reason for changing purpose or amount..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => setEditingDonation(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-brand-muted hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

