'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { Tent, Calendar, Clock, MapPin, Users, CheckCircle, ArrowRight } from 'lucide-react';

export default function CampsPage() {
  const { camps } = useAppData();
  const [filterType, setFilterType] = useState('ALL');

  const filteredCamps =
    filterType === 'ALL' ? camps : camps.filter((c) => c.campType === filterType);

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      <section className="bg-brand-bgLight py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border">
            Field Outreach Schedule
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">Medical & Community Camps</h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            Discover upcoming and completed free health camps, eye care diagnostics, and blood drives organized by
            Bharathi Foundation.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Camp Type Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All Camps', value: 'ALL' },
                { label: 'Blood Donation', value: 'BLOOD_DONATION' },
                { label: 'Eye Care & Cataract', value: 'EYE_CARE' },
                { label: 'Pediatric Care', value: 'PEDIATRIC' },
                { label: 'Medical Checkup', value: 'MEDICAL_CHECKUP' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterType(f.value)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    filterType === f.value
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-brand-bgLight text-brand-text border border-brand-border hover:bg-brand-secondary/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <Link
              href="/register"
              className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              + Register as Camp Volunteer
            </Link>
          </div>

          {/* Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCamps.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-brand-bgLight">
                    <Image
                      src={
                        camp.bannerImage ||
                        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={camp.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-brand-primary text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {camp.campType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          camp.status === 'UPCOMING'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-brand-text">{camp.title}</h3>
                      <p className="text-xs text-brand-muted mt-1 leading-relaxed">{camp.description}</p>
                    </div>

                    <div className="space-y-2 text-xs text-brand-muted border-t border-brand-border/60 pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Date: {camp.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Time: {camp.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                        <span className="truncate">Venue: {camp.venue}, {camp.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Organized with: {camp.organizerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-brand-border/60 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-brand-primary">{camp.volunteersRegistered} / {camp.volunteersNeeded}</p>
                    <p className="text-[10px] text-brand-muted">Volunteers Assigned</p>
                  </div>
                  <Link
                    href="/register"
                    className="bg-brand-bgLight hover:bg-brand-primary hover:text-white text-brand-primary text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    Volunteer for Camp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

