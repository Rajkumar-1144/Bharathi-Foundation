'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { EmergencyBloodRequest, BloodRequestPriority, CampMeeting, BloodDonor } from '@/types';
import {
  Droplet,
  Search,
  ShieldCheck,
  Heart,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Phone,
  Siren,
  Hospital,
  Clock,
  Send,
  User,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Check,
  Building2,
  Ticket,
} from 'lucide-react';

interface DonorEligibility {
  isEligible: boolean;
  statusLabel: 'Available Now' | 'In Recovery';
  daysRemaining: number;
  eligibleDateStr: string;
  formattedLastDonated: string;
  daysSinceLast: number;
}

// 90-Day mandatory cooling-off period calculation rule
function calculateDonorEligibility(lastDonationDate?: string): DonorEligibility {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      statusLabel: 'Available Now',
      daysRemaining: 0,
      eligibleDateStr: 'Immediate',
      formattedLastDonated: 'First-Time / Ready',
      daysSinceLast: 999,
    };
  }

  const last = new Date(lastDonationDate);
  if (isNaN(last.getTime())) {
    return {
      isEligible: true,
      statusLabel: 'Available Now',
      daysRemaining: 0,
      eligibleDateStr: 'Immediate',
      formattedLastDonated: lastDonationDate,
      daysSinceLast: 999,
    };
  }

  // Current real-world comparison against donation date
  const today = new Date();
  const diffTime = today.getTime() - last.getTime();
  const daysSinceLast = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const coolingPeriodDays = 90;

  if (daysSinceLast >= coolingPeriodDays) {
    return {
      isEligible: true,
      statusLabel: 'Available Now',
      daysRemaining: 0,
      eligibleDateStr: 'Eligible Now',
      formattedLastDonated: last.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      daysSinceLast,
    };
  }

  const daysRemaining = coolingPeriodDays - daysSinceLast;
  const eligibleDate = new Date(last.getTime() + coolingPeriodDays * 24 * 60 * 60 * 1000);
  const eligibleDateStr = eligibleDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return {
    isEligible: false,
    statusLabel: 'In Recovery',
    daysRemaining,
    eligibleDateStr,
    formattedLastDonated: last.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    daysSinceLast,
  };
}

// Mask full last name for donor privacy protection (e.g. "Vikas Gowda" -> "Vikas G.")
function maskDonorName(fullName: string): string {
  if (!fullName) return 'Anonymous Donor';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const initials = parts.slice(1).map((p) => (p[0] ? p[0].toUpperCase() + '.' : '')).join(' ');
  return `${first} ${initials}`.trim();
}

