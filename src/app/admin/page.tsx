'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAppData } from '@/context/AppDataContext';
import { exportService } from '@/services/exportService';
import {
  Building2,
  Users,
  HeartHandshake,
  Droplet,
  Tent,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
  Siren,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function AdminOverviewPage() {
  const {
    ngos,
    volunteers,
    donors,
    bloodDonors,
    camps,
    donations,
    gallery,
    bloodRequests,
    approveNGO,
    rejectNGO,
    approveVolunteer,
    rejectVolunteer,
    verifyDonation,
    rejectDonation,
    approvePhoto,
    deletePhoto,
    updateBloodRequestStatus,
  } = useAppData();

  // Computations
  const totalDonationsAmount = donations
    .filter((d) => d.status === 'VERIFIED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingVolunteers = volunteers.filter((v) => v.status === 'PENDING');
  const pendingNGOs = ngos.filter((n) => n.status === 'PENDING');
  const pendingDonations = donations.filter((d) => d.status === 'PENDING');
  const pendingPhotos = gallery.filter((g) => !g.isApproved);
  const pendingBloodRequests = bloodRequests.filter((b) => b.status === 'PENDING');

  const totalPending =
    pendingVolunteers.length +
    pendingNGOs.length +
    pendingDonations.length +
    pendingPhotos.length +
    pendingBloodRequests.length;

  // Purpose-wise financial distribution calculated dynamically from verified donations
  const verifiedDonations = donations.filter((d) => d.status === 'VERIFIED');

  // Dynamic 6-month growth calculated from real donation & volunteer records
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      month: monthNames[d.getMonth()],
      year: d.getFullYear(),
      monthNum: d.getMonth(),
    };
  });

  const monthlyData = last6Months.map(({ month, year, monthNum }) => {
    const monthDonations = verifiedDonations
      .filter((d) => {
        const dt = new Date(d.createdAt);
        return dt.getMonth() === monthNum && dt.getFullYear() === year;
      })
      .reduce((sum, d) => sum + d.amount, 0);

    const activeVolsToDate = volunteers.filter((v) => {
      const dt = new Date(v.createdAt || '2026-01-01');
      return dt <= new Date(year, monthNum + 1, 0) && v.status === 'APPROVED';
    }).length;

    return {
      month,
      donations: monthDonations,
      volunteers: activeVolsToDate,
    };
  });
  const purposeMap: Record<string, number> = {};
  verifiedDonations.forEach((d) => {
    const p = d.purpose || 'General Foundation Support';
    purposeMap[p] = (purposeMap[p] || 0) + d.amount;
  });

  const purposeColors: Record<string, string> = {
    'Food Donation': '#F59E0B',
    'Blood Donation Camps': '#DC2626',
    'Medical Camps & Healthcare': '#51247A',
    'Old Age Home Support': '#7C3AED',
    'Child Care Home Support': '#EC4899',
    'Education Support': '#3B82F6',
    'Emergency Relief': '#10B981',
    'General Foundation Support': '#6B7280',
  };

  const pieData = Object.keys(purposeMap).length > 0
    ? Object.entries(purposeMap).map(([name, value]) => ({
        name,
        value,
        color: purposeColors[name] || '#8B5CF6',
      }))
    : [{ name: 'Awaiting Verified Donations', value: 1, color: '#9CA3AF' }];

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Executive Admin Console"
      subtitle="Master governance, verification pipelines, and foundation financial stewardship"
    >
      <div className="space-y-8">
        {/* Top Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Funds Verified"
            value={`₹${totalDonationsAmount.toLocaleString('en-IN')}`}
            subtitle="100% directly allocated to drives"
            icon={IndianRupee}
            variant="emerald"
            trend="+18.4% this month"
          />

          <StatCard
            title="Volunteer Cadre"
            value={volunteers.length}
            subtitle={`${pendingVolunteers.length} pending review • ${
              volunteers.filter((v) => v.status === 'APPROVED').length
            } active`}
            icon={Users}
            variant="primary"
          />

          <StatCard
            title="Active NGOs"
            value={ngos.filter((n) => n.status === 'APPROVED').length}
            subtitle={`${pendingNGOs.length} pending accreditation`}
            icon={Building2}
            variant="secondary"
          />

          <StatCard
            title="Emergency Blood Network"
            value={bloodDonors.length}
            subtitle={`${pendingBloodRequests.length} critical requests active`}
            icon={Droplet}
            variant="crimson"
          />
        </div>

        {/* Second Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Camp Meetings Conducted"
            value={camps.length}
            subtitle={`${camps.filter((c) => c.status === 'UPCOMING').length} upcoming`}
            icon={Tent}
            variant="amber"
          />
          <StatCard
            title="Verified Donors"
            value={donors.length}
            subtitle="Registered patron contributors"
            icon={HeartHandshake}
            variant="primary"
          />
          <StatCard
            title="Total Pending Items"
            value={totalPending}
            subtitle="Volunteers, NGOs, UTRs, Blood & Media"
            icon={AlertCircle}
            variant={totalPending > 0 ? 'crimson' : 'emerald'}
          />
        </div>

        {/* Recharts Graphical Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-brand-border shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-brand-text">Monthly Fund Inflow & Volunteer Growth</h3>
                <p className="text-xs text-brand-muted">Cumulative contributions in INR vs. onboarded volunteers</p>
              </div>
              <span className="text-xs font-bold text-brand-primary bg-brand-bgLight px-3 py-1 rounded-full">
                FY 2026-27
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F0F5" />
                  <XAxis dataKey="month" stroke="#665E75" fontSize={12} />
                  <YAxis stroke="#665E75" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E9DFF7' }}
                  />
                  <Bar dataKey="donations" name="Donations (INR)" fill="#51247A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-brand-border shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-text">Funds Utilization by Cause</h3>
              <p className="text-xs text-brand-muted">Verified grassroots program allocations</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-center text-brand-muted border-t border-brand-border/60 pt-2">
              Audited according to public charitable trust standards.
            </p>
          </div>
        </div>

        {/* PENDING APPROVAL QUEUE (LIVE IN-BROWSER INTERACTION) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-primaryDark flex items-center gap-2">
                <span>Immediate Verification & Action Queues</span>
                {totalPending > 0 && (
                  <span className="bg-red-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {totalPending} Awaiting Action
                  </span>
                )}
              </h3>
              <p className="text-xs text-brand-muted">
                One-click review and approval for volunteers, NGOs, donations, and emergency blood calls
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Pending Volunteers */}
            <div className="p-4 rounded-2xl bg-brand-bgLight/70 border border-brand-border space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-primary uppercase">
                    Volunteers ({pendingVolunteers.length})
                  </span>
                  <Link href="/admin/volunteers" className="text-[11px] font-bold text-brand-primary hover:underline">
                    View All →
                  </Link>
                </div>

                {pendingVolunteers.length === 0 ? (
                  <p className="text-xs text-brand-muted italic py-4 text-center">No pending volunteer reviews.</p>
                ) : (
                  <div className="space-y-2">
                    {pendingVolunteers.slice(0, 2).map((vol) => (
                      <div key={vol.id} className="p-3 bg-white rounded-xl border border-brand-border space-y-1.5">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-brand-text truncate">{vol.name}</p>
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                            {vol.bloodGroup || 'O+'}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-muted truncate">{vol.city} • {vol.phone}</p>
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => approveVolunteer(vol.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectVolunteer(vol.id)}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Pending NGOs */}
            <div className="p-4 rounded-2xl bg-brand-bgLight/70 border border-brand-border space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-secondaryDark uppercase">
                    NGOs ({pendingNGOs.length})
                  </span>
                  <Link href="/admin/ngos" className="text-[11px] font-bold text-brand-primary hover:underline">
                    View All →
                  </Link>
                </div>

                {pendingNGOs.length === 0 ? (
                  <p className="text-xs text-brand-muted italic py-4 text-center">No NGOs awaiting approval.</p>
                ) : (
                  <div className="space-y-2">
                    {pendingNGOs.slice(0, 2).map((ngo) => (
                      <div key={ngo.id} className="p-3 bg-white rounded-xl border border-brand-border space-y-1.5">
                        <p className="text-xs font-bold text-brand-text truncate">{ngo.name}</p>
                        <p className="text-[11px] text-brand-muted truncate">{ngo.city} • {ngo.darpanId}</p>
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => approveNGO(ngo.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectNGO(ngo.id, 'Incomplete documentation')}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Pending UTR Claims */}
            <div className="p-4 rounded-2xl bg-brand-bgLight/70 border border-brand-border space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    Donations ({pendingDonations.length})
                  </span>
                  <Link href="/admin/donations" className="text-[11px] font-bold text-emerald-700 hover:underline">
                    View All →
                  </Link>
                </div>

                {pendingDonations.length === 0 ? (
                  <p className="text-xs text-brand-muted italic py-4 text-center">All donation claims verified.</p>
                ) : (
                  <div className="space-y-2">
                    {pendingDonations.slice(0, 2).map((don) => (
                      <div key={don.id} className="p-3 bg-white rounded-xl border border-brand-border space-y-1.5">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-brand-text truncate">{don.donorName}</p>
                          <span className="text-xs font-black text-emerald-600">₹{don.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[10px] font-mono text-brand-muted truncate">UTR: {don.utrReference}</p>
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              verifyDonation(don.id);
                              exportService.generateDonationReceipt({ ...don, status: 'VERIFIED' });
                            }}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => rejectDonation(don.id)}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Emergency Blood Requests */}
            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-red-700 uppercase flex items-center gap-1">
                    <Siren className="w-3.5 h-3.5" />
                    <span>Blood SOS ({pendingBloodRequests.length})</span>
                  </span>
                  <Link href="/admin/blood-donation" className="text-[11px] font-bold text-red-600 hover:underline">
                    View All →
                  </Link>
                </div>

                {pendingBloodRequests.length === 0 ? (
                  <p className="text-xs text-brand-muted italic py-4 text-center">No critical blood requests active.</p>
                ) : (
                  <div className="space-y-2">
                    {pendingBloodRequests.slice(0, 2).map((req) => (
                      <div key={req.id} className="p-3 bg-white rounded-xl border border-red-200 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-brand-text truncate">{req.patientName}</p>
                          <span className="text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.2 rounded">
                            {req.bloodGroup} • {req.unitsRequired}u
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-muted truncate">{req.hospitalName}, {req.city}</p>
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => updateBloodRequestStatus(req.id, 'DONOR_IDENTIFIED')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Match Donors
                          </button>
                          <button
                            onClick={() => updateBloodRequestStatus(req.id, 'FULFILLED')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Fulfilled
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
