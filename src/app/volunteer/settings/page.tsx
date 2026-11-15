'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChangePasswordCard } from '@/components/dashboard/ChangePasswordCard';

export default function VolunteerSettingsPage() {
  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="Volunteer Account Settings"
      subtitle="Update password credentials and portal security parameters"
    >
      <div className="max-w-2xl space-y-6">
        <ChangePasswordCard
          title="Volunteer Security & Password"
          subtitle="Change your volunteer sign-in password securely with full strength verification."
        />
      </div>
    </DashboardLayout>
  );
}
