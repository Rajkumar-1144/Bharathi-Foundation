'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function DonorProfilePage() {
  const { currentUser } = useAuth();
  const { donors } = useAppData();
  const currentDonor = donors.find((d) => d.userId === currentUser?.id) || donors[0];

  const [name, setName] = useState(currentDonor?.name || '');
  const [phone, setPhone] = useState(currentDonor?.phone || '');
  const [panNumber, setPanNumber] = useState(currentDonor?.panNumber || '');
  const [isAnonymous, setIsAnonymous] = useState(currentDonor?.isAnonymous || false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const allDonors = JSON.parse(localStorage.getItem('bf_donors') || '[]');
      const updated = allDonors.map((dn: any) =>
        dn.id === currentDonor?.id
          ? { ...dn, name, phone, panNumber: panNumber.toUpperCase(), isAnonymous }
          : dn
      );
      localStorage.setItem('bf_donors', JSON.stringify(updated));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      allowedRole="DONOR"
      title="Donor Profile & Tax Settings"
      subtitle="Update PAN identification for Section 80G tax certificates and toggle public anonymity"
    >
      <div className="max-w-2xl bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and PAN preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Donor Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                placeholder="e.g. ABCDE1234F"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border uppercase font-mono focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border flex items-center gap-3">
            <input
              type="checkbox"
              id="donorAnon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-brand-primary rounded-sm border-brand-border focus:ring-brand-primary"
            />
            <label htmlFor="donorAnon" className="text-xs text-brand-text font-medium cursor-pointer">
              Keep my name anonymous on foundation public reports & honor rolls
            </label>
          </div>

          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-xs"
          >
            Save Donor Profile
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

