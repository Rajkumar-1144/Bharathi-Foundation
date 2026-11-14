'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

export default function VolunteerSettingsPage() {
  const { currentUser } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.email && newPassword) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`bf_pwd_${currentUser.email.toLowerCase()}`, newPassword);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setNewPassword('');
    }
  };

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="Volunteer Account Settings"
      subtitle="Update password and communication credentials"
    >
      <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <h3 className="font-bold text-base text-brand-primaryDark">Change Password</h3>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">New Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-xs"
          >
            Save Password
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

