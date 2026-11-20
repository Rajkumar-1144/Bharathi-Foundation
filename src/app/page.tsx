'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { TRANSLATIONS } from '@/translations';
import { INITIAL_WEBSITE_CONTENT, INITIAL_GALLERY } from '@/data/initialData';
import {
  Heart,
  Droplet,
  Users,
  Tent,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Send,
  Eye,
  Award,
  Sparkles,
  PhoneCall,
  Stethoscope,
  BookOpen,
  UtensilsCrossed,
  Siren,
  QrCode,
  Shield,
  Star,
  Quote,
  ChevronRight,
  ExternalLink,
  Phone,
  CheckCircle,
  Smile,
  Globe,
  UserCheck,
  X,
  Layers,
} from 'lucide-react';

const ACTIVITY_CATEGORIES = [
  'All',
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

export default function HomePage() {
  const {
    camps,
    gallery,
    websiteContent,
    computedStats,
    submitDonationClaim,
    registerBloodDonor,
    language,
    careHomes,
    ngoActivities,
  } = useAppData();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Quick Donation Form State
  const [donateAmount, setDonateAmount] = useState<number | ''>(1000);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('Food Donation & Daily Meals Drive');
  const [donationPurpose, setDonationPurpose] = useState('Food Donation');
  const [otherDonationPurpose, setOtherDonationPurpose] = useState('');
  const [donationSuccessMsg, setDonationSuccessMsg] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dbQrSettings, setDbQrSettings] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);

    const fetchQr = async () => {
      try {
        const res = await fetch('/api/qr-settings', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDbQrSettings(json.data);
          }
        }
      } catch {}
    };

    fetchQr();
    window.addEventListener('focus', fetchQr);
    return () => window.removeEventListener('focus', fetchQr);
  }, []);

  // Gallery Modal
  const [activePhoto, setActivePhoto] = useState<any | null>(null);
  const [galleryFilter, setGalleryFilter] = useState('ALL');

  // Activity Details Modal
  const [activeActivityModal, setActiveActivityModal] = useState<any | null>(null);
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('All');

  // Blood Donor Registration State
  const [bdName, setBdName] = useState('');
  const [bdGroup, setBdGroup] = useState('O+');
  const [bdPhone, setBdPhone] = useState('');
  const [bdCity, setBdCity] = useState('');
  const [bdSuccess, setBdSuccess] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Filter approved gallery items (guaranteed fallback to default verified field photos)
  const defaultGallery = INITIAL_GALLERY || [];
  const rawGallery = (gallery && gallery.length > 0) ? gallery : defaultGallery;
  const approvedGallery = rawGallery.filter((item) => item.isApproved);
  const displayGallery = approvedGallery.length > 0 ? approvedGallery : defaultGallery.filter((item) => item.isApproved !== false);
  const filteredGallery =
    galleryFilter === 'ALL'
      ? displayGallery.slice(0, 6)
      : displayGallery.filter((item) => item.category === galleryFilter).slice(0, 6);

  // Copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(websiteContent.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Submit Donation Reference
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || !donateAmount || !donorName || !donorEmail || !donorPhone) {
      alert('Please fill all mandatory donation fields.');
      return;
    }

    if (donationPurpose === 'Other' && !otherDonationPurpose.trim()) {
      alert('Please specify your donation purpose.');
      return;
    }

    const finalPurpose = donationPurpose === 'Other' ? otherDonationPurpose.trim() : donationPurpose;

    submitDonationClaim({
      donorName,
      donorEmail,
      donorPhone,
      donorPan: donorPan || undefined,
      amount: Number(donateAmount),
      utrReference: utrNumber.trim(),
      paymentMethod: 'UPI',
      campaignTitle: selectedCampaign,
      purpose: finalPurpose,
      otherPurpose: donationPurpose === 'Other' ? otherDonationPurpose.trim() : undefined,
    });

    setDonationSuccessMsg(
      `Thank you, ${donorName}! Your contribution for "${finalPurpose}" with UTR #${utrNumber} for ₹${Number(
        donateAmount
      ).toLocaleString(
        'en-IN'
      )} has been recorded as PENDING VERIFICATION. An official 80G receipt will be generated upon admin reconciliation.`
    );
    setUtrNumber('');
    setOtherDonationPurpose('');
    setTimeout(() => setDonationSuccessMsg(''), 8000);
  };

  // Submit Blood Donor
  const handleBloodDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bdName || !bdPhone || !bdCity) {
      alert('Please fill name, contact number, and city.');
      return;
    }
    registerBloodDonor({
      name: bdName,
      bloodGroup: bdGroup,
      phone: bdPhone,
      email: `${bdName.toLowerCase().replace(/\s+/g, '')}@donor.org`,
      city: bdCity,
      location: bdCity,
      isAvailable: true,
    });
    setBdSuccess(true);
    setTimeout(() => {
      setBdSuccess(false);
      setBdName('');
      setBdPhone('');
      setBdCity('');
    }, 4000);
  };

  // Dynamic services list from CMS with guaranteed fallback to default 6 core services
  const defaultServices = INITIAL_WEBSITE_CONTENT.servicesList || [];
  const rawServices = (websiteContent?.servicesList && websiteContent.servicesList.length > 0)
    ? websiteContent.servicesList
    : defaultServices;
  const filteredServices = rawServices.filter((s) => s.published !== false);
  const activeServices = filteredServices.length > 0 ? filteredServices : defaultServices;

  // Dynamic impact stories from CMS with guaranteed fallback
  const defaultStories = INITIAL_WEBSITE_CONTENT.impactStoriesList || [];
  const rawStories = (websiteContent?.impactStoriesList && websiteContent.impactStoriesList.length > 0)
    ? websiteContent.impactStoriesList
    : defaultStories;
  const filteredStories = rawStories.filter((s) => s.published !== false);
  const activeStories = filteredStories.length > 0 ? filteredStories : defaultStories;

  // Dynamic campaigns from CMS with guaranteed fallback
  const defaultCampaigns = INITIAL_WEBSITE_CONTENT.donationCampaignsList || [];
  const rawCampaigns = (websiteContent?.donationCampaignsList && websiteContent.donationCampaignsList.length > 0)
    ? websiteContent.donationCampaignsList
    : defaultCampaigns;
  const filteredCampaigns = rawCampaigns.filter((c) => c.published !== false);
  const activeCampaigns = filteredCampaigns.length > 0 ? filteredCampaigns : defaultCampaigns;

  // Care homes (published)
  const oldAgeHomes = careHomes.filter((h) => h.type === 'OLD_AGE' && h.status === 'PUBLISHED');
  const childCareHomes = careHomes.filter((h) => h.type === 'CHILD_CARE' && h.status === 'PUBLISHED');

  // Unified foundation activities list
  const unifiedActivities: any[] = [];
  camps.forEach((camp) => {
    unifiedActivities.push({
      id: camp.id,
      title: camp.title,
      category:
        camp.campType === 'BLOOD_DONATION'
          ? 'Blood Donation Camps'
          : camp.campType === 'FOOD_RELIEF'
          ? 'Food Distribution'
          : 'Free Medical Camps',
      description: camp.description,
      date: camp.date,
      location: `${camp.venue}, ${camp.city}`,
      organizer: camp.organizerName,
      beneficiaries: camp.targetBeneficiaries,
      imageUrl:
        camp.bannerImage ||
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    });
  });
  ngoActivities
    .filter((a) => a.status === 'APPROVED' || a.status === 'COMPLETED')
    .forEach((act) => {
      unifiedActivities.push({
        id: act.id,
        title: act.title,
        category: act.category.includes('Food') ? 'Food Distribution' : 'NGO Activities',
        description: act.description,
        date: act.startDate,
        location: act.location,
        organizer: act.ngoName,
        beneficiaries: act.targetBeneficiaries,
        imageUrl:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      });
    });

  const filteredUnifiedActivities =
    activityCategoryFilter === 'All'
      ? unifiedActivities.slice(0, 6)
      : unifiedActivities.filter((a) => a.category.toLowerCase().includes(activityCategoryFilter.toLowerCase())).slice(0, 6);

  const statsConfig = websiteContent.statsConfig;

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col font-sans selection:bg-brand-secondary/30 selection:text-brand-primaryDark">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Dynamic from CMS, Full-Width Viewport-Calibrated)         */}
      {/* ========================================================================= */}
      {websiteContent.heroVisible !== false && (
        <section className="relative w-full min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-7.5rem)] flex items-center justify-center bg-[#240C38] overflow-hidden">
          {/* Photographic Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={
                websiteContent.heroBgImage ||
                'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=85&w=2000'
              }
              alt="Bharathi Foundation - Mother's Love and Community Care"
              fill
              priority
              className="object-cover object-center scale-105"
            />
            {/* Deep Purple Rich Radial & Linear Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E082E]/95 via-[#371555]/85 to-[#51247A]/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0629] via-transparent to-black/30" />
          </div>

          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Hero Content Container */}
          <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-10 xl:py-14 flex flex-col justify-center">
            <div className="max-w-4xl space-y-4 sm:space-y-5 lg:space-y-6 text-center sm:text-left">
              {/* Mission Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-purple-300/30 text-purple-200 text-xs sm:text-xs font-bold uppercase tracking-widest shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                <span>BHARATHI FOUNDATION • WE LOVE TO SERVE</span>
              </div>

              {/* Main Hero Display Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold font-serif text-white tracking-tight leading-[1.14]">
                {websiteContent.heroHeading || "One Mother's Dream, Countless Lives Touched."}
              </h1>

              {/* Emotion-driven Description */}
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-purple-100/90 leading-relaxed font-normal max-w-3xl">
                {websiteContent.heroSubheading ||
                  "Inspired by a mother's endless love, Bharathi Foundation is dedicated to spreading kindness, serving those in need and making the world a more compassionate place, one life at a time."}
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link
                  href={websiteContent.heroCta1Link || '/register?role=volunteer'}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-secondary to-[#C4B5FD] hover:from-white hover:to-purple-100 text-brand-primaryDark px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-black shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primaryDark" />
                  <span>{websiteContent.heroCta1Text || 'Join as Volunteer'}</span>
                </Link>

                <a
                  href={websiteContent.heroCta2Link || '#donation-campaigns'}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 hover:border-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold backdrop-blur-md transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 fill-red-400 animate-pulse" />
                  <span>{websiteContent.heroCta2Text || 'Donate Now'}</span>
                </a>

                <Link
                  href="/blood-donation"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-[#7C3AED] hover:from-red-500 hover:to-purple-600 text-white border border-red-400/50 hover:border-red-300 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 group whitespace-nowrap"
                >
                  <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-red-200 fill-red-200 group-hover:scale-110 transition-transform animate-pulse" />
                  <span>Raise Emergency Blood Request</span>
                </Link>
              </div>

              {/* Trust Accreditations Strip */}
              <div className="pt-4 sm:pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-left">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-200">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm">80G Tax Exempt Public Trust</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-200">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-secondary shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm">100% Direct Grassroots Giving</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-200">
                  <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm">24x7 Emergency Blood Network</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-200">
                  <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm">Daily Warm Meal Drives</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. DYNAMIC IMPACT STATISTICS (6 Required Dynamic Stats + Reach Metric)    */}
      {/* ========================================================================= */}
      <section className="relative z-20 -mt-8 sm:-mt-10 lg:-mt-12 max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 w-full" suppressHydrationWarning>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
          {/* Stat 1: Lives Impacted */}
          <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-muted">
                {statsConfig?.livesImpacted?.label || 'Lives Impacted'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>
            <p className="text-3xl font-black text-brand-primaryDark tracking-tight">
              {isMounted ? computedStats.formatStatValue(computedStats.livesImpacted, statsConfig?.livesImpacted?.format) : '—'}
            </p>
            <p className="text-[11px] text-brand-muted mt-1.5 font-medium line-clamp-2">
              Verified beneficiaries from medical & food camps
            </p>
          </div>

          {/* Stat 2: Active Volunteers */}
          <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-muted">
                {statsConfig?.activeVolunteers?.label || 'Active Volunteers'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-violet-100 text-brand-secondaryDark flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-brand-secondaryDark tracking-tight">
              {isMounted ? computedStats.formatStatValue(computedStats.activeVolunteers, statsConfig?.activeVolunteers?.format) : '—'}
            </p>
            <p className="text-[11px] text-brand-muted mt-1.5 font-medium line-clamp-2">
              Approved active volunteers on the ground
            </p>
          </div>

          {/* Stat 3: Medical & Blood Camps */}
          <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-muted">
                {statsConfig?.campsCount?.label || 'Camps Conducted'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tent className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-brand-primary tracking-tight">
              {isMounted ? computedStats.formatStatValue(computedStats.campsCount, statsConfig?.campsCount?.format) : '—'}
            </p>
            <p className="text-[11px] text-brand-muted mt-1.5 font-medium line-clamp-2">
              Certified health outreach & blood camps
            </p>
          </div>

          {/* Stat 4: Direct Welfare Raised */}
          <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-muted">
                {statsConfig?.welfareRaised?.label || 'Welfare Raised'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-600 tracking-tight">
              {isMounted
                ? computedStats.welfareRaised >= 10000000
                  ? `₹${(computedStats.welfareRaised / 10000000).toFixed(1)} Cr+`
                  : computedStats.welfareRaised >= 100000
                  ? `₹${(computedStats.welfareRaised / 100000).toFixed(1)} L+`
                  : `₹${computedStats.welfareRaised.toLocaleString('en-IN')}`
                : '—'}
            </p>
            <p className="text-[11px] text-brand-muted mt-1.5 font-medium line-clamp-2">
              100% verified transparent contributions
            </p>
          </div>

          {/* Stat 5: Registered Community Members */}
          <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-muted">
                {statsConfig?.communityMembers?.label || 'Community Members'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-600 tracking-tight">
              {isMounted ? computedStats.formatStatValue(computedStats.communityMembers, statsConfig?.communityMembers?.format) : '—'}
            </p>
            <p className="text-[11px] text-brand-muted mt-1.5 font-medium line-clamp-2">
              Unique registered stakeholders across portals
            </p>
          </div>

          {/* Stat 6: People Connected (Community Reach Metric) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-white border-2 border-brand-secondary/40 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-secondaryDark">
                {statsConfig?.connectedReach?.label || 'People Connected to Bharathi Foundation'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-brand-primaryDark tracking-tight">
              {isMounted ? computedStats.formatStatValue(computedStats.connectedReach, statsConfig?.connectedReach?.format) : '—'}
            </p>
            <p className="text-[11px] text-brand-muted mt-1.5 font-medium line-clamp-2">
              Verified unique individuals across volunteers, NGOs & donors
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT FOUNDATION & MISSION/VISION                                      */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-white" id="about">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest bg-brand-bgLight px-4 py-1.5 rounded-full border border-brand-border">
              About The Foundation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
              {websiteContent.aboutHeading || 'Rooted in Compassion, Driven by Service'}
            </h2>
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed font-normal">
              {websiteContent.aboutText ||
                'Bharathi Foundation is a registered public charitable trust founded upon the sacred belief that no one in our society should be left without food, medicine, or care.'}
            </p>
          </div>

          {/* Mission & Vision Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Mission Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-bgLight via-[#FAF7FD] to-white border-2 border-brand-border shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold mb-6 shadow-md group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-brand-primaryDark mb-4">
                {t.missionTitle || 'Our Mission'}
              </h3>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed font-normal">
                {websiteContent.missionText ||
                  "To share a mother's love and rely on the strength of friendship by providing food, medical help, and blood donations, working together to support each other."}
              </p>
            </div>

            {/* Vision Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-bgLight via-[#FAF7FD] to-white border-2 border-brand-border shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-bold mb-6 shadow-md group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-brand-primaryDark mb-4">
                {t.visionTitle || 'Our Vision'}
              </h3>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed font-normal">
                {websiteContent.visionText ||
                  "To build a community where everyone feels the warmth of a mother's love and the power of friendship, making sure no one is left alone or in need."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEDICATED CARE HOME SERVICE SECTION: OLD AGE HOME CARE                 */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-brand-bgLight/40 to-white border-t border-brand-border/60" id="old-age-care">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border inline-block shadow-2xs">
                Compassionate Senior Care
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
                Old Age Home Haven: Protecting Senior Dignity
              </h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                In a fast-changing world, solitary and vulnerable elders find a true family at Bharathi Foundation’s Old Age Homes. We provide 24/7 geriatric nurse monitoring, daily physiotherapy, Satvik nutrition, recreational gardens, and devotional gatherings—ensuring our revered elders spend their golden years wrapped in maternal love and respect.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-brand-border">
                  <Stethoscope className="w-5 h-5 text-brand-primary mb-1" />
                  <strong className="text-xs text-brand-primaryDark block">Geriatric Healthcare</strong>
                  <span className="text-[11px] text-brand-muted">Visiting MDs, ECG, vitals tracking & palliative beds</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-brand-border">
                  <Heart className="w-5 h-5 text-rose-500 mb-1" />
                  <strong className="text-xs text-brand-primaryDark block">Spiritual & Mental Well-being</strong>
                  <span className="text-[11px] text-brand-muted">Bhajan sessions, library, memory games & celebrations</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/care-homes"
                  className="px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Explore Senior Havens</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/care-homes#care-donate"
                  className="px-6 py-3.5 bg-white hover:bg-brand-bgLight text-brand-primary font-bold text-xs rounded-xl border border-brand-border transition-all"
                >
                  Sponsor an Elder’s Living
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-purple-100">
                <Image
                  src="https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1200"
                  alt="Old Age Home Haven"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="text-[11px] font-bold text-purple-200 uppercase">Operating Center</span>
                  <h3 className="text-lg font-black">Bharathi Mathru Devo Bhava Elder Haven, Bengaluru</h3>
                  <p className="text-xs text-purple-100">48 Resident Seniors • Full Medical Assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DEDICATED CARE HOME SERVICE SECTION: CHILD CARE HOMES                  */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-t border-brand-border/60" id="child-care">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-purple-100">
                <Image
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200"
                  alt="Child Care Sanctuary"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="text-[11px] font-bold text-purple-200 uppercase">Child Empowerment & Learning</span>
                  <h3 className="text-lg font-black">Bharathi Bala Jyothi Child Care Home, Ramanagara</h3>
                  <p className="text-xs text-purple-100">62 Resident Children • Smart Computing & Formal Education</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                  Nurturing Next Generation
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  Child Privacy & Dignity Guaranteed
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
                Child Care Homes: Education, Safety & Boundless Futures
              </h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Every child deserves to grow up feeling valued, safe, and encouraged. Bharathi Foundation’s Child Care Homes shelter orphaned, abandoned, and destitute children, guiding them through formal English-medium schooling, nutritious diet plans, computer labs, extracurricular sports, and certified trauma counselling.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-brand-bgLight rounded-2xl border border-brand-border">
                  <Smile className="w-5 h-5 text-brand-secondary mb-1" />
                  <strong className="text-xs text-brand-primaryDark block">Formal Schooling & STEM</strong>
                  <span className="text-[11px] text-brand-muted">Digital lab, bilingual library, sports & mentorship</span>
                </div>
                <div className="p-3.5 bg-brand-bgLight rounded-2xl border border-brand-border">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                  <strong className="text-xs text-brand-primaryDark block">Nutritious Diet & Healthcare</strong>
                  <span className="text-[11px] text-brand-muted">Pediatric checkups, hygiene kits & vaccinated records</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/care-homes"
                  className="px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Explore Child Care Homes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/care-homes#care-donate"
                  className="px-6 py-3.5 bg-white hover:bg-brand-bgLight text-brand-primary font-bold text-xs rounded-xl border border-brand-border transition-all"
                >
                  Sponsor an Education Kit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOUNDATION ACTIVITIES SECTION (11 Categories, Dynamic Cards)           */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-brand-bgLight/50 border-t border-brand-border/70" id="activities">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-brand-border inline-block">
                On The Ground
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
                Public Foundation Activities & Programs
              </h2>
              <p className="text-base text-brand-muted max-w-2xl">
                Every verified relief drive, diagnostic medical camp, food distribution mission, and partner NGO program.
              </p>
            </div>
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <span>View All Activities ({unifiedActivities.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ACTIVITY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActivityCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activityCategoryFilter === cat
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-white text-brand-muted hover:text-brand-text border border-brand-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Activities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUnifiedActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-purple-100">
                    <Image
                      src={act.imageUrl}
                      alt={act.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/95 text-brand-primary text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {act.category}
                    </span>
                    <span className="absolute bottom-3 left-4 text-white text-xs font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-300" />
                      <span>{act.location}</span>
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-brand-muted">
                      <span>📅 {act.date}</span>
                      <span className="font-semibold text-brand-primaryDark">{act.organizer}</span>
                    </div>

                    <h3 className="text-base font-bold text-brand-primaryDark group-hover:text-brand-primary transition-colors line-clamp-2">
                      {act.title}
                    </h3>

                    <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-brand-border/60">
                      <span className="text-brand-muted">Verified Beneficiaries:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {act.beneficiaries ? `${act.beneficiaries.toLocaleString('en-IN')}+` : 'Community Wide'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveActivityModal(act)}
                    className="w-full py-2.5 bg-brand-bgLight hover:bg-brand-primary hover:text-white text-brand-primary font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. OUR CORE SERVICES (Dynamic CMS Managed)                                */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-white" id="services">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest bg-brand-bgLight px-4 py-1.5 rounded-full border border-brand-border">
              Pillars of Impact
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
              {t.coreServicesTitle || 'Our Core Services'}
            </h2>
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
              Providing holistic community assistance through continuous grassroots programs, partnerships, and voluntary networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl overflow-hidden border border-brand-border shadow-xs hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-purple-100">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {service.category}
                    </div>
                  </div>
                  <div className="p-7 space-y-3">
                    <h3 className="text-xl font-bold text-brand-primaryDark">{service.title}</h3>
                    <p className="text-sm text-brand-muted leading-relaxed">{service.description}</p>
                  </div>
                </div>
                <div className="px-7 pb-7 pt-2">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primaryDark"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MOMENTS OF SERVICE & GROUND GALLERY (Dynamic CMS Managed with Lightbox) */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-brand-bgLight/60 border-t border-brand-border/70" id="gallery">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-brand-border inline-block">
                Visual Proof of Change
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
                {t.galleryTitle || 'Moments of Service'}
              </h2>
              <p className="text-base sm:text-lg text-brand-muted max-w-2xl">
                Real, unedited ground moments from our medical outreach, blood donation camps, elder care shelters, and community food drives.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primaryDark bg-white px-6 py-3 rounded-full border border-brand-border shadow-xs hover:shadow-md transition-all"
            >
              <span>Explore Full Photo Archives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Tabs for Moments of Service */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Moments', value: 'ALL' },
              { label: 'Blood Donation Drives', value: 'BLOOD_CAMP' },
              { label: 'Medical Diagnostics', value: 'MEDICAL_OUTREACH' },
              { label: 'Annadanam & Community', value: 'COMMUNITY' },
              { label: 'Child Welfare & Education', value: 'CHILD_WELFARE' },
              { label: 'Disaster Relief', value: 'DISASTER_RELIEF' },
            ].map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setGalleryFilter(cat.value)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  galleryFilter === cat.value
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-white text-brand-text border border-brand-border hover:bg-purple-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Moments of Service Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setActivePhoto({
                    title: item.title,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    location: item.location,
                    date: item.date,
                    category: item.category,
                  })
                }
                className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-brand-border bg-purple-950"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/95 text-brand-primary px-3 py-1 rounded-full shadow-md">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="absolute bottom-5 inset-x-5 text-white space-y-1">
                  <h4 className="font-bold text-base line-clamp-2 leading-snug drop-shadow-sm">{item.title}</h4>
                  <p className="text-xs text-purple-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                    <span>{item.location}</span>
                    <span className="text-purple-400">•</span>
                    <span>{item.date}</span>
                  </p>
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-brand-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Stories of Compassion (Documented Transformations) */}
          {activeStories.length > 0 && (
            <div className="pt-8 border-t border-brand-border/70 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Documented Transformations</span>
                  <h3 className="text-xl sm:text-2xl font-black text-brand-primaryDark font-serif">Stories of Compassion</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() =>
                      setActivePhoto({
                        title: story.title,
                        description: story.description,
                        imageUrl: story.images[0],
                        location: story.location,
                        date: story.date,
                        category: story.category,
                      })
                    }
                    className="group relative rounded-3xl overflow-hidden bg-purple-900 border border-brand-border shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-72"
                  >
                    <Image
                      src={story.images[0] || 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=800'}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      {story.category}
                    </span>
                    <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                      <h4 className="text-sm font-bold line-clamp-2 leading-snug">{story.title}</h4>
                      <p className="text-[11px] text-purple-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-300" />
                        <span>{story.location}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FEATURED DONATION CAMPAIGNS (Dynamic CMS, UPI QR & UTR Verification)    */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-white" id="donation-campaigns">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest bg-brand-bgLight px-4 py-1.5 rounded-full border border-brand-border">
              {t.campaignsTitle || 'Targeted Welfare Drives'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
              Support an Urgent Foundation Cause
            </h2>
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
              100% of public contributions directly fund meals, medical kits, elder care, and emergency blood supplies.
            </p>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-3xl border border-brand-border shadow-xs hover:shadow-xl transition-all p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-purple-100">
                    <Image src={camp.imageUrl} alt={camp.title} fill className="object-cover" />
                    <span className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      {camp.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-brand-primaryDark line-clamp-1">{camp.title}</h4>
                  <p className="text-xs text-brand-muted line-clamp-2">{camp.description}</p>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-emerald-700">₹{camp.raisedAmount.toLocaleString('en-IN')} Raised</span>
                      <span className="text-brand-muted">Target: ₹{camp.targetAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-brand-primary h-2 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCampaign(camp.title);
                    const el = document.getElementById('upi-claim-box');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-purple-50 hover:bg-brand-primary hover:text-white text-brand-primary text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Donate for {camp.category}
                </button>
              </div>
            ))}
          </div>

          {/* Interactive UPI QR Code & Instant Claim Submission */}
          <div
            id="upi-claim-box"
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#2E0854] to-[#17042B] text-white shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 text-center space-y-4">
                <span className="text-xs uppercase font-extrabold tracking-widest text-brand-secondary bg-white/10 px-3.5 py-1.5 rounded-full">
                  Instant UPI Donation
                </span>

                {(() => {
                  const effectiveQr = dbQrSettings !== null ? dbQrSettings : websiteContent.qrSettings;
                  const isQrPublished = Boolean(
                    effectiveQr &&
                      effectiveQr.isPublished !== false &&
                      effectiveQr.upiId?.trim() &&
                      effectiveQr.qrCodeUrl?.trim()
                  );

                  if (!isQrPublished) {
                    return (
                      <div className="p-6 bg-white/10 border border-amber-400/40 rounded-2xl text-center space-y-2">
                        <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">UPI Offline</p>
                        <p className="text-xs text-purple-200">
                          Direct online UPI donations are currently paused for scheduled reconciliation. Please check back shortly.
                        </p>
                      </div>
                    );
                  }

                  const activeQrUrl = effectiveQr?.qrCodeUrl || '';
                  const activeUpi = effectiveQr?.upiId || '';
                  const activeHolder = effectiveQr?.accountHolderName || '';
                  const activeInstructions = effectiveQr?.paymentInstructions || '';

                  return (
                    <>
                      <div className="bg-white p-4 rounded-2xl w-52 h-52 mx-auto shadow-2xl flex flex-col items-center justify-center relative">
                        <Image
                          src={activeQrUrl}
                          alt="Bharathi Foundation UPI QR"
                          width={160}
                          height={160}
                          className="object-contain"
                        />
                        <span className="text-[10px] text-brand-primary font-bold mt-2">Scan & Pay via Any UPI App</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <code className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                          {activeUpi}
                        </code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeUpi);
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2500);
                          }}
                          className="p-1.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-brand-primary transition-colors cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      {activeHolder && (
                        <p className="text-[11px] text-purple-200">
                          A/C: <span className="font-semibold text-white">{activeHolder}</span>
                        </p>
                      )}
                      {activeInstructions && (
                        <p className="text-[10px] text-purple-200/80 italic line-clamp-2">{activeInstructions}</p>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* UTR Claim Submission Form */}
              <div className="lg:col-span-8 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">Submit UTR Reference for 80G Tax Receipt</h3>
                  <p className="text-xs sm:text-sm text-purple-200 mt-1">
                    After scanning and paying via Google Pay, PhonePe, or Paytm, enter your UTR / Transaction reference number below.
                  </p>
                </div>

                {donationSuccessMsg && (
                  <div className="p-4 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs rounded-xl flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{donationSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-purple-200 mb-1">
                        Purpose of Donation <span className="text-red-400 font-bold">*</span>
                      </label>
                      <select
                        value={donationPurpose}
                        onChange={(e) => setDonationPurpose(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/80 border border-white/30 text-white text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                      >
                        <option value="Food Donation" className="bg-[#2E0854] text-white">Food Donation</option>
                        <option value="Old Age Home Support" className="bg-[#2E0854] text-white">Old Age Home Support</option>
                        <option value="Child Care Home Support" className="bg-[#2E0854] text-white">Child Care Home Support</option>
                        <option value="Blood Donation Camps" className="bg-[#2E0854] text-white">Blood Donation Camps</option>
                        <option value="Medical Camps & Healthcare" className="bg-[#2E0854] text-white">Medical Camps & Healthcare</option>
                        <option value="Education Support" className="bg-[#2E0854] text-white">Education Support</option>
                        <option value="Emergency Relief" className="bg-[#2E0854] text-white">Emergency Relief</option>
                        <option value="General Foundation Support" className="bg-[#2E0854] text-white">General Foundation Support</option>
                        <option value="Other" className="bg-[#2E0854] text-white">Other</option>
                      </select>
                    </div>

                    {donationPurpose === 'Other' && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-purple-200 mb-1">
                          Please Specify Your Donation Purpose <span className="text-red-400 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={otherDonationPurpose}
                          onChange={(e) => setOtherDonationPurpose(e.target.value)}
                          placeholder="Enter the reason for your donation"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300 text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">Donor Full Name</label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Rajesh Varma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300 text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">Email Address (for Receipt)</label>
                      <input
                        type="email"
                        required
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="rajesh@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300 text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300 text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">PAN Card (Optional for 80G)</label>
                      <input
                        type="text"
                        value={donorPan}
                        onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300 text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">Amount Transferred (₹)</label>
                      <input
                        type="number"
                        required
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="1000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300 text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1">12-Digit UTR / Transaction ID</label>
                      <input
                        type="text"
                        required
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 432109876543"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-purple-300 text-xs focus:ring-2 focus:ring-brand-secondary outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit UTR Reference & Request 80G Receipt</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. VOLUNTEER RECRUITMENT BANNER                                          */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-secondary bg-white/10 px-4 py-1.5 rounded-full inline-block">
            Volunteer Cadre Call
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight max-w-3xl mx-auto">
            &ldquo;Be the Reason Someone Smiles Today.&rdquo;
          </h2>
          <p className="text-base sm:text-lg text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Join our dedicated network of on-ground changemakers. Receive an official foundation ID card, certified social service hours, and the satisfaction of serving humanity directly.
          </p>
          <div className="pt-2">
            <Link
              href="/register?role=volunteer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary hover:bg-purple-50 font-bold text-sm rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <span>Join as Registered Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. COMMUNITY TESTIMONIALS                                                */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest bg-brand-bgLight px-4 py-1.5 rounded-full border border-brand-border">
              Voices of Trust
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif tracking-tight">
              What Our Community Says
            </h2>
            <p className="text-base text-brand-muted">
              Honest testimonials from beneficiaries, medical partners, and regular volunteers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-brand-bgLight/60 border border-brand-border space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-brand-muted italic leading-relaxed">
                &ldquo;When my father was in critical surgery at Victoria Hospital, the Bharathi emergency blood helpline mobilized two O-negative donors in under 45 minutes. A true blessing.&rdquo;
              </p>
              <div>
                <strong className="text-sm text-brand-primaryDark block">Suresh Kumar</strong>
                <span className="text-xs text-brand-muted">Family Member, Bengaluru</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-brand-bgLight/60 border border-brand-border space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-brand-muted italic leading-relaxed">
                &ldquo;Volunteering at the rural diagnostic camps and elder haven has given my life true meaning. The level of transparency, dignity, and maternal care here is unmatched anywhere.&rdquo;
              </p>
              <div>
                <strong className="text-sm text-brand-primaryDark block">Ananya Sharma</strong>
                <span className="text-xs text-brand-muted">Registered Ground Volunteer</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-brand-bgLight/60 border border-brand-border space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-brand-muted italic leading-relaxed">
                &ldquo;As a partner NGO, our collaboration with Bharathi Foundation has allowed us to deliver nutritious hot meals to 500+ daily wage earners every single weekend without fail.&rdquo;
              </p>
              <div>
                <strong className="text-sm text-brand-primaryDark block">Dr. R. K. Hegde</strong>
                <span className="text-xs text-brand-muted">Trustee, Karuna Seva Society</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FINAL CALL TO ACTION BANNER                                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#1E082E] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
            &ldquo;Together, We Can Make a Difference.&rdquo;
          </h2>
          <p className="text-base text-purple-200 max-w-xl mx-auto leading-relaxed">
            Whether you choose to give your time, your blood, or your financial support, every act of kindness sends ripples across humanity.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-brand-secondary hover:bg-white hover:text-brand-primaryDark text-brand-primaryDark font-bold text-sm rounded-full transition-all"
            >
              Get Involved Today
            </Link>
            <Link
              href="/donate"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm rounded-full transition-all"
            >
              Donate via UPI QR
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Photo Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase">{activePhoto.category}</span>
                <h3 className="text-base font-bold text-brand-primaryDark">{activePhoto.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="text-brand-muted hover:text-brand-text p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-purple-100">
              <Image src={activePhoto.imageUrl} alt={activePhoto.title} fill className="object-cover" />
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">{activePhoto.description}</p>
            <div className="flex items-center justify-between text-[11px] text-brand-muted pt-2 border-t">
              <span>📍 {activePhoto.location || 'Karnataka'}</span>
              <span>📅 {activePhoto.date || '2026'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {activeActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase">{activeActivityModal.category}</span>
                <h3 className="text-base sm:text-lg font-bold text-brand-primaryDark">{activeActivityModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveActivityModal(null)}
                className="text-brand-muted hover:text-brand-text p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-purple-100">
              <Image src={activeActivityModal.imageUrl} alt={activeActivityModal.title} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-brand-bgLight rounded-xl text-xs">
              <div>
                <span className="text-brand-muted block text-[10px]">Date:</span>
                <strong>{activeActivityModal.date}</strong>
              </div>
              <div>
                <span className="text-brand-muted block text-[10px]">Location:</span>
                <strong>{activeActivityModal.location}</strong>
              </div>
              <div>
                <span className="text-brand-muted block text-[10px]">Organized By:</span>
                <strong>{activeActivityModal.organizer}</strong>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{activeActivityModal.description}</p>
            <div className="flex justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setActiveActivityModal(null)}
                className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
