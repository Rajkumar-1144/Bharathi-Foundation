'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { storageService } from '@/services/storageService';
import { Settings, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data to initial demo state? This will restore all demo users, NGOs, and sample donations.')) {
      storageService.resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Administrative Governance & Settings"
      subtitle="Security parameters, demonstration data reset, and trust profile configuration"
    >
      <div className="max-w-4xl space-y-6">
        {resetSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstration data reset successfully! Reloading workspace...</span>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-bgLight text-brand-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-brand-text">Trust Security & Accreditation Profile</h3>
              <p className="text-xs text-brand-muted">Bharathi Foundation Public Charitable Trust Information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Registration Status:</p>
              <p className="font-bold text-brand-text mt-0.5">Indian Trusts Act, 1882 (Public Charitable Trust)</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Income Tax Exemption:</p>
              <p className="font-bold text-brand-text mt-0.5">Section 12A & 80G Certified</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Persistence Layer:</p>
              <p className="font-bold text-brand-text mt-0.5">Browser LocalStorage & In-Memory Event Pipeline</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Active Admin Session:</p>
              <p className="font-bold text-brand-text mt-0.5">admin@bharathifoundation.org (Master Operator)</p>
            </div>
          </div>
        </div>

        {/* Demo State Reset Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-red-700">Demonstration Reset Facility</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Need to return the website to its original pristine demo state for an evaluation or presentation?
            Clicking the button below resets all LocalStorage entities back to pre-seeded demo records.
          </p>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data to Initial Defaults</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

