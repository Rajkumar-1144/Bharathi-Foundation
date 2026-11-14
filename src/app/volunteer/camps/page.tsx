'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Tent, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function VolunteerCampsPage() {
  const { currentUser } = useAuth();
  const { camps, volunteers, registerVolunteerForCamp } = useAppData();
  const currentVol = volunteers.find((v) => v.userId === currentUser?.id) || volunteers[0];

  const [rsvpSuccessMsg, setRsvpSuccessMsg] = useState<string | null>(null);

  const handleRegister = (campId: string, title: string) => {
    if (!currentVol) return;
    const ok = registerVolunteerForCamp(campId, currentVol.id);
    if (ok) {
      setRsvpSuccessMsg(`You have successfully registered for "${title}". Your attendance pass is generated!`);
      setTimeout(() => setRsvpSuccessMsg(null), 4000);
    } else {
      alert('You are already registered for this camp!');
    }
  };

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="Upcoming Camp Meetings & Blood Drives"
      subtitle="Select a camp and register with 1-click to be assigned to ground service duty"
    >
      <div className="space-y-6">
        {rsvpSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{rsvpSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {camps.map((camp) => {
            const isRegistered = camp.registeredVolunteerIds?.includes(currentVol?.id || '');
            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-bgLight px-2.5 py-1 rounded-full">
                      {camp.campType.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isRegistered ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isRegistered ? 'REGISTERED' : camp.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-brand-text">{camp.title}</h3>
                  <p className="text-xs text-brand-muted line-clamp-2">{camp.description}</p>

                  <div className="space-y-1 text-xs text-brand-muted border-t border-brand-border/60 pt-3">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{camp.date} • {camp.time}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span className="truncate">{camp.venue}, {camp.city}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border/60 mt-4 flex items-center justify-between">
                  <span className="text-xs text-brand-muted font-medium">
                    {camp.volunteersRegistered} / {camp.volunteersNeeded} Registered
                  </span>

                  {isRegistered ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(camp.id, camp.title)}
                      className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      1-Click RSVP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

