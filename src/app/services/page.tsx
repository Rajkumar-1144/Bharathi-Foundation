'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Droplet, Stethoscope, Building2, UtensilsCrossed, BookOpen, Heart, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Voluntary Blood Donation Campaigns',
      icon: Droplet,
      iconColor: 'text-red-600 bg-red-100',
      description:
        'Mobilizing citizens through institutional and community blood camps to ensure zero mortality due to blood shortages in regional hospitals.',
      metrics: 'Over 12,000+ units collected across 80+ camps',
      link: '/blood-donation',
    },
    {
      title: 'Free Medical & Diagnostic Health Camps',
      icon: Stethoscope,
      iconColor: 'text-brand-primary bg-purple-100',
      description:
        'Bringing experienced physicians, ophthalmologists, and diagnostic equipment to rural and underserved suburban communities.',
      metrics: 'Free medicines, spectacles, and diagnostic screening provided to 25,000+ citizens',
      link: '/camps',
    },
    {
      title: 'NGO Collaboration & Resource Sharing',
      icon: Building2,
      iconColor: 'text-emerald-600 bg-emerald-100',
      description:
        'Empowering verified grassroots non-profits with verified volunteers, activity grants, and joint camp infrastructure.',
      metrics: '25+ active partner organizations in the coalition',
      link: '/ngos',
    },
    {
      title: 'Food Donation',
      icon: UtensilsCrossed,
      iconColor: 'text-amber-600 bg-amber-100',
      description:
        'Providing nutritious and hygienic meals to individuals and families facing hunger through regular food drives.',
      metrics: 'Over 45,000+ wholesome meals and dry ration kits distributed',
      link: '/donate',
    },
    {
      title: 'Disaster Relief & Emergency Sustenance',
      icon: Heart,
      iconColor: 'text-rose-600 bg-rose-100',
      description:
        'Rapid ground deployment of ration packets, clean drinking water, hygiene kits, and emergency shelter items during natural disasters.',
      metrics: 'Immediate response within 24 hours in affected zones',
      link: '/donate',
    },
    {
      title: 'Vocational & Digital Literacy Centers',
      icon: BookOpen,
      iconColor: 'text-blue-600 bg-blue-100',
      description:
        'Equipping youth and women from underprivileged backgrounds with basic computer skills, software fluency, and livelihood training.',
      metrics: 'Over 650 youth trained and certified',
      link: '/register',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      <section className="bg-brand-bgLight py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border">
            What We Do
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">Comprehensive Social Services</h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            Addressing critical community needs with speed, compassion, and complete accountability.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-white border border-brand-border shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl ${srv.iconColor} flex items-center justify-center font-bold`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-primaryDark">{srv.title}</h3>
                    <p className="text-sm text-brand-muted leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="pt-6 border-t border-brand-border/60 mt-6 space-y-3">
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl">{srv.metrics}</p>
                    <Link
                      href={srv.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primaryDark transition-colors"
                    >
                      <span>Explore Program & Participate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Need a Specialized Service Requisition? */}
          <div className="mt-16 rounded-3xl bg-brand-bgLight/80 border border-brand-border p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Community Partnership Desk
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-brand-primaryDark font-serif">
                Request a Medical or Blood Drive in Your Locality
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted max-w-xl">
                Are you an institution, college, resident welfare association, or panchayat body seeking to host a free screening or blood donation drive?
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-5 py-3 rounded-full transition-all shadow-xs"
              >
                Request a Camp Drive
              </Link>
              <Link
                href="/register?role=NGO"
                className="bg-white hover:bg-brand-bgLight text-brand-primaryDark text-xs font-bold px-5 py-3 rounded-full border border-brand-border transition-all"
              >
                NGO Partnership
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

