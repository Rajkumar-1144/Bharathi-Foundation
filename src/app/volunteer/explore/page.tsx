'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { Compass, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function VolunteerExplorePage() {
  const { ngoActivities } = useAppData();

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="Explore Community Initiatives"
      subtitle="Discover partner NGO welfare programs and register your interest to support"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ngoActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-primary bg-brand-bgLight px-3 py-1 rounded-full border border-brand-border">
                    {act.category}
                  </span>
                  <span className="text-xs font-bold text-brand-muted">{act.ngoName}</span>
                </div>

                <h3 className="font-bold text-base text-brand-text">{act.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{act.description}</p>
              </div>

              <div className="pt-4 border-t border-brand-border/60 mt-4 flex items-center justify-between text-xs">
                <span className="text-brand-muted">
                  Location: <strong className="text-brand-text">{act.location}</strong>
                </span>

                <Link
                  href="/volunteer/camps"
                  className="bg-brand-primary hover:bg-brand-primaryDark text-white font-bold px-3.5 py-1.5 rounded-xl transition-colors"
                >
                  Join Field Team
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