export default function BloodDonationPage() {
  const { bloodDonors, camps, bloodRequests, registerBloodDonor, createBloodRequest } = useAppData();

  // Filters State
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'RECOVERY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Standby Donor Registration Form State
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [donorConsent, setDonorConsent] = useState(false);
  const [donorError, setDonorError] = useState('');
  const [donorSuccessMsg, setDonorSuccessMsg] = useState(false);

  // Emergency Blood Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [reqBloodGroup, setReqBloodGroup] = useState('B+');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [reqCity, setReqCity] = useState('Bengaluru');
  const [reqState, setReqState] = useState('Karnataka');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<BloodRequestPriority>('CRITICAL');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Frictionless Camp Walk-In Modal State
  const [walkInCamp, setWalkInCamp] = useState<CampMeeting | null>(null);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const [walkInBloodGroup, setWalkInBloodGroup] = useState('O+');
  const [walkInTimeSlot, setWalkInTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [walkInHealthConfirmed, setWalkInHealthConfirmed] = useState(true);
  const [walkInSuccessToken, setWalkInSuccessToken] = useState<string | null>(null);

  // Tracking State
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedRequest, setTrackedRequest] = useState<EmergencyBloodRequest | null>(null);
  const [trackError, setTrackError] = useState('');

  // Extract unique cities from blood donors list
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    bloodDonors.forEach((d) => {
      if (d.city && d.city.trim()) {
        set.add(d.city.trim());
      }
    });
    return Array.from(set).sort();
  }, [bloodDonors]);

  // Enriched and Filtered Donors with 90-Day Eligibility calculation
  const donorsWithEligibility = useMemo(() => {
    return bloodDonors.map((donor) => ({
      ...donor,
      eligibility: calculateDonorEligibility(donor.lastDonationDate),
      maskedName: maskDonorName(donor.name),
    }));
  }, [bloodDonors]);

  const filteredDonors = useMemo(() => {
    return donorsWithEligibility.filter((d) => {
      // Blood Group filter
      if (selectedGroup !== 'ALL' && d.bloodGroup !== selectedGroup) return false;
      // City filter
      if (selectedCity !== 'ALL' && d.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      // Availability / Recovery filter
      if (availabilityFilter === 'AVAILABLE' && !d.eligibility.isEligible) return false;
      if (availabilityFilter === 'RECOVERY' && d.eligibility.isEligible) return false;
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.maskedName.toLowerCase().includes(q) || d.name.toLowerCase().includes(q);
        const matchCity = d.city.toLowerCase().includes(q);
        const matchLoc = (d.location || '').toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchLoc) return false;
      }
      return true;
    });
  }, [donorsWithEligibility, selectedGroup, selectedCity, availabilityFilter, searchQuery]);

  // Filter blood donation camps
  const bloodCamps = useMemo(() => {
    return camps.filter((c) => c.campType === 'BLOOD_DONATION');
  }, [camps]);

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    setDonorError('');

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();

    if (!trimmedName || !trimmedPhone || !trimmedCity) {
      setDonorError('Please complete your name, contact phone number, and city.');
      return;
    }

    const cleanedPhone = trimmedPhone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setDonorError('Please enter a valid 10-digit mobile contact number.');
      return;
    }

    if (!donorConsent) {
      setDonorError('Please confirm the voluntary donor consent and emergency dispatch pledge.');
      return;
    }

    registerBloodDonor({
      name: trimmedName,
      bloodGroup,
      phone: trimmedPhone,
      email: email.trim() || `${trimmedName.toLowerCase().replace(/\s+/g, '')}@donor.org`,
      city: trimmedCity,
      location: location.trim() || trimmedCity,
      isAvailable: true,
    });

    setDonorSuccessMsg(true);
    setTimeout(() => {
      setDonorSuccessMsg(false);
      setName('');
      setPhone('');
      setEmail('');
      setCity('');
      setLocation('');
      setDonorConsent(false);
    }, 4000);
  };

  const handleCreateBloodRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalName || !mobileNumber) {
      alert('Please fill all mandatory fields for the emergency blood request.');
      return;
    }

    const newId = createBloodRequest({
      patientName,
      bloodGroup: reqBloodGroup,
      unitsRequired: Number(unitsRequired),
      hospitalName,
      hospitalLocation: hospitalLocation || reqCity,
      city: reqCity,
      state: reqState,
      requiredDate,
      priority,
      contactPerson: contactPerson || patientName,
      mobileNumber,
      additionalInfo,
    });

    setCreatedRequestId(newId);
  };

  // Frictionless Walk-In Pre-Registration Handler (No login required)
  const handleWalkInRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInCamp || !walkInName || !walkInPhone) return;

    const token = `BF-WALK-${Math.floor(1000 + Math.random() * 9000)}`;

    // Store walk-in confirmation in local storage for transparency
    try {
      const existing = JSON.parse(localStorage.getItem('bf_camp_walkins') || '[]');
      existing.unshift({
        token,
        campId: walkInCamp.id,
        campTitle: walkInCamp.title,
        venue: walkInCamp.venue,
        city: walkInCamp.city,
        date: walkInCamp.date,
        timeSlot: walkInTimeSlot,
        donorName: walkInName,
        phone: walkInPhone,
        email: walkInEmail,
        bloodGroup: walkInBloodGroup,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem('bf_camp_walkins', JSON.stringify(existing));
    } catch {}

    setWalkInSuccessToken(token);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    const query = trackingInput.trim().toLowerCase();
    if (!query) return;

    const found = bloodRequests.find(
      (r) =>
        r.id.toLowerCase() === query ||
        r.patientName.toLowerCase().includes(query) ||
        r.mobileNumber.includes(query)
    );

    if (found) {
      setTrackedRequest(found);
    } else {
      setTrackError('No blood request found matching that tracking ID or patient name.');
      setTrackedRequest(null);
    }
  };

  const getStatusStepIndex = (status: EmergencyBloodRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'VERIFIED':
        return 1;
      case 'DONOR_IDENTIFIED':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'FULFILLED':
        return 4;
      default:
        return 0;
    }
  };

  // Counts for pills
  const totalDonorsCount = bloodDonors.length;
  const availableNowCount = donorsWithEligibility.filter((d) => d.eligibility.isEligible).length;
  const inRecoveryCount = donorsWithEligibility.filter((d) => !d.eligibility.isEligible).length;

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      {/* Emergency Alert Banner with valid clickable tel: link */}
      <div className="bg-red-600 text-white py-3 px-4 shadow-sm border-b border-red-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs sm:text-sm font-bold gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>24x7 BLOOD SOS HELPLINE: Immediate donor mobilization for critical trauma cases.</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:+919876543210"
              className="hidden sm:inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-full text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Dial: +91 98765 43210</span>
            </a>
            <button
              onClick={() => {
                setCreatedRequestId(null);
                setRequestModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-white text-red-600 hover:bg-gray-100 px-3.5 py-1.5 rounded-full text-xs font-black transition-colors shadow-xs cursor-pointer"
            >
              <Siren className="w-3.5 h-3.5" />
              <span>Raise Emergency Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL-PATH HERO SECTION                                                */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-rose-50/70 via-purple-50/30 to-white py-16 sm:py-20 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest bg-red-100/90 px-4 py-1.5 rounded-full border border-red-200 shadow-2xs">
            <Droplet className="w-3.5 h-3.5 fill-red-600 text-red-600 animate-pulse" />
            <span>Bharathi Blood Bank Alliance • 100% Non-Commercial</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-primaryDark font-serif tracking-tight max-w-4xl mx-auto">
            Emergency Blood Request & Voluntary Donor Network
          </h1>

          <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Connecting voluntary donors with patients across hospitals in urgent need. Non-commercial, verified,
            and fast-tracked.
          </p>

          {/* DUAL-PATH HERO ACTIONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            {/* Primary Action: Prominent Red "Need Blood Urgently" button */}
            <button
              type="button"
              onClick={() => {
                setCreatedRequestId(null);
                setRequestModalOpen(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-2xl text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 cursor-pointer ring-4 ring-red-500/20"
            >
              <Siren className="w-5 h-5 text-white animate-pulse" />
              <span>Need Blood Urgently</span>
            </button>

            {/* Secondary Action: Smooth-scroll to Standby Donor Registration */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('donor-register');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white hover:bg-brand-bgLight text-brand-primaryDark border-2 border-brand-border hover:border-brand-primary font-bold px-7 py-4 rounded-2xl text-base transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
            >
              <Heart className="w-5 h-5 text-red-600 fill-red-600" />
              <span>Register as Standby Donor</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-brand-muted font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Donors Only</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>90-Day Safety Automated</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Free Voluntary Service</span>
            </span>
          </div>
        </div>
      </section>

      {/* LIVE TRACKER STRIP */}
      <section className="py-8 bg-brand-bgLight border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                placeholder="Track by Emergency Request ID (e.g. BF-BLD-2026-0042) or Patient Name..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Track Request Status
            </button>
          </form>

          {trackError && <p className="text-xs text-red-600 font-bold mt-2 text-center">{trackError}</p>}

          {trackedRequest && (
            <div className="mt-4 p-5 bg-white rounded-2xl border border-brand-border shadow-xs animate-fade-in space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/60 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-primary">{trackedRequest.id}</span>
                  <h4 className="text-sm font-bold text-brand-text">
                    Patient: {trackedRequest.patientName} ({trackedRequest.bloodGroup} • {trackedRequest.unitsRequired} units)
                  </h4>
                  <p className="text-xs text-brand-muted">
                    {trackedRequest.hospitalName}, {trackedRequest.city}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    trackedRequest.priority === 'CRITICAL'
                      ? 'bg-red-100 text-red-800'
                      : trackedRequest.priority === 'URGENT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Priority: {trackedRequest.priority}
                </span>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs">
                {['Pending', 'Verified', 'Donor Identified', 'In Progress', 'Fulfilled'].map(
                  (stepName, idx) => {
                    const activeIndex = getStatusStepIndex(trackedRequest.status);
                    const isDone = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;
                    return (
                      <div key={stepName} className="space-y-1">
                        <div
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-bold text-[10px] transition-colors ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          } ${isCurrent ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`block font-medium ${isCurrent ? 'font-bold text-emerald-800' : 'text-brand-muted'}`}>
                          {stepName}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 90-DAY ELIGIBILITY AUTOMATION & VOLUNTARY DONOR DIRECTORY GRID         */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white" id="donor-directory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full inline-block mb-2">
                Automated Medical Safety Filter
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-brand-primaryDark font-serif">
                Verified Voluntary Standby Donors
              </h2>
              <p className="text-sm text-brand-muted mt-1 max-w-2xl">
                Enforces the mandatory <strong>90-day medical cooling-off period</strong>. Full names are masked for donor privacy.
              </p>
            </div>

            {/* Quick Search Box */}
            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search donor or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-brand-border bg-brand-bgLight/50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>
          </div>

          {/* Interactive Filters Panel */}
          <div className="bg-brand-bgLight/70 rounded-3xl p-6 border border-brand-border space-y-5">
            {/* 1. Blood Group Pill Filters */}
            <div>
              <span className="text-xs font-bold text-brand-text uppercase tracking-wider block mb-2.5">
                Filter by Blood Group:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroup('ALL')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedGroup === 'ALL'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white text-brand-text border border-brand-border hover:bg-red-50'
                  }`}
                >
                  <span>All Groups</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedGroup === 'ALL' ? 'bg-white/20' : 'bg-gray-100 text-brand-muted'}`}>
                    {totalDonorsCount}
                  </span>
                </button>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => {
                  const count = bloodDonors.filter((d) => d.bloodGroup === bg).length;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setSelectedGroup(bg)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedGroup === bg
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white text-brand-text border border-brand-border hover:bg-red-50'
                      }`}
                    >
                      <span>{bg}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedGroup === bg ? 'bg-white/20' : 'bg-gray-100 text-brand-muted'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. City Pill Filters */}
            <div className="pt-3 border-t border-brand-border/60">
              <span className="text-xs font-bold text-brand-text uppercase tracking-wider block mb-2.5">
                Filter by City:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCity('ALL')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCity === 'ALL'
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-white text-brand-text border border-brand-border hover:bg-purple-50'
                  }`}
                >
                  All Cities
                </button>
                {uniqueCities.map((c) => {
                  const count = bloodDonors.filter((d) => d.city?.toLowerCase() === c.toLowerCase()).length;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCity(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCity === c
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-white text-brand-text border border-brand-border hover:bg-purple-50'
                      }`}
                    >
                      <span>{c}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCity === c ? 'bg-white/20' : 'bg-gray-100 text-brand-muted'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Availability Status Pill Filters */}
            <div className="pt-3 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-brand-text uppercase tracking-wider mr-1">
                  Medical Availability:
                </span>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('ALL')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    availabilityFilter === 'ALL'
                      ? 'bg-brand-primaryDark text-white shadow-xs'
                      : 'bg-white text-brand-muted border border-brand-border hover:bg-gray-50'
                  }`}
                >
                  All Donors ({totalDonorsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('AVAILABLE')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    availabilityFilter === 'AVAILABLE'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Available Now ({availableNowCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('RECOVERY')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    availabilityFilter === 'RECOVERY'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>In Recovery ({inRecoveryCount})</span>
                </button>
              </div>

              <span className="text-xs text-brand-muted font-medium">
                Showing <strong>{filteredDonors.length}</strong> matching standby donors
              </span>
            </div>
          </div>

          {/* Donor Directory Grid */}
          {filteredDonors.length === 0 ? (
            <div className="p-12 text-center bg-brand-bgLight rounded-3xl border border-brand-border space-y-3">
              <Droplet className="w-10 h-10 text-brand-muted mx-auto" />
              <h4 className="text-base font-bold text-brand-primaryDark">No donors match your current filters</h4>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Try selecting &ldquo;All Groups&rdquo; or clearing your search query to see available voluntary donors across all regions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedGroup('ALL');
                  setSelectedCity('ALL');
                  setAvailabilityFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDonors.map((donor) => {
                const isAvail = donor.eligibility.isEligible;
                return (
                  <div
                    key={donor.id}
                    className="p-5 rounded-3xl bg-white border border-brand-border shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Blood Group + Automated Dynamic Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black flex items-center justify-center text-base shadow-sm group-hover:scale-105 transition-transform">
                          {donor.bloodGroup}
                        </span>

                        {isAvail ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Available Now</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs"
                            title={`90-day medical cooling period active. Eligible on ${donor.eligibility.eligibleDateStr}`}
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>In Recovery</span>
                          </span>
                        )}
                      </div>

                      {/* Donor Masked Name & Location */}
                      <h4 className="font-bold text-base text-brand-primaryDark flex items-center gap-1.5">
                        <User className="w-4 h-4 text-brand-muted shrink-0" />
                        <span>{donor.maskedName}</span>
                      </h4>

                      <p className="text-xs text-brand-muted flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                        <span>{donor.location ? `${donor.location}, ${donor.city}` : donor.city}</span>
                      </p>

                      {/* 90-Day Medical Cooling-off details */}
                      <div className="mt-4 p-3 rounded-2xl bg-brand-bgLight/70 border border-brand-border/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-brand-muted">Last Donated:</span>
                          <span className="font-bold text-brand-text">{donor.eligibility.formattedLastDonated}</span>
                        </div>

                        {!isAvail ? (
                          <>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-amber-700 font-medium">Eligible From:</span>
                              <span className="font-black text-amber-900">{donor.eligibility.eligibleDateStr}</span>
                            </div>
                            {/* Recovery progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mt-1">
                              <div
                                className="bg-amber-500 h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, Math.round((donor.eligibility.daysSinceLast / 90) * 100))}%`,
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-brand-muted block text-right">
                              {donor.eligibility.daysRemaining} days cooldown remaining
                            </span>
                          </>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold pt-0.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Passed 90-day cooldown period</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 mt-4 border-t border-brand-border/60">
                      {isAvail ? (
                        <button
                          type="button"
                          onClick={() => {
                            setReqBloodGroup(donor.bloodGroup);
                            setReqCity(donor.city);
                            setRequestModalOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Droplet className="w-3.5 h-3.5 fill-white" />
                          <span>Request Match ({donor.bloodGroup})</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 rounded-xl bg-gray-100 text-brand-muted text-xs font-semibold cursor-not-allowed text-center"
                          title={`Cooldown active until ${donor.eligibility.eligibleDateStr}`}
                        >
                          Cooldown Active ({donor.eligibility.daysRemaining}d left)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. UPCOMING CAMPS (DUAL-ACTION: FRICTIONLESS WALK-IN PRE-REGISTER)        */}
      {/* ========================================================================= */}
      <section className="py-16 bg-brand-bgLight/60 border-t border-brand-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Registration Form & Upcoming Drives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10" id="donor-register">
            {/* Standby Donor Registration Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold shadow-xs">
                  <Droplet className="w-6 h-6 fill-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-brand-primaryDark font-serif">Enlist in Standby Donor Registry</h3>
                  <p className="text-xs text-brand-muted">Join our standby network to be contacted in times of critical emergency</p>
                </div>
              </div>

              {donorError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{donorError}</span>
                </div>
              )}

              {donorSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Success! You are now enlisted in the Bharathi Foundation Emergency Blood Donor Registry.</span>
                </div>
              )}

              <form onSubmit={handleRegisterDonor} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikas Gowda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Blood Group *</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden bg-white"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="vikas@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Locality / Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Indiranagar"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Privacy & Dispatch Consent */}
                <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-950">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={donorConsent}
                      onChange={(e) => setDonorConsent(e.target.checked)}
                      className="mt-0.5 rounded border-rose-300 text-red-600 focus:ring-red-500 shrink-0"
                    />
                    <span className="leading-relaxed">
                      <strong>Voluntary Donor Consent & Privacy Protection:</strong> I consent to join the voluntary standby donor directory. I understand my direct contact info is protected and masked from the public, and foundation coordinators will dispatch alerts only for verified hospital emergency patient needs.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Enlist in Voluntary Donor Directory</span>
                </button>
              </form>
            </div>

            {/* Upcoming Blood Donation Camps with Dual-Action Cards */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full">
                  Frictionless Participation
                </span>
                <h3 className="text-2xl font-black text-brand-primaryDark font-serif mt-2">
                  Upcoming Blood Donation Camps
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  Walk-in camps conducted in association with accredited blood banks and hospital authorities. Pre-register without logging in.
                </p>
              </div>

              <div className="space-y-4">
                {bloodCamps.length === 0 ? (
                  <p className="text-xs text-brand-muted italic">No upcoming blood donation camps scheduled.</p>
                ) : (
                  bloodCamps.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-border shadow-md hover:shadow-xl transition-all space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                          {camp.status}
                        </span>
                        <span className="text-xs text-brand-muted font-medium flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                          <span>{camp.organizerName}</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-brand-primaryDark">{camp.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-muted mt-2">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4 text-red-600 shrink-0" />
                            <span>{camp.date} • {camp.time}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                            <span>{camp.venue}, {camp.city}</span>
                          </span>
                        </div>
                        {camp.description && (
                          <p className="text-xs text-brand-muted line-clamp-2 mt-2 leading-relaxed">
                            {camp.description}
                          </p>
                        )}
                      </div>

                      {/* DUAL-ACTION CARDS: Pre-Register Walk-In Donor + Volunteer for Camp */}
                      <div className="pt-3 border-t border-brand-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        {/* Dual-Action 1: Frictionless Walk-In Pre-Registration (NO login required) */}
                        <button
                          type="button"
                          onClick={() => {
                            setWalkInCamp(camp);
                            setWalkInSuccessToken(null);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>Pre-Register as Walk-In Donor</span>
                        </button>

                        {/* Dual-Action 2: Volunteer for Camp redirect with proper return context */}
                        <Link
                          href={`/register?role=VOLUNTEER&campId=${camp.id}&returnUrl=/blood-donation`}
                          className="bg-purple-50 hover:bg-purple-100 text-brand-primaryDark border border-purple-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center shrink-0"
                        >
                          <span>Volunteer for Camp</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INLINE FRICTIONLESS WALK-IN PRE-REGISTRATION MODAL                        */}
      {/* ========================================================================= */}
      {walkInCamp && (
        <Modal
          isOpen={Boolean(walkInCamp)}
          onClose={() => {
            setWalkInCamp(null);
            setWalkInSuccessToken(null);
          }}
          title={walkInSuccessToken ? 'Walk-In Donor Pass Generated' : 'Pre-Register as Walk-In Donor'}
          subtitle={walkInSuccessToken ? 'Show this digital pass at the camp reception' : walkInCamp.title}
          maxWidth="lg"
        >
          {walkInSuccessToken ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-brand-primaryDark font-serif">Walk-In Pre-Registration Confirmed</h3>
                <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                  No login required! Your slot has been recorded with priority reception clearance.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-3xl p-5 border-2 border-dashed border-red-300 text-left space-y-3 max-w-md mx-auto shadow-sm">
                <div className="flex items-center justify-between border-b border-brand-border/60 pb-2.5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600">Walk-In Pass Reference</span>
                    <span className="font-mono text-base font-black text-brand-primaryDark block">{walkInSuccessToken}</span>
                  </div>
                  <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    {walkInBloodGroup}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-brand-muted text-[11px] block">Donor Name</span>
                    <strong className="text-brand-text">{walkInName}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted text-[11px] block">Mobile Phone</span>
                    <strong className="text-brand-text">{walkInPhone}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted text-[11px] block">Camp Date</span>
                    <strong className="text-brand-text">{walkInCamp.date}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted text-[11px] block">Selected Time Slot</span>
                    <strong className="text-brand-text">{walkInTimeSlot}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border/60">
                  <span className="text-brand-muted text-[11px] block">Camp Venue & Address</span>
                  <p className="text-xs font-bold text-brand-primaryDark flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{walkInCamp.venue}, {walkInCamp.city}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setWalkInCamp(null);
                    setWalkInSuccessToken(null);
                  }}
                  className="bg-brand-primary text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs hover:bg-brand-primaryDark transition-colors"
                >
                  Done / Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWalkInRegistration} className="space-y-4 pt-1">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-700">
                  <CalendarDays className="w-4 h-4 text-red-600" />
                  <span>{walkInCamp.title}</span>
                </div>
                <p className="text-brand-muted text-[11px]">
                  {walkInCamp.date} • {walkInCamp.venue}, {walkInCamp.city}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Mobile Phone (for SMS Pass) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Blood Group *</label>
                  <select
                    value={walkInBloodGroup}
                    onChange={(e) => setWalkInBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden bg-white"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', "First Time / Don't Know"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Preferred Arrival Time Slot *</label>
                  <select
                    value={walkInTimeSlot}
                    onChange={(e) => setWalkInTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden bg-white"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Mid-Day)</option>
                    <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM (Afternoon)</option>
                    <option value="03:00 PM - 04:30 PM">03:00 PM - 04:30 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={walkInEmail}
                  onChange={(e) => setWalkInEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="walkInCheck"
                  checked={walkInHealthConfirmed}
                  onChange={(e) => setWalkInHealthConfirmed(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="walkInCheck" className="text-[11px] text-brand-muted leading-relaxed">
                  I confirm that I am aged 18–65, weigh 45 kg+, and have not had a blood donation or surgical procedure in the past 90 days.
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setWalkInCamp(null)}
                  className="px-4 py-2 text-xs font-bold text-brand-muted hover:text-brand-text rounded-xl border border-brand-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Generate Free Walk-In Pass</span>
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* EMERGENCY BLOOD REQUEST MODAL (SOS)                                       */}
      {/* ========================================================================= */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Emergency Blood Request (SOS)"
      >
        {createdRequestId ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-brand-text">Blood Request Submitted Successfully</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Your emergency request has been broadcast to our coordinating team and matched standby donors.
            </p>
            <div className="p-4 bg-brand-bgLight rounded-2xl border border-brand-border max-w-sm mx-auto">
              <span className="text-[11px] text-brand-muted block">Your Emergency Tracking ID</span>
              <span className="font-mono text-base font-bold text-brand-primary block mt-1">
                {createdRequestId}
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              Save this ID to track request status anytime on this page.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="bg-brand-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateBloodRequest} className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
              <Siren className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Please provide accurate hospital and patient details. Our emergency dispatch hotline coordinates
                directly with verified hospital blood banks.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Babu"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Required Blood Group *</label>
                <select
                  value={reqBloodGroup}
                  onChange={(e) => setReqBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden bg-white"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Units Needed *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={unitsRequired}
                  onChange={(e) => setUnitsRequired(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Required By Date *</label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Urgency Priority *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as BloodRequestPriority)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden bg-white font-bold text-red-600"
                >
                  <option value="CRITICAL">CRITICAL (Under 2 hrs)</option>
                  <option value="URGENT">URGENT (Same Day)</option>
                  <option value="STANDARD">STANDARD (Scheduled)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Hospital / Medical Centre *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Hospital Ward / Locality</label>
                <input
                  type="text"
                  placeholder="e.g. ICU Ward 3B, Fort"
                  value={hospitalLocation}
                  onChange={(e) => setHospitalLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru"
                  value={reqCity}
                  onChange={(e) => setReqCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">State *</label>
                <input
                  type="text"
                  required
                  placeholder="Karnataka"
                  value={reqState}
                  onChange={(e) => setReqState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Attendant / Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="Attendant full name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Attendant Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Additional Medical Notes</label>
              <textarea
                rows={2}
                placeholder="Doctor's prescription note, specific component requirement (e.g. Platelets, FFP, Whole Blood)..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-brand-muted hover:text-brand-text rounded-xl border border-brand-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Emergency Request</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
