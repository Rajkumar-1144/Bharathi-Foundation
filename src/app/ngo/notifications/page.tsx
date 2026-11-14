'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function NGONotificationsPage() {
  const { notifications, markNotificationRead } = useAppData();
  const ngoNotifs = notifications.filter((n) => n.targetRole === 'NGO' || n.targetRole === 'ALL');

  return (
    <DashboardLayout
      allowedRole="NGO"
      title="Partner Notifications & Alerts"
      subtitle="Direct updates from Bharathi Foundation executive administration"
    >
      <div className="max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-4">
        {ngoNotifs.length === 0 ? (
          <p className="text-xs text-brand-muted italic text-center py-10">No notifications at this time.</p>
        ) : (
          ngoNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-brand-bgLight/80 border-brand-secondary/40 shadow-xs'
                  : 'bg-white border-brand-border/60 opacity-75'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${
                  n.type === 'ALERT'
                    ? 'bg-red-600'
                    : n.type === 'SUCCESS'
                    ? 'bg-emerald-600'
                    : 'bg-brand-primary'
                }`}
              >
                {n.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-brand-text">{n.title}</h4>
                  <span className="text-[10px] text-brand-muted">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

