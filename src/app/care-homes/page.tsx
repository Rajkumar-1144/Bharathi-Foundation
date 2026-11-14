'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import {
  HeartHandshake,
  Building2,
  Users,
  Calendar,
  Smile,
  Shield,
  Stethoscope,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Heart,
  Phone,
  Mail,
} from 'lucide-react';

export default function CareHomesPublicPage() {
  const { careHomes, careHomeEvents, careHomeCampaigns } = useAppData();
  const [activeTab, setActiveTab] = useState<'ALL' | 'OLD_AGE' | 'CHILD_CARE'>('ALL');

  const oldAgeHomes = careHomes.filter((h) => h.type === 'OLD_AGE' && h.status === 'PUBLISHED');
  const childCareHomes = careHomes.filter((h) => h.type === 'CHILD_CARE' && h.status === 'PUBLISHED');

  const displayedHomes =
    activeTab === 'OLD_AGE'
      ? oldAgeHomes
      : activeTab === 'CHILD_CARE'
      ? childCareHomes
      : [...oldAgeHomes, ...childCareHomes];

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-bgLight via-purple-50/40 to-white py-16 sm:py-24 border-b border-brand-border/60">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-4">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-brand-border inline-block shadow-2xs">
            Compassionate Institutional Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark tracking-tight">
            Old Age Home Haven & Child Care Sanctuaries
          </h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Preserving senior dignity with affection and empowering vulnerable children with quality education and maternal tenderness.
          </p>

          {/* Tab Selector */}
          <div className="inline-flex p-1.5 bg-brand-bgLight rounded-2xl border border-brand-border gap-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              All Care Facilities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('OLD_AGE')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'OLD_AGE'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Old Age Home Care
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CHILD_CARE')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'CHILD_CARE'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Child Care Homes
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: OLD AGE HOME CARE PILLAR */}
      {(activeTab === 'ALL' || activeTab === 'OLD_AGE') && (
        <section className="py-16 sm:py-20 border-b border-brand-border/60">
          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
                  Motherly Elder Sanctuary
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-brand-primaryDark">
                  Honoring Our Elders with Dignity & Infinite Love
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Bharathi Foundation’s Old Age Homes provide a warm, peaceful sanctuary for abandoned, destitute, or solitary seniors. Our homes are not sterile institutions—they are vibrant, loving families where every senior citizen receives personalized geriatric nursing, daily physiotherapy, pure vegetarian meals, and spiritual companionship.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-brand-bgLight rounded-2xl border border-brand-border">
                    <Stethoscope className="w-5 h-5 text-brand-primary mb-1" />
                    <strong className="text-xs text-brand-primaryDark block">24/7 Geriatric Care</strong>
                    <span className="text-[11px] text-brand-muted">Visiting MDs, vitals tracking & cardiac response</span>
                  </div>
                  <div className="p-3 bg-brand-bgLight rounded-2xl border border-brand-border">
                    <Heart className="w-5 h-5 text-rose-500 mb-1" />
                    <strong className="text-xs text-brand-primaryDark block">Affection & Comfort</strong>
                    <span className="text-[11px] text-brand-muted">Daily bhajan, garden walks & cultural celebrations</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/register?role=volunteer"
                    className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Volunteer with Elders</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#care-donate"
                    className="px-5 py-2.5 bg-brand-bgLight hover:bg-white text-brand-primary font-bold text-xs rounded-xl border border-brand-border transition-all"
                  >
                    Sponsor an Elder’s Month
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-purple-100">
                  <Image
                    src="https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80"
                    alt="Elder Care Haven"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <span className="text-xs font-bold text-purple-200 uppercase">Sanctuary of Peace</span>
                    <h3 className="text-lg font-black">Bharathi Mathru Devo Bhava Elder Haven</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: CHILD CARE HOMES PILLAR */}
      {(activeTab === 'ALL' || activeTab === 'CHILD_CARE') && (
        <section className="py-16 sm:py-20 bg-brand-bgLight/40 border-b border-brand-border/60">
          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-purple-100">
                  <Image
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
                    alt="Child Care Sanctuary"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <span className="text-xs font-bold text-purple-200 uppercase">Child Empowerment & Learning</span>
                    <h3 className="text-lg font-black">Bharathi Bala Jyothi Child Care Home</h3>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
                    Nurturing Next Generation
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    Child Privacy & Protection Assured
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-brand-primaryDark">
                  Safe Havens, Formal Education & Boundless Futures
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Every child deserves to wake up feeling safe, valued, and empowered. Bharathi Foundation’s Child Care Homes shelter orphaned, abandoned, and destitute children, providing formal schooling, high-protein nutrition, computer literacy, sports mentoring, and psychological care until adulthood.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-2xl border border-brand-border">
                    <Smile className="w-5 h-5 text-brand-secondary mb-1" />
                    <strong className="text-xs text-brand-primaryDark block">Formal Schooling & STEM</strong>
                    <span className="text-[11px] text-brand-muted">Tuitions, computer lab, library & arts</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-brand-border">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                    <strong className="text-xs text-brand-primaryDark block">Holistic Healthcare</strong>
                    <span className="text-[11px] text-brand-muted">Pediatric screening, nutritious diet & counseling</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/register?role=volunteer"
                    className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Mentor Children</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#care-donate"
                    className="px-5 py-2.5 bg-white hover:bg-brand-bgLight text-brand-primary font-bold text-xs rounded-xl border border-brand-border transition-all"
                  >
                    Sponsor Education Kit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FACILITIES DIRECTORY */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-primaryDark">
              Verified Care Facilities
            </h2>
            <p className="text-xs text-brand-muted max-w-xl mx-auto">
              Explore our operating homes, medical provisions, and infrastructure across Karnataka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedHomes.map((home) => (
              <div
                key={home.id}
                className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs hover:shadow-xl transition-all p-6 space-y-4"
              >
                <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-purple-100">
                  <Image src={home.featuredImage} alt={home.name} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    {home.type === 'OLD_AGE' ? 'Old Age Home' : 'Child Care Home'}
                  </span>
                  <span className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{home.city}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-primaryDark">{home.name}</h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{home.description}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-brand-primary uppercase">Key Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {home.facilities.map((fac, i) => (
                      <span key={i} className="text-[10px] bg-brand-bgLight text-brand-text px-2 py-0.5 rounded border border-brand-border">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs">
                  <span className="font-bold text-brand-primary block text-[11px]">Medical & Nursing Provisions:</span>
                  <span className="text-brand-muted">{home.medicalSupport}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-brand-border/60 text-xs">
                  <div className="text-brand-muted">
                    Capacity: <strong className="text-brand-primary">{home.inmatesCount} Residents</strong>
                  </div>
                  <Link
                    href={`/contact?subject=CareHomeVisit_${home.id}`}
                    className="font-bold text-brand-primary hover:underline flex items-center gap-1"
                  >
                    <span>Schedule Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING CARE HOME CELEBRATIONS & EVENTS */}
      <section className="py-16 bg-brand-bgLight/60 border-t border-brand-border/60">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-brand-border inline-block">
              Community Engagement
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-primaryDark">
              Upcoming Events, Celebrations & Volunteer Visits
            </h2>
            <p className="text-xs text-brand-muted max-w-xl mx-auto">
              Join hands with resident elders and children during upcoming cultural celebrations, workshops, and health camps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careHomeEvents.map((evt) => (
              <div key={evt.id} className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-brand-secondary bg-purple-50 px-2 py-0.5 rounded">
                    {evt.type}
                  </span>
                  <h3 className="text-sm font-bold text-brand-primaryDark">{evt.title}</h3>
                  <span className="text-[11px] text-brand-muted block font-semibold">{evt.careHomeName}</span>
                  <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">{evt.description}</p>
                </div>

                <div className="pt-3 border-t border-brand-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs text-brand-muted">
                    <span>📅 {evt.date}</span>
                    <span>⏰ {evt.time}</span>
                  </div>
                  <Link
                    href="/register?role=volunteer"
                    className="w-full py-2 bg-brand-bgLight hover:bg-brand-primary hover:text-white text-brand-primary text-xs font-bold rounded-xl text-center transition-colors block"
                  >
                    Volunteer for Event ({evt.volunteersNeeded - evt.registeredVolunteers} slots left)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT DRIVES WITH UPI QR */}
      <section id="care-donate" className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-brand-primary mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-brand-primaryDark">
            Sponsor a Meal, Medicine, or Education Kit Today
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto leading-relaxed">
            100% of your contributions go directly to senior citizen nutrition, medicines, and child education kits. Tax-exempt under Section 80G.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
            {careHomeCampaigns.map((cmp) => (
              <div key={cmp.id} className="p-4 rounded-2xl bg-brand-bgLight border border-brand-border space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active Drive</span>
                <h4 className="text-xs font-bold text-brand-primaryDark">{cmp.title}</h4>
                <p className="text-[11px] text-brand-muted">{cmp.itemNeeded}</p>
                <div className="pt-2 text-xs font-bold text-brand-primary">
                  Goal: ₹{cmp.targetAmount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-primary/20 transition-all cursor-pointer"
            >
              <span>Donate via Instant UPI QR (80G Tax Exemption)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
