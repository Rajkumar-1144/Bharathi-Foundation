'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Award, CalendarCheck, Clock, Compass, Tent, CheckCircle2, QrCode } from 'lucide-react';

export default function VolunteerOverviewPage() {
  const { currentUser } = useAuth();
  const { volunteers, camps } = useAppData();

  const currentVol = volunteers.find((v) => v.userId === currentUser?.id) || volunteers[0];

  // Registered camps
  const myRegisteredCamps = camps.filter((c) =>
    c.registeredVolunteerIds?.includes(currentVol?.id || '')
  );

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title={`Welcome, ${currentVol?.name || 'Volunteer'}`}
      subtitle="Your community service dashboard, logged hours, and upcoming field duties"
    >
      <div className="space-y-8">
        {/* Top Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Service Hours Logged"
            value={`${currentVol?.hoursServed || 0} hrs`}
            subtitle="Verified community action"
            icon={Clock}
            variant="primary"
          />

          <StatCard
            title="Registered Camps"
            value={myRegisteredCamps.length}
            subtitle="Upcoming field drives"
            icon={CalendarCheck}
            variant="secondary"
          />

          <StatCard
            title="Certificates Earned"
            value={currentVol?.certificatesCount ?? 0}
            subtitle="Digitally signed recognitions"
            icon={Award}
            variant="emerald"
          />

          <StatCard
            title="Blood Group"
            value={currentVol?.bloodGroup || 'O+'}
            subtitle="Standby donor active"
            icon={CheckCircle2}
            variant="crimson"
          />
        </div>

        {/* QR Event Check-in Pass Box */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Digital Ground Pass
            </span>
            <h3 className="text-2xl font-black">Fast Check-In at Health & Blood Camps</h3>
            <p className="text-xs text-brand-secondaryLight max-w-xl">
              Show your Volunteer QR Badge to the camp supervisor for instant attendance verification and automatic hour logging.
            </p>
          </div>

          <Link
            href="/volunteer/registrations"
            className="flex items-center gap-2 bg-white text-brand-primary font-bold px-5 py-3 rounded-2xl text-xs hover:bg-brand-bgLight transition-colors shrink-0 shadow-md"
          >
            <QrCode className="w-4 h-4" />
            <span>View Check-In Passes</span>
          </Link>
        </div>

        {/* Upcoming Commitments & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Camps */}
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-brand-text">My Registered Camps</h3>
              <Link href="/volunteer/camps" className="text-xs font-bold text-brand-primary hover:underline">
                Explore More →
              </Link>
            </div>

            {myRegisteredCamps.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-muted space-y-3">
                <p>You have not registered for any upcoming camps yet.</p>
                <Link
                  href="/volunteer/camps"
                  className="inline-block bg-brand-primary text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Browse Available Camps
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myRegisteredCamps.map((camp) => (
                  <div key={camp.id} className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-brand-primary">{camp.campType.replace('_', ' ')}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        CONFIRMED
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-brand-text">{camp.title}</h4>
                    <p className="text-xs text-brand-muted mt-1">{camp.date} • {camp.venue}, {camp.city}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-xs space-y-4">
            <h3 className="font-bold text-base text-brand-text">Volunteer Action Hub</h3>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <Link
                href="/volunteer/explore"
                className="p-4 rounded-xl border border-brand-border bg-brand-bgLight/60 hover:bg-brand-bgLight transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-brand-text">Browse NGO Activities</p>
                  <p className="text-brand-muted mt-0.5">Explore food donation, health drives, and disaster relief</p>
                </div>
                <Compass className="w-5 h-5 text-brand-primary" />
              </Link>

              <Link
                href="/volunteer/services"
                className="p-4 rounded-xl border border-brand-border bg-brand-bgLight/60 hover:bg-brand-bgLight transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-brand-text">Download Certificate of Appreciation</p>
                  <p className="text-brand-muted mt-0.5">Officially signed digital volunteer recognition PDF</p>
                </div>
                <Award className="w-5 h-5 text-brand-secondaryDark" />
              </Link>

              <Link
                href="/volunteer/upload-photos"
                className="p-4 rounded-xl border border-brand-border bg-brand-bgLight/60 hover:bg-brand-bgLight transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-brand-text">Upload Service Photographs</p>
                  <p className="text-brand-muted mt-0.5">Submit ground photos for foundation gallery inclusion</p>
                </div>
                <Award className="w-5 h-5 text-brand-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

