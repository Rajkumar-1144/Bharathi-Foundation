'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { ShieldCheck, Heart, Award, CheckCircle, Users } from 'lucide-react';

export default function AboutPage() {
  const { websiteContent } = useAppData();

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-brand-bgLight py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border">
            About Bharathi Foundation
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">Our Story & Guiding Ethos</h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            &ldquo;WE LOVE TO SERVE&rdquo; is not merely our tagline—it is our daily operating principle across communities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl font-black text-brand-primaryDark">Dedicated to Inclusive Social Progress</h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                {websiteContent.aboutText}
              </p>
              <p className="text-sm text-brand-muted leading-relaxed">
                Through our decentralized network of dedicated volunteers, partner non-profits, and benevolent donors,
                Bharathi Foundation acts as a rapid response mechanism for healthcare inequities, emergency blood
                requirements, and rural community welfare.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '100% Direct Public Charitable Trust Governance',
                  'Registered under Section 12A & 80G of the Indian Income Tax Act',
                  'Zero Middlemen: 100% of public donations reach welfare programs',
                  'Certified Medical Transfusion Officers for all Blood Drives',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-brand-text">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl border border-brand-border bg-brand-bgLight">
                <Image
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"
                  alt="Bharathi Foundation Social Welfare"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 rounded-3xl bg-brand-bgLight border border-brand-border">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-brand-primaryDark mb-2">Our Mission</h3>
              <p className="text-sm text-brand-muted leading-relaxed">{websiteContent.missionText}</p>
            </div>

            <div className="p-8 rounded-3xl bg-brand-bgLight border border-brand-border">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondaryDark text-white flex items-center justify-center font-bold mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-brand-primaryDark mb-2">Our Vision</h3>
              <p className="text-sm text-brand-muted leading-relaxed">{websiteContent.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

