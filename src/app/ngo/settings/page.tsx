'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChangePasswordCard } from '@/components/dashboard/ChangePasswordCard';

export default function NGOSettingsPage() {
  return (
    <DashboardLayout
      allowedRole="NGO"
      title="NGO Security & Workspace Settings"
      subtitle="Update password credentials and account security preferences"
    >
      <div className="max-w-2xl space-y-6">
        <ChangePasswordCard
          title="NGO Partner Account Password"
          subtitle="Change your organization account login password securely with full strength verification."
        />
      </div>
    </DashboardLayout>
  );
}
