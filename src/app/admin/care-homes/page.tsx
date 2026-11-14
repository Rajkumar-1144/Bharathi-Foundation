'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { CareHome, CareHomeEvent, CareHomeSupportCampaign } from '@/types';
import {
  HeartHandshake,
  Building2,
  Users,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Stethoscope,
  Smile,
  Shield,
  Layers,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Star,
  Upload,
} from 'lucide-react';

export default function AdminCareHomesPage() {
  const {
    careHomes,
    careHomeEvents,
    careHomeCampaigns,
    addCareHome,
    updateCareHome,
    deleteCareHome,
    addCareHomeEvent,
    deleteCareHomeEvent,
    addCareHomeCampaign,
    updateCareHomeCampaign,
  } = useAppData();

  const [activeSubTab, setActiveSubTab] = useState<
    'OLD_AGE' | 'CHILD_CARE' | 'ACTIVITIES' | 'GALLERY' | 'EVENTS' | 'VOLUNTEERS' | 'MEDICAL' | 'CAMPAIGNS'
  >('OLD_AGE');

  const [notification, setNotification] = useState<string | null>(null);
  const [newHomeModal, setNewHomeModal] = useState(false);
  const [newEventModal, setNewEventModal] = useState(false);
  const [newCampaignModal, setNewCampaignModal] = useState(false);
  const [newImageModal, setNewImageModal] = useState(false);
  const [selectedHomeForImage, setSelectedHomeForImage] = useState(careHomes[0]?.id || '');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFeaturedChoice, setIsFeaturedChoice] = useState(false);
  const [galleryFilterType, setGalleryFilterType] = useState<'ALL' | 'OLD_AGE' | 'CHILD_CARE'>('ALL');

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    const targetHome = careHomes.find((h) => h.id === selectedHomeForImage) || careHomes[0];
    if (!targetHome) return;

    const updatedImages = [...(targetHome.images || []), newImageUrl.trim()];
    const updatePayload: Partial<CareHome> = { images: updatedImages };
    if (isFeaturedChoice) {
      updatePayload.featuredImage = newImageUrl.trim();
    }
    updateCareHome(targetHome.id, updatePayload);
    setNewImageModal(false);
    setNewImageUrl('');
    setIsFeaturedChoice(false);
    triggerNotification(`Added new photograph to ${targetHome.name}`);
  };

  const handleDeleteImage = (homeId: string, imgUrl: string) => {
    const targetHome = careHomes.find((h) => h.id === homeId);
    if (!targetHome) return;
    const updatedImages = targetHome.images.filter((img) => img !== imgUrl);
    updateCareHome(targetHome.id, {
      images: updatedImages,
      featuredImage: targetHome.featuredImage === imgUrl ? (updatedImages[0] || '') : targetHome.featuredImage,
    });
    triggerNotification(`Removed photograph from facility archives.`);
  };

  const handleSetFeatured = (homeId: string, imgUrl: string) => {
    updateCareHome(homeId, { featuredImage: imgUrl });
    triggerNotification(`Set photo as primary featured display image.`);
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const oldAgeHomes = careHomes.filter((h) => h.type === 'OLD_AGE');
  const childCareHomes = careHomes.filter((h) => h.type === 'CHILD_CARE');

  const handleCreateHome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newHome: Omit<CareHome, 'id'> = {
      type: activeSubTab === 'CHILD_CARE' ? 'CHILD_CARE' : 'OLD_AGE',
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      city: formData.get('city') as string,
      establishedYear: formData.get('establishedYear') as string,
      inmatesCount: parseInt(formData.get('inmatesCount') as string, 10) || 30,
      capacity: parseInt(formData.get('capacity') as string, 10) || 50,
      description: formData.get('description') as string,
      facilities: (formData.get('facilities') as string).split(',').map((s) => s.trim()),
      medicalSupport: formData.get('medicalSupport') as string,
      images: [
        (formData.get('imageUrl') as string) ||
          'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80',
      ],
      featuredImage:
        (formData.get('imageUrl') as string) ||
        'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80',
      status: 'PUBLISHED',
      careActivities: ['Daily Health Check', 'Nutrition Planning', 'Recreation', 'Spiritual Sessions'],
      urgentNeeds: ['Winter Clothing', 'Health Monitors', 'Bedding'],
      contactEmail: (formData.get('contactEmail') as string) || 'care@bharathifoundation.org',
      contactPhone: (formData.get('contactPhone') as string) || '+91 98765 43210',
    };
    addCareHome(newHome);
    setNewHomeModal(false);
    triggerNotification(`Successfully registered new care facility: ${newHome.name}`);
  };

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedHome = careHomes.find((h) => h.id === (formData.get('careHomeId') as string));
    const newEvt: Omit<CareHomeEvent, 'id'> = {
      careHomeId: (formData.get('careHomeId') as string) || careHomes[0]?.id || 'ch-1',
      careHomeName: selectedHome?.name || 'Bharathi Care Haven',
      title: formData.get('title') as string,
      type: formData.get('type') as any,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      description: formData.get('description') as string,
      images: ['https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80'],
      status: 'UPCOMING',
      volunteersNeeded: parseInt(formData.get('volunteersNeeded') as string, 10) || 10,
      registeredVolunteers: 0,
    };
    addCareHomeEvent(newEvt);
    setNewEventModal(false);
    triggerNotification(`Care Home Event "${newEvt.title}" created successfully!`);
  };

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCmp: Omit<CareHomeSupportCampaign, 'id'> = {
      careHomeId: (formData.get('careHomeId') as string) || careHomes[0]?.id || 'ch-1',
      title: formData.get('title') as string,
      targetAmount: parseInt(formData.get('targetAmount') as string, 10) || 50000,
      raisedAmount: 0,
      itemNeeded: formData.get('itemNeeded') as string,
      status: 'ACTIVE',
    };
    addCareHomeCampaign(newCmp);
    setNewCampaignModal(false);
    triggerNotification(`Care Home Support Campaign launched!`);
  };

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Care Home Management Portal"
      subtitle="Supervise Old Age Home Haven and Child Care Sanctuaries, facilities, medical audits, events, and support campaigns"
    >
      {/* Toast Notification */}
      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-3xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>Old Age Homes</span>
            <Building2 className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="mt-2 text-2xl font-black text-brand-primaryDark">{oldAgeHomes.length}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            {oldAgeHomes.reduce((a, b) => a + b.inmatesCount, 0)} Elderly Residents
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>Child Care Homes</span>
            <Smile className="w-4 h-4 text-brand-secondary" />
          </div>
          <div className="mt-2 text-2xl font-black text-brand-primaryDark">{childCareHomes.length}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            {childCareHomes.reduce((a, b) => a + b.inmatesCount, 0)} Resident Children
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>Upcoming Events</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-brand-primaryDark">{careHomeEvents.length}</div>
          <span className="text-[10px] text-brand-muted mt-1 block">Celebrations & Clinics</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>Support Drives</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-brand-primaryDark">{careHomeCampaigns.length}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Active Supply Grants</span>
        </div>
      </div>

      {/* Submodule Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-brand-border/60 scrollbar-none">
        {[
          { key: 'OLD_AGE', label: '1. Old Age Homes', icon: Building2 },
          { key: 'CHILD_CARE', label: '2. Child Care Homes', icon: Smile },
          { key: 'ACTIVITIES', label: '3. Daily Activities', icon: Layers },
          { key: 'GALLERY', label: '4. Photo Gallery', icon: Sparkles },
          { key: 'EVENTS', label: '5. Events & Celebrations', icon: Calendar },
          { key: 'VOLUNTEERS', label: '6. Volunteer Visits', icon: Users },
          { key: 'MEDICAL', label: '7. Medical Camps', icon: Stethoscope },
          { key: 'CAMPAIGNS', label: '8. Support Campaigns', icon: HeartHandshake },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.key;
          return (
            <button
              key={sub.key}
              type="button"
              onClick={() => setActiveSubTab(sub.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-bgLight'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1 & 2: OLD AGE HOMES / CHILD CARE HOMES */}
      {(activeSubTab === 'OLD_AGE' || activeSubTab === 'CHILD_CARE') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">
                {activeSubTab === 'OLD_AGE' ? 'Old Age Homes Directory' : 'Child Care Homes Directory'}
              </h3>
              <p className="text-xs text-brand-muted">
                {activeSubTab === 'OLD_AGE'
                  ? 'Senior resident care facilities providing geriatric medical aid, shelter, and companionship.'
                  : 'Shelters and nurturing homes for orphaned, abandoned, and underprivileged children (Privacy Protected).'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewHomeModal(true)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register New {activeSubTab === 'OLD_AGE' ? 'Old Age Home' : 'Child Care Home'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeSubTab === 'OLD_AGE' ? oldAgeHomes : childCareHomes).map((home) => (
              <div key={home.id} className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs space-y-4">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-purple-100">
                  <Image src={home.featuredImage} alt={home.name} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    Est. {home.establishedYear}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 text-brand-primaryDark text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {home.inmatesCount} / {home.capacity} Residents
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-brand-primaryDark">{home.name}</h4>
                  <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    <span>
                      {home.location}, {home.city}
                    </span>
                  </p>
                  <p className="text-xs text-brand-muted line-clamp-3 mt-2">{home.description}</p>
                </div>

                {/* Facilities & Services */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-brand-primary uppercase">Key Facilities & Care:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {home.facilities.map((fac, idx) => (
                      <span key={idx} className="bg-brand-bgLight text-brand-text text-[10px] px-2 py-0.5 rounded-md border border-brand-border">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Medical Support Info */}
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs">
                  <span className="font-bold text-brand-primary block text-[11px]">Medical Support:</span>
                  <span className="text-brand-muted">{home.medicalSupport}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-border/60">
                  <button
                    type="button"
                    onClick={() =>
                      updateCareHome(home.id, {
                        status: home.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
                      })
                    }
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                      home.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {home.status === 'PUBLISHED' ? 'Published on Website' : 'Hidden (Draft)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCareHome(home.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete facility"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: EVENTS & CELEBRATIONS */}
      {activeSubTab === 'EVENTS' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">Care Home Events & Celebrations</h3>
              <p className="text-xs text-brand-muted mt-0.5">Schedule festivals, recreational programs, and celebrations for elders and children.</p>
            </div>
            <button
              type="button"
              onClick={() => setNewEventModal(true)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>

          <div className="divide-y divide-brand-border/60">
            {careHomeEvents.map((evt) => (
              <div key={evt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-brand-primary font-bold text-[10px] px-2 py-0.5 rounded">
                      {evt.type}
                    </span>
                    <h4 className="text-sm font-bold text-brand-primaryDark">{evt.title}</h4>
                  </div>
                  <p className="text-xs text-brand-muted">{evt.careHomeName}</p>
                  <p className="text-xs text-brand-muted max-w-xl">{evt.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-brand-muted pt-1">
                    <span>
                      📅 {evt.date} ({evt.time})
                    </span>
                    <span>•</span>
                    <span>👥 Volunteers: {evt.registeredVolunteers} / {evt.volunteersNeeded}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => deleteCareHomeEvent(evt.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 8: SUPPORT CAMPAIGNS */}
      {activeSubTab === 'CAMPAIGNS' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">Care Home Dedicated Support Drives</h3>
              <p className="text-xs text-brand-muted mt-0.5">Raise funds for targeted material supplies (e.g. orthopedic beds, winter clothing, school kits).</p>
            </div>
            <button
              type="button"
              onClick={() => setNewCampaignModal(true)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Care Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careHomeCampaigns.map((cmp) => (
              <div key={cmp.id} className="p-5 rounded-2xl border border-brand-border bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-secondary uppercase">Grant Drive</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {cmp.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-brand-primaryDark">{cmp.title}</h4>
                <div className="text-[11px] text-brand-muted">
                  <strong className="text-brand-text">Target Items:</strong> {cmp.itemNeeded}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-brand-muted">
                    <span>Raised: ₹{cmp.raisedAmount.toLocaleString('en-IN')}</span>
                    <span>Target: ₹{cmp.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-bgLight overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full"
                      style={{ width: `${Math.min(100, Math.round((cmp.raisedAmount / cmp.targetAmount) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: DEDICATED CARE HOME IMAGE CMS */}
      {activeSubTab === 'GALLERY' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-border shadow-xs">
            <div>
              <h3 className="text-lg font-bold text-brand-primaryDark">Care Home High-Resolution Image Archives</h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Manage dignified, vibrant photography for Old Age Homes & Child Care Homes displayed on the homepage and care directory.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-brand-bgLight p-1 rounded-xl border border-brand-border text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setGalleryFilterType('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${galleryFilterType === 'ALL' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-muted hover:text-brand-text'}`}
                >
                  All ({careHomes.reduce((acc, h) => acc + (h.images?.length || 0), 0)})
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryFilterType('OLD_AGE')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${galleryFilterType === 'OLD_AGE' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-muted hover:text-brand-text'}`}
                >
                  Old Age ({oldAgeHomes.reduce((acc, h) => acc + (h.images?.length || 0), 0)})
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryFilterType('CHILD_CARE')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${galleryFilterType === 'CHILD_CARE' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-muted hover:text-brand-text'}`}
                >
                  Child Care ({childCareHomes.reduce((acc, h) => acc + (h.images?.length || 0), 0)})
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedHomeForImage(careHomes[0]?.id || '');
                  setNewImageUrl('');
                  setIsFeaturedChoice(false);
                  setNewImageModal(true);
                }}
                className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Photograph</span>
              </button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {careHomes
              .filter((home) => galleryFilterType === 'ALL' || home.type === galleryFilterType)
              .flatMap((home) =>
                (home.images || []).map((imgUrl, idx) => ({
                  home,
                  imgUrl,
                  isFeatured: home.featuredImage === imgUrl,
                  idx,
                }))
              )
              .map(({ home, imgUrl, isFeatured }, i) => (
                <div
                  key={`${home.id}-${i}`}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-border shadow-xs group flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt={home.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full text-white shadow-xs ${home.type === 'OLD_AGE' ? 'bg-purple-700' : 'bg-amber-600'}`}>
                        {home.type === 'OLD_AGE' ? 'Senior Haven' : 'Child Care'}
                      </span>
                      {isFeatured && (
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          <span>Primary Featured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <p className="font-bold text-xs text-brand-primaryDark truncate" title={home.name}>{home.name}</p>
                      <p className="text-[11px] text-brand-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-brand-primary" />
                        <span>{home.city}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-xs">
                      {!isFeatured ? (
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(home.id, imgUrl)}
                          className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          <span>Set Primary</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700">Display Hero</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteImage(home.id, imgUrl)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3, 6, 7: OVERVIEW CARDS */}
      {(activeSubTab === 'ACTIVITIES' || activeSubTab === 'VOLUNTEERS' || activeSubTab === 'MEDICAL') && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-base font-bold text-brand-primaryDark">
              Care Home {activeSubTab === 'ACTIVITIES' ? 'Activities & Recreation' : activeSubTab === 'VOLUNTEERS' ? 'Volunteer Visits' : 'Medical Checkup Records'}
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Coordinated care home operations, visitation logs, and verified impact entries.
            </p>
          </div>

          <div className="p-6 bg-brand-bgLight rounded-2xl border border-brand-border text-center space-y-2">
            <Sparkles className="w-8 h-8 text-brand-primary mx-auto" />
            <h4 className="text-sm font-bold text-brand-primaryDark">Care Operation Active & Synchronized</h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              All volunteer registrations, medical screening entries, and photo submissions for both Old Age Homes and Child Care Homes are live on the public website.
            </p>
          </div>
        </div>
      )}

      {/* NEW HOME MODAL */}
      {newHomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateHome}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-brand-primaryDark">
                Register New {activeSubTab === 'CHILD_CARE' ? 'Child Care Home' : 'Old Age Home'}
              </h3>
              <button type="button" onClick={() => setNewHomeModal(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Facility Name</label>
              <input name="name" required placeholder="e.g. Bharathi Sneha Sadan" className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">City</label>
                <input name="city" required placeholder="e.g. Bengaluru" className="w-full px-3 py-2 text-xs rounded-xl border" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">Est. Year</label>
                <input name="establishedYear" required placeholder="2023" className="w-full px-3 py-2 text-xs rounded-xl border" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">Inmates Count</label>
                <input name="inmatesCount" type="number" required placeholder="45" className="w-full px-3 py-2 text-xs rounded-xl border" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">Total Capacity</label>
                <input name="capacity" type="number" required placeholder="60" className="w-full px-3 py-2 text-xs rounded-xl border" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Location Address</label>
              <input name="location" required placeholder="Street / Block Address" className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Facilities (comma-separated)</label>
              <input name="facilities" required placeholder="24/7 Nursing, Physiotherapy, Satvik Meals, Garden" className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Medical Support Provisions</label>
              <textarea name="medicalSupport" rows={2} required placeholder="Doctors visiting, ambulance on call..." className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Description</label>
              <textarea name="description" rows={3} required placeholder="Facility mission and atmosphere..." className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Feature Photograph URL</label>
              <input name="imageUrl" type="url" placeholder="https://..." className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setNewHomeModal(false)} className="px-4 py-2 text-xs rounded-xl border">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl">Register Facility</button>
            </div>
          </form>
        </div>
      )}

      {/* NEW EVENT MODAL */}
      {newEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-brand-primaryDark">Schedule Care Home Event</h3>
              <button type="button" onClick={() => setNewEventModal(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Select Care Facility</label>
              <select name="careHomeId" className="w-full px-3 py-2 text-xs rounded-xl border bg-white">
                {careHomes.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.type === 'OLD_AGE' ? 'Elders' : 'Children'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Event Title</label>
              <input name="title" required placeholder="e.g. Festival Light Celebration" className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">Event Type</label>
                <select name="type" className="w-full px-3 py-2 text-xs rounded-xl border bg-white">
                  <option value="CELEBRATION">Celebration</option>
                  <option value="MEDICAL_CAMP">Medical Camp</option>
                  <option value="VOLUNTEER_VISIT">Volunteer Visit</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="FOOD_DRIVE">Food Drive</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">Volunteers Needed</label>
                <input name="volunteersNeeded" type="number" required placeholder="15" className="w-full px-3 py-2 text-xs rounded-xl border" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">Date</label>
                <input name="date" type="date" required className="w-full px-3 py-2 text-xs rounded-xl border" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">Time</label>
                <input name="time" required placeholder="16:00 - 19:00" className="w-full px-3 py-2 text-xs rounded-xl border" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Event Details</label>
              <textarea name="description" rows={3} required placeholder="Description of planned activities..." className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setNewEventModal(false)} className="px-4 py-2 text-xs rounded-xl border">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl">Schedule Event</button>
            </div>
          </form>
        </div>
      )}

      {/* NEW CAMPAIGN MODAL */}
      {newCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateCampaign}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-brand-primaryDark">Create Care Drive</h3>
              <button type="button" onClick={() => setNewCampaignModal(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Drive Title</label>
              <input name="title" required placeholder="e.g. Winter Blankets for Elders" className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Target Amount (₹)</label>
              <input name="targetAmount" type="number" required placeholder="50000" className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Items / Equipment Needed</label>
              <input name="itemNeeded" required placeholder="e.g. 50 Orthopedic mattresses" className="w-full px-3 py-2 text-xs rounded-xl border" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setNewCampaignModal(false)} className="px-4 py-2 text-xs rounded-xl border">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl">Launch Drive</button>
            </div>
          </form>
        </div>
      )}

      {/* NEW IMAGE MODAL */}
      {newImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleAddImage}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4"
          >
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-sm font-bold text-brand-primaryDark">Add Care Facility Photograph</h3>
              <button type="button" onClick={() => setNewImageModal(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Target Care Facility</label>
              <select
                value={selectedHomeForImage}
                onChange={(e) => setSelectedHomeForImage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white"
              >
                {careHomes.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.type === 'OLD_AGE' ? 'Old Age Home' : 'Child Care Home'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-muted mb-1">Photograph Image URL</label>
              <input
                type="url"
                required
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
              />
              <p className="text-[10px] text-brand-muted mt-1">High-resolution, dignified image of resident care, nutrition, or activities.</p>
            </div>

            {newImageUrl && (
              <div className="relative h-36 w-full rounded-xl overflow-hidden border border-brand-border">
                <Image src={newImageUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeaturedChoice}
                onChange={(e) => setIsFeaturedChoice(e.target.checked)}
                className="rounded text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-brand-text cursor-pointer">
                Set as Primary Featured Cover Photo
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setNewImageModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-brand-border text-brand-muted hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save to Archive
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
