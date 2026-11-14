'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { exportService } from '@/services/exportService';
import {
  HeartHandshake,
  IndianRupee,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  FileDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function DonorOverviewPage() {
  const { currentUser } = useAuth();
  const { donors, donations } = useAppData();

  const currentDonor = donors.find((d) => d.userId === currentUser?.id) || donors[0];

  // Donor personal donations
  const myDonations = donations.filter(
    (d) =>
      d.donorId === currentDonor?.id ||
      d.donorEmail.toLowerCase() === currentDonor?.email.toLowerCase() ||
      d.donorEmail.toLowerCase() === currentUser?.email.toLowerCase()
  );

  const verifiedDonations = myDonations.filter((d) => d.status === 'VERIFIED');
  const pendingDonations = myDonations.filter((d) => d.status === 'PENDING');
  const totalVerifiedAmount = verifiedDonations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <DashboardLayout
      allowedRole="DONOR"
      title={`Philanthropy Hub: ${currentDonor?.name || 'Donor Portal'}`}
      subtitle="Track your charitable giving, Section 80G tax certificates, and direct community impact"
    >
      <div className="space-y-8">
        {/* Tax Exemption Status Banner */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Income Tax Exemption Under Section 80G Active</p>
              <p className="text-xs opacity-80 mt-0.5">
                PAN Registered: <strong className="font-mono">{currentDonor?.panNumber || 'NOT PROVIDED'}</strong> • All verified donations qualify for 50% deduction.
              </p>
            </div>
          </div>

          <Link
            href="/donor/donate"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 shadow-xs"
          >
            + New UPI Contribution
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Lifetime Giving"
            value={`₹${totalVerifiedAmount.toLocaleString('en-IN')}`}
            subtitle="Verified contributions"
            icon={IndianRupee}
            variant="emerald"
          />

          <StatCard
            title="Total Contributions"
            value={myDonations.length}
            subtitle={`${verifiedDonations.length} reconciled`}
            icon={HeartHandshake}
            variant="primary"
          />

          <StatCard
            title="Supported Campaigns"
            value={new Set(myDonations.map((d) => d.campaignTitle)).size}
            subtitle="Health, Blood & Nutrition"
            icon={Layers}
            variant="secondary"
          />

          <StatCard
            title="Awaiting Verification"
            value={pendingDonations.length}
            subtitle="Bank statement matching"
            icon={Clock}
            variant={pendingDonations.length > 0 ? 'amber' : 'emerald'}
          />
        </div>

        {/* Recent Contributions Table & 80G Receipt Downloads */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-text">My Recent Contributions</h3>
              <p className="text-xs text-brand-muted">Direct UPI transfers and tax receipt issuance status</p>
            </div>

            <Link href="/donor/receipts" className="text-xs font-bold text-brand-primary hover:underline">
              Download All Receipts (80G) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bgLight text-brand-muted font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">UTR Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">80G Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {myDonations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-brand-muted">
                      No donations recorded yet. Start by scanning our UPI QR code!
                    </td>
                  </tr>
                ) : (
                  myDonations.map((don) => (
                    <tr key={don.id} className="hover:bg-brand-bgLight/40 transition-colors">
                      <td className="py-3 px-4 text-brand-muted">
                        {new Date(don.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-text">{don.campaignTitle}</td>
                      <td className="py-3 px-4 font-black text-emerald-700">₹{don.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-mono text-brand-muted">{don.utrReference}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            don.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : don.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {don.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {don.status === 'VERIFIED' ? (
                          <button
                            onClick={() => exportService.generateDonationReceipt(don)}
                            className="inline-flex items-center gap-1 bg-brand-bgLight hover:bg-brand-primary hover:text-white text-brand-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Download 80G PDF</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-brand-muted italic">Under Reconciliation</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

