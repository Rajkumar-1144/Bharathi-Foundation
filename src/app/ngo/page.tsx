'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Building2, Layers, Users, Tent, AlertCircle, CheckCircle2, Plus, ArrowRight } from 'lucide-react';

export default function NGOOverviewPage() {
  const { currentUser } = useAuth();
  const { ngos, ngoActivities, camps, volunteerRequests } = useAppData();

  // Find this NGO's profile
  const currentNGO = ngos.find((n) => n.userId === currentUser?.id) || ngos[0];
  const isApproved = currentNGO?.status === 'APPROVED';

  // NGO metrics
  const myActivities = ngoActivities.filter((a) => a.ngoName === currentNGO?.name || a.ngoId === currentNGO?.id);
  const myCamps = camps.filter((c) => c.organizerNgoId === currentNGO?.id || c.organizerName.includes(currentNGO?.name || ''));
  const myRequests = volunteerRequests.filter((v) => v.ngoId === currentNGO?.id);
  const myBeneficiariesImpacted =
    myActivities.filter((a) => a.status === 'COMPLETED').reduce((sum, a) => sum + (a.targetBeneficiaries || 0), 0) +
    myCamps.filter((c) => c.status === 'COMPLETED').reduce((sum, c) => sum + (c.targetBeneficiaries || 0), 0);

  return (
    <DashboardLayout
      allowedRole="NGO"
      title={`Partner Console: ${currentNGO?.name || 'NGO Workspace'}`}
      subtitle="Organize welfare initiatives, schedule diagnostic camps, and mobilize volunteers"
    >
      <div className="space-y-8">
        {/* Verification Status Banner */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            isApproved
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {isApproved ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            )}
            <div>
              <p className="font-bold text-sm">
                Accreditation Status: {isApproved ? 'VERIFIED & ACTIVE PARTNER' : 'PENDING ADMIN APPROVAL'}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {isApproved
                  ? 'Your NGO has full privileges to propose activities, organize health camps, and recruit volunteers.'
                  : 'Your legal documentation is under review by the Bharathi Foundation board. You will be notified once accredited.'}
              </p>
            </div>
          </div>

          <Link
            href="/ngo/profile"
            className="text-xs font-bold bg-white px-3.5 py-2 rounded-xl border border-current shadow-xs shrink-0"
          >
            View KYC Profile
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Activities"
            value={myActivities.length}
            subtitle="Welfare initiatives run"
            icon={Layers}
            variant="primary"
          />

          <StatCard
            title="Assigned Volunteers"
            value={myRequests.reduce((acc, r) => acc + (r.countAssigned || 0), 0)}
            subtitle="Ground supporters active"
            icon={Users}
            variant="secondary"
          />

          <StatCard
            title="Upcoming Camps"
            value={myCamps.filter((c) => c.status === 'UPCOMING').length}
            subtitle="Scheduled field drives"
            icon={Tent}
            variant="amber"
          />

          <StatCard
            title="Beneficiaries Impacted"
            value={myBeneficiariesImpacted > 0 ? myBeneficiariesImpacted.toLocaleString('en-IN') : '0'}
            subtitle="Across completed initiatives"
            icon={Building2}
            variant="emerald"
          />
        </div>

        {/* Quick Activity Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Initiatives */}
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-brand-primaryDark">Our Welfare Activities</h3>
              <Link href="/ngo/activities" className="text-xs font-bold text-brand-primary hover:underline">
                Manage All →
              </Link>
            </div>

            {myActivities.length === 0 ? (
              <p className="text-xs text-brand-muted italic py-6 text-center">No activities proposed yet.</p>
            ) : (
              <div className="space-y-3">
                {myActivities.map((act) => (
                  <div key={act.id} className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-brand-primary">{act.category}</span>
                      <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-brand-text">
                        {act.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-brand-text">{act.title}</h4>
                    <p className="text-xs text-brand-muted mt-1">Beneficiaries: {act.targetBeneficiaries} • {act.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Volunteer Requisitions */}
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-brand-primaryDark">Volunteer Requisitions</h3>
              <Link href="/ngo/volunteer-requests" className="text-xs font-bold text-brand-primary hover:underline">
                + New Request →
              </Link>
            </div>

            {myRequests.length === 0 ? (
              <p className="text-xs text-brand-muted italic py-6 text-center">No active volunteer requisitions.</p>
            ) : (
              <div className="space-y-3">
                {myRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-brand-text">{req.title}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                        {req.countAssigned} / {req.countNeeded} Assigned
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted mt-1">Date: {req.date} • {req.location}</p>
                    <p className="text-[11px] text-brand-primary font-semibold mt-1">
                      Skills: {req.skillsNeeded.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

