'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { QrCode, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function VolunteerRegistrationsPage() {
  const { currentUser } = useAuth();
  const { volunteers, camps } = useAppData();
  const currentVol = volunteers.find((v) => v.userId === currentUser?.id) || volunteers[0];

  const myRegisteredCamps = camps.filter((c) =>
    c.registeredVolunteerIds?.includes(currentVol?.id || '')
  );

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="My Camp Registrations & Digital Passes"
      subtitle="Present your verification QR pass at the venue registration desk for immediate check-in"
    >
      <div className="space-y-6">
        {myRegisteredCamps.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-brand-border space-y-4">
            <p className="text-sm text-brand-muted">You have no active camp registrations currently.</p>
            <Link
              href="/volunteer/camps"
              className="inline-block bg-brand-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs"
            >
              Browse & Register for Camps
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRegisteredCamps.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs flex flex-col sm:flex-row items-center gap-6"
              >
                {/* Visual QR Code Pass */}
                <div className="p-3 bg-brand-bgLight rounded-2xl border border-brand-border flex flex-col items-center justify-center shrink-0">
                  <div className="w-28 h-28 bg-white rounded-xl border flex items-center justify-center p-2 text-center">
                    <QrCode className="w-20 h-20 text-brand-primary" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-brand-primary mt-2">
                    VOL-{currentVol?.id.toUpperCase().slice(-5)}
                  </span>
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ADMIT VOLUNTEER
                  </span>
                  <h3 className="font-bold text-base text-brand-text">{camp.title}</h3>
                  <div className="space-y-1 text-xs text-brand-muted">
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{camp.date} ({camp.time})</span>
                    </p>
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{camp.venue}, {camp.city}</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-brand-primary font-bold pt-2">
                    Assigned Volunteer: {currentVol?.name} ({currentVol?.bloodGroup})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

