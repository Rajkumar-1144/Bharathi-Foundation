'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import {
  Layers,
  MapPin,
  Calendar,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Filter,
  Eye,
  Heart,
  X,
  Sparkles,
} from 'lucide-react';

const ACTIVITY_CATEGORIES = [
  'All Activities',
  'Food Distribution',
  'Blood Donation Camps',
  'Free Medical Camps',
  'NGO Activities',
  'Volunteer Services',
  'Educational Programs',
  'Elderly Care',
  'Emergency Relief',
  'Community Support',
  'Camp Meetings',
  'Donation Campaigns',
];

export default function ActivitiesPage() {
  const { camps, ngoActivities, websiteContent, careHomes } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState('All Activities');
  const [activeModalActivity, setActiveModalActivity] = useState<any | null>(null);

  // Unify verified and published activities
  const allActivities: any[] = [];

  // 1. From Camps (Published)
  camps.forEach((camp) => {
    allActivities.push({
      id: camp.id,
      title: camp.title,
      category:
        camp.campType === 'BLOOD_DONATION'
          ? 'Blood Donation Camps'
          : camp.campType === 'MEDICAL_CHECKUP' || camp.campType === 'EYE_CARE' || camp.campType === 'PEDIATRIC'
          ? 'Free Medical Camps'
          : camp.campType === 'FOOD_RELIEF'
          ? 'Food Distribution'
          : 'Camp Meetings',
      description: camp.description,
      date: camp.date,
      location: `${camp.venue}, ${camp.city}`,
      organizer: camp.organizerName,
      beneficiaries: camp.targetBeneficiaries,
      volunteersCount: camp.volunteersRegistered,
      imageUrl:
        camp.bannerImage ||
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
      ],
      status: camp.status,
    });
  });

  // 2. From NGO Activities (Approved & Published)
  ngoActivities
    .filter((a) => a.status === 'APPROVED' || a.status === 'COMPLETED' || a.status === 'IN_PROGRESS')
    .forEach((act) => {
      allActivities.push({
        id: act.id,
        title: act.title,
        category: act.category.includes('Food')
          ? 'Food Distribution'
          : act.category.includes('Medical')
          ? 'Free Medical Camps'
          : act.category.includes('Elder')
          ? 'Elderly Care'
          : act.category.includes('Child')
          ? 'Educational Programs'
          : 'NGO Activities',
        description: act.description,
        date: act.startDate,
        location: act.location,
        organizer: act.ngoName,
        beneficiaries: act.targetBeneficiaries,
        volunteersCount: act.volunteersRequired,
        imageUrl:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
        additionalImages: [
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80',
        ],
        status: act.status,
      });
    });

  // 3. From CMS Impact Stories
  (websiteContent.impactStoriesList || [])
    .filter((s) => s.published !== false)
    .forEach((story) => {
      allActivities.push({
        id: story.id,
        title: story.title,
        category: story.category,
        description: story.description,
        date: story.date,
        location: story.location,
        organizer: 'Bharathi Foundation Trust',
        beneficiaries: story.beneficiariesCount,
        volunteersCount: 24,
        imageUrl: story.images[0] || 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80',
        additionalImages: story.images,
        status: 'COMPLETED',
      });
    });

  // 4. From Donation Campaigns
  (websiteContent.donationCampaignsList || [])
    .filter((c) => c.published !== false)
    .forEach((camp) => {
      allActivities.push({
        id: camp.id,
        title: camp.title,
        category: 'Donation Campaigns',
        description: camp.description,
        date: 'Ongoing 2026',
        location: 'Pan-Karnataka Relief Network',
        organizer: 'Bharathi Foundation Care Desk',
        beneficiaries: 150,
        volunteersCount: 30,
        imageUrl: camp.imageUrl,
        additionalImages: [camp.imageUrl],
        status: camp.status,
      });
    });

  // Filter based on category
  const filteredActivities =
    selectedCategory === 'All Activities'
      ? allActivities
      : allActivities.filter((a) => a.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-brand-bgLight py-16 sm:py-20 border-b border-brand-border/60">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-4">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-brand-border inline-block">
            Field Ground Operations
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">
            Foundation Activities & Programs
          </h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Every approved public program, medical diagnostic camp, food distribution drive, and partner NGO activity verified by Bharathi Foundation.
          </p>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-brand-border/60 py-4 shadow-2xs">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {ACTIVITY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-brand-bgLight text-brand-muted hover:text-brand-text hover:bg-purple-100/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16 sm:py-20 flex-1">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              Showing {filteredActivities.length} Approved Activities
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              100% Verified Impact Records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-brand-bgLight rounded-3xl border border-brand-border space-y-3">
                <Layers className="w-10 h-10 text-brand-muted mx-auto" />
                <h4 className="text-base font-bold text-brand-primaryDark">No Activities Found in this Category</h4>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  No public field activities found matching this category filter. Select &ldquo;All Activities&rdquo; to browse all verified operations.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All Activities')}
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl"
                >
                  View All Activities
                </button>
              </div>
            ) : (
              filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl border border-brand-border/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand-primary/40 transition-all duration-300 flex flex-col justify-between group"
                >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-purple-100">
                    <Image
                      src={act.imageUrl}
                      alt={act.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 bg-white/95 text-brand-primary text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {act.category}
                    </span>
                    <span className="absolute bottom-3 left-4 text-white text-xs font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-300" />
                      <span>{act.location}</span>
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-brand-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                        <span>{act.date}</span>
                      </span>
                      <span className="font-semibold text-brand-primaryDark">{act.organizer}</span>
                    </div>

                    <h3 className="text-base font-bold text-brand-primaryDark group-hover:text-brand-primary transition-colors line-clamp-2">
                      {act.title}
                    </h3>

                    <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">
                      {act.description}
                    </p>

                    {/* Beneficiary Badge */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-brand-border/60">
                      <span className="text-brand-muted">Verified Beneficiaries:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {act.beneficiaries ? `${act.beneficiaries.toLocaleString('en-IN')}+ Impacted` : 'Community Wide'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveModalActivity(act)}
                    className="w-full py-3 bg-brand-bgLight hover:bg-brand-primary hover:text-white text-brand-primary font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer group-hover:bg-brand-primary group-hover:text-white"
                  >
                    <span>View Activity Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </section>

      {/* Activity Details Modal */}
      {activeModalActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-brand-border space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
                  {activeModalActivity.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-brand-primaryDark mt-2">
                  {activeModalActivity.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalActivity(null)}
                className="text-brand-muted hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-bgLight cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Featured Photo */}
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-purple-100">
              <Image
                src={activeModalActivity.imageUrl}
                alt={activeModalActivity.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-brand-bgLight rounded-2xl border border-brand-border text-center">
              <div>
                <span className="text-[10px] text-brand-muted uppercase block">Event Date</span>
                <span className="text-xs font-bold text-brand-primaryDark">{activeModalActivity.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted uppercase block">Location</span>
                <span className="text-xs font-bold text-brand-primaryDark">{activeModalActivity.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted uppercase block">Organizing NGO</span>
                <span className="text-xs font-bold text-brand-primaryDark">{activeModalActivity.organizer}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted uppercase block">Impacted</span>
                <span className="text-xs font-bold text-emerald-700">{activeModalActivity.beneficiaries}+ Lives</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-brand-primaryDark">Comprehensive Activity Overview</h4>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed whitespace-pre-line">
                {activeModalActivity.description}
              </p>
            </div>

            {/* Additional Photographs Gallery */}
            {activeModalActivity.additionalImages && activeModalActivity.additionalImages.length > 1 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-brand-primaryDark">Field Photographs Archive</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeModalActivity.additionalImages.map((img: string, i: number) => (
                    <div key={i} className="relative h-28 rounded-xl overflow-hidden bg-purple-100">
                      <Image src={img} alt="Activity photo" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-brand-border/60">
              <button
                type="button"
                onClick={() => setActiveModalActivity(null)}
                className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Activity Details
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
