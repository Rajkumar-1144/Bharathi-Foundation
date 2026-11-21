'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { CampMeeting } from '@/types';
import {
  Tent,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
  Droplet,
  Stethoscope,
  Eye,
  X,
  Phone,
  Mail,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export default function CampsPage() {
  const { camps } = useAppData();
  const [filterType, setFilterType] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');

  // Walk-in Pre-Registration Modal State
  const [walkInModalCamp, setWalkInModalCamp] = useState<CampMeeting | null>(null);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const [walkInSlot, setWalkInSlot] = useState('10:00 AM - 12:00 PM');
  const [walkInBloodGroup, setWalkInBloodGroup] = useState('O+');
  const [walkInPassToken, setWalkInPassToken] = useState<string | null>(null);

  // Filter camps by selected category
  const filteredCamps = useMemo(() => {
    return filterType === 'ALL' ? camps : camps.filter((c) => c.campType === filterType);
  }, [camps, filterType]);

  // Separate upcoming and completed camps automatically based on date
  const { upcomingCamps, completedCamps } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming: CampMeeting[] = [];
    const completed: CampMeeting[] = [];

    filteredCamps.forEach((camp) => {
      const campDate = new Date(camp.date);
      // If valid date and in the future, or status explicitly set to UPCOMING
      if (!isNaN(campDate.getTime()) && campDate >= today) {
        upcoming.push(camp);
      } else if (camp.status === 'UPCOMING') {
        upcoming.push(camp);
      } else {
        completed.push(camp);
      }
    });

    // Sort upcoming by earliest date first
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // Sort completed by most recent date first
    completed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcomingCamps: upcoming, completedCamps: completed };
  }, [filteredCamps]);

  // Frictionless Walk-In Registration Handler
  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInModalCamp || !walkInName.trim() || !walkInPhone.trim()) return;

    const token = `BF-CAMP-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const existing = JSON.parse(localStorage.getItem('bf_camp_walkins') || '[]');
      existing.unshift({
        token,
        campId: walkInModalCamp.id,
        campTitle: walkInModalCamp.title,
        venue: walkInModalCamp.venue,
        city: walkInModalCamp.city,
        date: walkInModalCamp.date,
        timeSlot: walkInSlot,
        donorName: walkInName.trim(),
        phone: walkInPhone.trim(),
        email: walkInEmail.trim() || undefined,
        bloodGroup: walkInModalCamp.campType === 'BLOOD_DONATION' ? walkInBloodGroup : undefined,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem('bf_camp_walkins', JSON.stringify(existing));
    } catch {}

    setWalkInPassToken(token);
  };

  const closeWalkInModal = () => {
    setWalkInModalCamp(null);
    setWalkInPassToken(null);
    setWalkInName('');
    setWalkInPhone('');
    setWalkInEmail('');
  };

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-brand-bgLight via-purple-50/30 to-white py-16 sm:py-20 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-brand-border inline-block shadow-2xs">
            Field Outreach Schedule & Impact
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif">
            Medical & Community Camps
          </h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Discover upcoming and completed free health checkups, eye care diagnostics, and voluntary blood donation camps conducted across Karnataka.
          </p>

          {/* Quick Stats Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-brand-muted">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{upcomingCamps.length} Upcoming Scheduled Drives</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              <Users className="w-4 h-4 text-brand-primary" />
              <span>{completedCamps.length} Completed Impact Camps</span>
            </span>
            <span className="flex items-center gap-1.5 text-brand-primaryDark bg-white px-3 py-1 rounded-full border border-brand-border">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Free & Medically Supervised</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Controls: Segment Tabs (Upcoming vs Completed) & Type Filter */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-brand-border/80">
            {/* Automatic Date Separation Tabs */}
            <div className="inline-flex p-1.5 bg-brand-bgLight rounded-2xl border border-brand-border">
              <button
                type="button"
                onClick={() => setActiveTab('UPCOMING')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'UPCOMING'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Upcoming Camps ({upcomingCamps.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COMPLETED')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'COMPLETED'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed Camps ({completedCamps.length})</span>
              </button>
            </div>

            {/* Filter by Category */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'All Disciplines', value: 'ALL' },
                { label: 'Blood Donation', value: 'BLOOD_DONATION' },
                { label: 'Medical Checkup', value: 'MEDICAL_CHECKUP' },
                { label: 'Eye & Vision Care', value: 'EYE_CARE' },
                { label: 'Pediatric Care', value: 'PEDIATRIC' },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilterType(f.value)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    filterType === f.value
                      ? 'bg-brand-secondaryDark text-white shadow-2xs'
                      : 'bg-white text-brand-muted border border-brand-border hover:bg-brand-bgLight'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* UPCOMING CAMPS VIEW */}
          {activeTab === 'UPCOMING' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-brand-primaryDark font-serif">
                    Upcoming Camps Open for Registration
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Walk-in participation is welcome. You may pre-register online for prioritized time slots without creating an account.
                  </p>
                </div>

                <Link
                  href="/register?role=volunteer"
                  className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-brand-secondary to-[#C4B5FD] text-brand-primaryDark text-xs font-black px-4 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Enlist as Camp Volunteer</span>
                </Link>
              </div>

              {upcomingCamps.length === 0 ? (
                <div className="p-12 text-center bg-brand-bgLight rounded-3xl border border-brand-border space-y-3">
                  <Calendar className="w-10 h-10 text-brand-muted mx-auto" />
                  <h4 className="text-base font-bold text-brand-primaryDark">No Upcoming Camps In This Category</h4>
                  <p className="text-xs text-brand-muted max-w-md mx-auto">
                    New dates for health screenings and blood donation drives are announced regularly. Please check &ldquo;All Disciplines&rdquo; or contact us to host a camp in your locality.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterType('ALL')}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl"
                  >
                    View All Categories
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingCamps.map((camp) => (
                    <div
                      key={camp.id}
                      className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Camp Banner */}
                        <div className="relative h-52 w-full bg-brand-bgLight overflow-hidden">
                          <Image
                            src={
                              camp.bannerImage ||
                              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
                            }
                            alt={camp.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-brand-primary/95 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs shadow-xs">
                              {camp.campType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>Upcoming</span>
                            </span>
                          </div>
                        </div>

                        {/* Camp Details */}
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="font-bold text-lg text-brand-primaryDark group-hover:text-brand-primary transition-colors">
                              {camp.title}
                            </h3>
                            <p className="text-xs text-brand-muted mt-1 leading-relaxed line-clamp-2">
                              {camp.description}
                            </p>
                          </div>

                          <div className="space-y-2 text-xs text-brand-muted border-t border-brand-border/60 pt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
                              <span className="font-semibold text-brand-text">
                                {new Date(camp.date).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-brand-primary shrink-0" />
                              <span>{camp.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                              <span className="truncate">
                                {camp.venue}, {camp.city}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-brand-primary shrink-0" />
                              <span className="truncate">Organizer: {camp.organizerName}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dual Action Footer: Pre-Register Walk-In OR Volunteer */}
                      <div className="p-6 pt-0 border-t border-brand-border/60 space-y-2.5">
                        <div className="flex items-center justify-between text-xs pt-3 pb-1">
                          <span className="text-brand-muted font-medium">Volunteers Assigned:</span>
                          <span className="font-bold text-brand-primary">
                            {camp.volunteersRegistered} / {camp.volunteersNeeded}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setWalkInModalCamp(camp)}
                            className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Pre-Register</span>
                          </button>

                          <Link
                            href={`/register?role=VOLUNTEER&campId=${camp.id}&returnUrl=/camps`}
                            className="w-full bg-brand-bgLight hover:bg-purple-100/70 text-brand-primaryDark text-xs font-bold py-2.5 rounded-xl transition-all border border-brand-border text-center flex items-center justify-center"
                          >
                            <span>Volunteer</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COMPLETED CAMPS VIEW */}
          {activeTab === 'COMPLETED' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-brand-primaryDark font-serif">
                    Completed Medical & Health Drives Archive
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Verified record of free health checkups, cataract screenings, and blood mobilization drives successfully executed.
                  </p>
                </div>

                <Link
                  href="/gallery"
                  className="hidden sm:inline-flex items-center gap-2 bg-brand-bgLight hover:bg-brand-primary hover:text-white text-brand-primary text-xs font-bold px-4 py-2.5 rounded-xl border border-brand-border transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Photo Archive</span>
                </Link>
              </div>

              {completedCamps.length === 0 ? (
                <div className="p-12 text-center bg-brand-bgLight rounded-3xl border border-brand-border space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-brand-muted mx-auto" />
                  <h4 className="text-base font-bold text-brand-primaryDark">No Completed Camps Recorded Yet</h4>
                  <p className="text-xs text-brand-muted max-w-md mx-auto">
                    All upcoming scheduled camps will automatically archive here upon completion with verified beneficiary impact metrics.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {completedCamps.map((camp) => (
                    <div
                      key={camp.id}
                      className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Camp Banner */}
                        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                          <Image
                            src={
                              camp.bannerImage ||
                              'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800'
                            }
                            alt={camp.title}
                            fill
                            className="object-cover opacity-90"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-gray-800/90 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                              {camp.campType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-white" />
                              <span>Completed</span>
                            </span>
                          </div>
                        </div>

                        {/* Camp Details */}
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="font-bold text-lg text-brand-primaryDark">{camp.title}</h3>
                            <p className="text-xs text-brand-muted mt-1 leading-relaxed line-clamp-2">
                              {camp.description}
                            </p>
                          </div>

                          <div className="space-y-2 text-xs text-brand-muted border-t border-brand-border/60 pt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-brand-muted shrink-0" />
                              <span className="text-brand-text font-medium">
                                Concluded: {new Date(camp.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-brand-muted shrink-0" />
                              <span className="truncate">
                                {camp.venue}, {camp.city}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-brand-muted shrink-0" />
                              <span className="truncate">Beneficiaries Served: ~{camp.targetBeneficiaries || 120}+</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Completed Camp Footer */}
                      <div className="p-6 pt-0 border-t border-brand-border/60 flex items-center justify-between text-xs">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Field Work Concluded</span>
                        </span>
                        <Link
                          href="/gallery"
                          className="text-brand-primary font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Photos</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Frictionless Walk-In Pre-Registration Modal */}
      {walkInModalCamp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-brand-border relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={closeWalkInModal}
              className="absolute top-5 right-5 text-brand-muted hover:text-brand-text p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!walkInPassToken ? (
              <>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-purple-100 px-2.5 py-0.5 rounded-full">
                    No Account Required • 100% Free
                  </span>
                  <h3 className="text-xl font-black text-brand-primaryDark font-serif mt-1.5">
                    Pre-Register as Walk-In Participant
                  </h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    Reserve your spot for <strong>{walkInModalCamp.title}</strong> at {walkInModalCamp.venue}, {walkInModalCamp.city} on {walkInModalCamp.date}.
                  </p>
                </div>

                <form onSubmit={handleWalkInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Babu"
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-text mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98450 00000"
                        value={walkInPhone}
                        onChange={(e) => setWalkInPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-text mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        placeholder="ramesh@gmail.com"
                        value={walkInEmail}
                        onChange={(e) => setWalkInEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-text mb-1">Preferred Time Slot *</label>
                      <select
                        value={walkInSlot}
                        onChange={(e) => setWalkInSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden bg-white"
                      >
                        <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                        <option value="01:30 PM - 03:30 PM">01:30 PM - 03:30 PM</option>
                        <option value="03:30 PM - 05:00 PM">03:30 PM - 05:00 PM</option>
                      </select>
                    </div>

                    {walkInModalCamp.campType === 'BLOOD_DONATION' && (
                      <div>
                        <label className="block text-xs font-bold text-brand-text mb-1">Blood Group</label>
                        <select
                          value={walkInBloodGroup}
                          onChange={(e) => setWalkInBloodGroup(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden bg-white"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Generate Digital Walk-In Pass</span>
                  </button>
                </form>
              </>
            ) : (
              /* Success Digital Pass Card */
              <div className="space-y-5 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    Pre-Registration Confirmed
                  </span>
                  <h3 className="text-2xl font-black text-brand-primaryDark font-serif mt-2">
                    Digital Walk-In Pass
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">
                    Please display this reference pass upon arriving at the camp reception desk.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-brand-bgLight border-2 border-brand-primary/20 text-left space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-border">
                    <span className="text-brand-muted">Pass Reference:</span>
                    <span className="font-mono font-black text-sm text-brand-primary">{walkInPassToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Participant:</span>
                    <span className="font-bold text-brand-text">{walkInName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Camp Drive:</span>
                    <span className="font-bold text-brand-text truncate max-w-[200px]">{walkInModalCamp.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Date & Slot:</span>
                    <span className="font-bold text-brand-text">{walkInModalCamp.date} ({walkInSlot})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Venue:</span>
                    <span className="font-bold text-brand-text truncate max-w-[200px]">{walkInModalCamp.venue}, {walkInModalCamp.city}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeWalkInModal}
                  className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl text-xs hover:bg-brand-primaryDark transition-all"
                >
                  Done & Close Pass
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
