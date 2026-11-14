'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Building2, CheckCircle2, Upload, FileText } from 'lucide-react';

export default function NGOProfilePage() {
  const { currentUser } = useAuth();
  const { ngos, updateNGO } = useAppData();

  const currentNGO = ngos.find((n) => n.userId === currentUser?.id) || ngos[0];

  const [name, setName] = useState(currentNGO?.name || '');
  const [darpanId, setDarpanId] = useState(currentNGO?.darpanId || '');
  const [regNumber, setRegNumber] = useState(currentNGO?.regNumber || '');
  const [contactPerson, setContactPerson] = useState(currentNGO?.contactPerson || '');
  const [phone, setPhone] = useState(currentNGO?.phone || '');
  const [address, setAddress] = useState(currentNGO?.address || '');
  const [city, setCity] = useState(currentNGO?.city || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNGO) return;
    updateNGO(currentNGO.id, {
      name,
      darpanId,
      regNumber,
      contactPerson,
      phone,
      address,
      city,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      allowedRole="NGO"
      title="Organization Profile & Accreditation KYC"
      subtitle="Maintain official contact details, Darpan registration ID, and compliance documentation"
    >
      <div className="max-w-4xl bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Organization Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Darpan ID</label>
              <input
                type="text"
                value={darpanId}
                onChange={(e) => setDarpanId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Trust / Society Reg Number</label>
              <input
                type="text"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Nodal Contact Person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Official Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
            />
          </div>

          {/* Uploaded Documents */}
          <div className="pt-4 border-t border-brand-border/60">
            <h4 className="font-bold text-xs text-brand-text mb-2">Accreditation Documents</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-brand-border bg-brand-bgLight flex items-center justify-between text-xs">
                <span className="font-medium text-brand-text">12A_Tax_Exemption_Registration.pdf</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  Verified by Bharathi Board
                </span>
              </div>
              <div className="p-3 rounded-xl border border-brand-border bg-brand-bgLight flex items-center justify-between text-xs">
                <span className="font-medium text-brand-text">NGO_Darpan_Certificate.pdf</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  Verified by Bharathi Board
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-xs"
          >
            Save NGO Profile
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

