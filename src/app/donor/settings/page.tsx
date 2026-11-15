'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChangePasswordCard } from '@/components/dashboard/ChangePasswordCard';

export default function DonorSettingsPage() {
  return (
    <DashboardLayout
      allowedRole="DONOR"
      title="Donor Account Security Settings"
      subtitle="Update password credentials and personal security parameters"
    >
      <div className="max-w-2xl space-y-6">
        <ChangePasswordCard
          title="Donor Account Password"
          subtitle="Change your donor portal login password securely with full strength verification."
        />
      </div>
    </DashboardLayout>
  );
}
