'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { exportService } from '@/services/exportService';
import { FileText, FileDown, ShieldCheck } from 'lucide-react';

export default function DonorReceiptsPage() {
  const { currentUser } = useAuth();
  const { donations, donors } = useAppData();
  const currentDonor = donors.find((d) => d.userId === currentUser?.id) || donors[0];

  const myVerifiedDonations = donations.filter(
    (d) =>
      (d.donorId === currentDonor?.id ||
        d.donorEmail.toLowerCase() === currentDonor?.email.toLowerCase() ||
        d.donorEmail.toLowerCase() === currentUser?.email.toLowerCase()) &&
      d.status === 'VERIFIED'
  );

  return (
    <DashboardLayout
      allowedRole="DONOR"
      title="Official 80G Tax Exemption Receipts"
      subtitle="Instantly download digitally signed receipts compliant with Section 80G of the Indian Income Tax Act"
    >
      <div className="space-y-6 max-w-4xl">
        <div className="p-5 rounded-2xl bg-brand-bgLight border border-brand-border flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-brand-primary shrink-0 mt-0.5" />
          <div className="text-xs text-brand-muted space-y-1">
            <p className="font-bold text-sm text-brand-text">Tax Compliance Information:</p>
            <p>
              Bharathi Foundation is recognized under Section 80G of the Income Tax Act. Donors may claim a 50% tax deduction on all verified contributions.
            </p>
            <p className="font-mono text-brand-primary font-bold">
              80G Approval Ref: CIT(E)/BLR/80G/2019-20 • Trust PAN: AABTB8921K
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {myVerifiedDonations.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-3xl border border-brand-border text-xs text-brand-muted">
              No verified receipts available yet. Once your pending UTR references are reconciled, official PDF receipts will appear here.
            </div>
          ) : (
            myVerifiedDonations.map((don) => (
              <div
                key={don.id}
                className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">
                      Receipt: {don.receiptNumber || `BF/2026-27/${don.utrReference.slice(-4)}`}
                    </h4>
                    <p className="text-xs text-brand-muted">
                      Amount: <strong className="text-emerald-700">₹{don.amount.toLocaleString('en-IN')}</strong> • Purpose:{' '}
                      <span className="font-semibold text-brand-primary">
                        {don.purpose || 'General Foundation Support'}{don.otherPurpose ? ` (${don.otherPurpose})` : ''}
                      </span>{' '}
                      • Date: {new Date(don.createdAt).toLocaleDateString('en-IN')} • UTR: {don.utrReference}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => exportService.generateDonationReceipt(don)}
                  className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shrink-0 shadow-xs"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

