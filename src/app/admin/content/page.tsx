'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { CMSServiceItem, CMSImpactStory, CMSCampaignItem, GalleryItem, UserRole, WebsiteContent } from '@/types';
import { CMSImageUploader } from '@/components/admin/CMSImageUploader';
import {
  Globe,
  CheckCircle2,
  Save,
  Send,
  Eye,
  History,
  Layers,
  BarChart3,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
  Tent,
  FileText,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export default function AdminContentManagementPage() {
  const {
    websiteContent,
    updateWebsiteContent,
    saveDraft,
    publishDraft,
    addAuditLog,
    computedStats,
    camps,
    gallery,
    uploadPhoto,
    deletePhoto,
    approvePhoto,
    updatePhoto,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<
    'HERO' | 'STATS' | 'ABOUT' | 'SERVICES' | 'STORIES' | 'GALLERY' | 'CAMPS' | 'CAMPAIGNS' | 'FOOTER' | 'AUDIT'
  >('HERO');

  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [draftNote, setDraftNote] = useState('');

  const triggerNotify = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // State for Hero
  const [heroHeading, setHeroHeading] = useState(websiteContent.heroHeading);
  const [heroSubheading, setHeroSubheading] = useState(websiteContent.heroSubheading);
  const [heroDescription, setHeroDescription] = useState(websiteContent.heroDescription || '');
  const [heroBgImage, setHeroBgImage] = useState(
    websiteContent.heroBgImage || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1920&q=80'
  );
  const [heroCta1Text, setHeroCta1Text] = useState(websiteContent.heroCta1Text || 'Join as Volunteer');
  const [heroCta1Link, setHeroCta1Link] = useState(websiteContent.heroCta1Link || '/register?role=volunteer');
  const [heroCta2Text, setHeroCta2Text] = useState(websiteContent.heroCta2Text || 'Donate Now');
  const [heroCta2Link, setHeroCta2Link] = useState(websiteContent.heroCta2Link || '#donate');
  const [heroVisible, setHeroVisible] = useState(websiteContent.heroVisible !== false);

  // State for About
  const [aboutHeading, setAboutHeading] = useState(websiteContent.aboutHeading || 'Our Story & Guiding Ethos');
  const [aboutText, setAboutText] = useState(websiteContent.aboutText);
  const [aboutStory, setAboutStory] = useState(websiteContent.aboutStory || '');
  const [missionText, setMissionText] = useState(websiteContent.missionText);
  const [visionText, setVisionText] = useState(websiteContent.visionText);

  // State for Stats
  const defaultStatsConfig = websiteContent.statsConfig || {
    livesImpacted: { label: 'Lives Directly Impacted', baseline: 0, enabled: true, format: 'AUTO', icon: 'Heart' },
    activeVolunteers: { label: 'Active Ground Volunteers', baseline: 0, enabled: true, format: 'AUTO', icon: 'Users' },
    campsCount: { label: 'Medical & Blood Camps Conducted', baseline: 0, enabled: true, format: 'AUTO', icon: 'Tent' },
    welfareRaised: { label: 'Direct Welfare Raised', baseline: 0, enabled: true, format: 'AUTO', icon: 'Rupee' },
    communityMembers: { label: 'Registered Community Members', baseline: 0, enabled: true, format: 'AUTO', icon: 'UserCheck' },
    connectedReach: {
      label: 'People Connected to Bharathi Foundation',
      enabled: true,
      source: 'COMBINED',
      format: 'AUTO',
      icon: 'Globe',
    },
  };
  const [statsConfig, setStatsConfig] = useState(defaultStatsConfig);

  // State for Services
  const [servicesList, setServicesList] = useState<CMSServiceItem[]>(websiteContent.servicesList || []);
  const [editingService, setEditingService] = useState<CMSServiceItem | null>(null);
  const [newServiceModal, setNewServiceModal] = useState(false);

  // State for Impact Stories
  const [impactStoriesList, setImpactStoriesList] = useState<CMSImpactStory[]>(websiteContent.impactStoriesList || []);
  const [editingStory, setEditingStory] = useState<CMSImpactStory | null>(null);
  const [newStoryModal, setNewStoryModal] = useState(false);

  // State for Donation Campaigns
  const [campaignsList, setCampaignsList] = useState<CMSCampaignItem[]>(websiteContent.donationCampaignsList || []);
  const [editingCampaign, setEditingCampaign] = useState<CMSCampaignItem | null>(null);
  const [newCampaignModal, setNewCampaignModal] = useState(false);

  // State for Photo Gallery
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);

  // State for Footer & Contacts
  const [contactEmail, setContactEmail] = useState(websiteContent.contactEmail);
  const [contactPhone, setContactPhone] = useState(websiteContent.contactPhone);
  const [emergencyPhone, setEmergencyPhone] = useState(websiteContent.emergencyPhone || '+91 98765 43210');
  const [whatsappPhone, setWhatsappPhone] = useState(
    websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210'
  );
  const [contactAddress, setContactAddress] = useState(websiteContent.contactAddress);
  const [footerDescription, setFooterDescription] = useState(
    websiteContent.footerDescription ||
      'Bharathi Foundation is a registered public charitable trust dedicated to spreading kindness, healthcare equality, and boundless maternal love.'
  );
  const [copyrightText, setCopyrightText] = useState(
    websiteContent.copyrightText ||
      '© 2026 Bharathi Foundation. All Rights Reserved. Tax exempt under 12A & 80G.'
  );

  // Track whether local form states have completed initial hydration from persistent storage
  const hasInitializedFromStorage = useRef(false);

  // Synchronize local form states only once on initial mount or when websiteContent is first loaded
  useEffect(() => {
    if (!hasInitializedFromStorage.current && websiteContent && websiteContent.heroHeading) {
      hasInitializedFromStorage.current = true;
      setHeroHeading(websiteContent.heroHeading || '');
      setHeroSubheading(websiteContent.heroSubheading || '');
      setHeroDescription(websiteContent.heroDescription || '');
      setHeroBgImage(websiteContent.heroBgImage || '');
      setHeroCta1Text(websiteContent.heroCta1Text || '');
      setHeroCta1Link(websiteContent.heroCta1Link || '');
      setHeroCta2Text(websiteContent.heroCta2Text || '');
      setHeroCta2Link(websiteContent.heroCta2Link || '');
      setHeroVisible(websiteContent.heroVisible !== false);

      setAboutHeading(websiteContent.aboutHeading || '');
      setAboutText(websiteContent.aboutText || '');
      setAboutStory(websiteContent.aboutStory || '');
      setMissionText(websiteContent.missionText || '');
      setVisionText(websiteContent.visionText || '');

      if (websiteContent.statsConfig) setStatsConfig(websiteContent.statsConfig);
      if (websiteContent.servicesList) setServicesList(websiteContent.servicesList);
      if (websiteContent.impactStoriesList) setImpactStoriesList(websiteContent.impactStoriesList);
      if (websiteContent.donationCampaignsList) setCampaignsList(websiteContent.donationCampaignsList);

      setContactEmail(websiteContent.contactEmail || '');
      setContactPhone(websiteContent.contactPhone || '');
      setEmergencyPhone(websiteContent.emergencyPhone || '+91 98765 43210');
      setWhatsappPhone(websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210');
      setContactAddress(websiteContent.contactAddress || '');
      if (websiteContent.footerDescription) setFooterDescription(websiteContent.footerDescription);
      if (websiteContent.copyrightText) setCopyrightText(websiteContent.copyrightText);
    }
  }, [websiteContent]);

  // State for Gallery Upload Form
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'BLOOD_CAMP' | 'MEDICAL_OUTREACH' | 'CHILD_WELFARE' | 'COMMUNITY' | 'DISASTER_RELIEF'>('COMMUNITY');

  // Handle Save Hero
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent({
      heroHeading,
      heroSubheading,
      heroDescription,
      heroBgImage,
      heroCta1Text,
      heroCta1Link,
      heroCta2Text,
      heroCta2Link,
      heroVisible,
    });
    addAuditLog('UPDATE_HERO', 'Admin updated Homepage Hero section content & background.');
    triggerNotify('Homepage Hero section updated successfully!');
  };

  // Handle Save About
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent({
      aboutHeading,
      aboutText,
      aboutStory,
      missionText,
      visionText,
    });
    addAuditLog('UPDATE_ABOUT', 'Admin updated About, Mission & Vision statements.');
    triggerNotify('About, Mission & Vision content updated successfully!');
  };

  // Handle Save Stats Config
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent({ statsConfig });
    addAuditLog('UPDATE_STATS_CONFIG', 'Admin configured dynamic statistics baselines and display formats.');
    triggerNotify('Homepage Statistics rules and baselines updated successfully!');
  };

  // Handle Services CRUD
  const handleToggleServicePublish = (id: string) => {
    const updated = servicesList.map((s) => (s.id === id ? { ...s, published: !s.published } : s));
    setServicesList(updated);
    updateWebsiteContent({ servicesList: updated });
    triggerNotify('Service visibility toggled.');
  };

  const handleDeleteService = (id: string) => {
    const updated = servicesList.filter((s) => s.id !== id);
    setServicesList(updated);
    updateWebsiteContent({ servicesList: updated });
    triggerNotify('Service removed.');
  };

  const handleCreateService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newService: CMSServiceItem = {
      id: `srv-${Date.now()}`,
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      icon: (formData.get('icon') as string) || 'Sparkles',
      imageUrl: (formData.get('imageUrl') as string) || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
      published: true,
      order: servicesList.length + 1,
    };
    const updated = [...servicesList, newService];
    setServicesList(updated);
    updateWebsiteContent({ servicesList: updated });
    setNewServiceModal(false);
    triggerNotify(`Created new service: "${newService.title}"`);
  };

  const handleSaveEditedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = servicesList.map((s) => (s.id === editingService.id ? editingService : s));
    setServicesList(updated);
    updateWebsiteContent({ servicesList: updated });
    setEditingService(null);
    triggerNotify(`Saved changes for service: "${editingService.title}"`);
  };

  // Handle Impact Stories CRUD
  const handleToggleStoryPublish = (id: string) => {
    const updated = impactStoriesList.map((s) => (s.id === id ? { ...s, published: !s.published } : s));
    setImpactStoriesList(updated);
    updateWebsiteContent({ impactStoriesList: updated });
    triggerNotify('Impact story status toggled.');
  };

  const handleDeleteStory = (id: string) => {
    const updated = impactStoriesList.filter((s) => s.id !== id);
    setImpactStoriesList(updated);
    updateWebsiteContent({ impactStoriesList: updated });
    triggerNotify('Impact story deleted.');
  };

  const handleCreateStory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStory: CMSImpactStory = {
      id: `story-${Date.now()}`,
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      date: (formData.get('date') as string) || new Date().toISOString().split('T')[0],
      location: (formData.get('location') as string) || 'Bengaluru',
      images: [(formData.get('imageUrl') as string) || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'],
      beneficiariesCount: parseInt(formData.get('beneficiariesCount') as string, 10) || 50,
      published: true,
    };
    const updated = [newStory, ...impactStoriesList];
    setImpactStoriesList(updated);
    updateWebsiteContent({ impactStoriesList: updated });
    setNewStoryModal(false);
    triggerNotify(`Published story: "${newStory.title}"`);
  };

  const handleSaveEditedStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    const updated = impactStoriesList.map((s) => (s.id === editingStory.id ? editingStory : s));
    setImpactStoriesList(updated);
    updateWebsiteContent({ impactStoriesList: updated });
    setEditingStory(null);
    triggerNotify(`Saved changes for story: "${editingStory.title}"`);
  };

  // Handle Donation Campaigns CRUD
  const handleToggleCampaignPublish = (id: string) => {
    const updated = campaignsList.map((c) => (c.id === id ? { ...c, published: !c.published } : c));
    setCampaignsList(updated);
    updateWebsiteContent({ donationCampaignsList: updated });
    triggerNotify('Campaign visibility updated.');
  };

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCamp: CMSCampaignItem = {
      id: `camp-fund-${Date.now()}`,
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      targetAmount: parseInt(formData.get('targetAmount') as string, 10) || 100000,
      raisedAmount: 0,
      description: formData.get('description') as string,
      imageUrl: (formData.get('imageUrl') as string) || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE',
      donorsCount: 0,
      published: true,
    };
    const updated = [...campaignsList, newCamp];
    setCampaignsList(updated);
    updateWebsiteContent({ donationCampaignsList: updated });
    setNewCampaignModal(false);
    triggerNotify(`Launched campaign: "${newCamp.title}"`);
  };

  const handleSaveEditedCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    const updated = campaignsList.map((c) => (c.id === editingCampaign.id ? editingCampaign : c));
    setCampaignsList(updated);
    updateWebsiteContent({ donationCampaignsList: updated });
    setEditingCampaign(null);
    triggerNotify(`Saved changes for campaign: "${editingCampaign.title}"`);
  };

  // Handle Save Footer
  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent({
      contactEmail,
      contactPhone,
      emergencyPhone,
      whatsappPhone,
      contactAddress,
      footerDescription,
      copyrightText,
    });
    addAuditLog('UPDATE_FOOTER', `Admin updated contact details: Primary: ${contactPhone}, Emergency: ${emergencyPhone}, WhatsApp: ${whatsappPhone}`);
    triggerNotify('Footer, helpline, and WhatsApp numbers updated and published successfully!');
  };

  // Handle Gallery Photo Add
  const handleAddGalleryPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) return;
    uploadPhoto({
      title: newPhotoTitle || 'Foundation Field Activity',
      description: 'Approved activity photograph',
      category: newPhotoCategory,
      imageUrl: newPhotoUrl,
      uploadedByRole: 'ADMIN',
      uploadedByName: 'Admin Executive',
      isApproved: true,
      location: 'Bengaluru Ground Operation',
    });
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    triggerNotify('New photograph added to approved public gallery!');
  };

  const handleSaveEditedPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    updatePhoto(editingPhoto.id, editingPhoto);
    setEditingPhoto(null);
    triggerNotify(`Saved changes for photograph: "${editingPhoto.title}"`);
  };

  // Helper to compile all active form field states
  const getAllCurrentFormData = (): Partial<WebsiteContent> => ({
    heroHeading,
    heroSubheading,
    heroDescription,
    heroBgImage,
    heroCta1Text,
    heroCta1Link,
    heroCta2Text,
    heroCta2Link,
    heroVisible,
    aboutHeading,
    aboutText,
    aboutStory,
    missionText,
    visionText,
    statsConfig,
    servicesList,
    impactStoriesList,
    donationCampaignsList: campaignsList,
    contactEmail,
    contactPhone,
    emergencyPhone,
    whatsappPhone,
    contactAddress,
    footerDescription,
    copyrightText,
  });

  // Publish / Draft Handlers
  const handleSaveDraftAction = () => {
    const currentData = getAllCurrentFormData();
    updateWebsiteContent(currentData);
    saveDraft(draftNote || 'Admin manual snapshot', currentData);
    setDraftNote('');
    triggerNotify('Draft snapshot saved successfully!', 'info');
  };

  const handlePublishLiveAction = () => {
    const currentData = getAllCurrentFormData();
    updateWebsiteContent(currentData);
    publishDraft(undefined, currentData);
    triggerNotify('All approved content is now LIVE on the public website!');
  };

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Website Content Management System (CMS)"
      subtitle="Full real-time control over public website text, images, dynamic statistics, services, campaigns, and footer"
    >
      {/* Top Action & Publishing Bar */}
      <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-primaryDark flex items-center gap-2">
              <span>Live Website Synchronization</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-brand-muted">
              Last published:{' '}
              {websiteContent.lastPublishedAt
                ? new Date(websiteContent.lastPublishedAt).toLocaleTimeString()
                : 'Synchronized Real-Time'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 text-xs font-bold text-brand-primary bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Homepage</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraftAction}
            className="px-4 py-2 text-xs font-bold text-brand-text bg-brand-bgLight hover:bg-white border border-brand-border rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublishLiveAction}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Publish Changes Live</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-2xl border text-xs flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-purple-50 border-purple-200 text-purple-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="text-brand-muted hover:text-brand-text">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-brand-border/60 scrollbar-none">
        {[
          { key: 'HERO', label: 'Hero Section', icon: Globe },
          { key: 'STATS', label: 'Dynamic Stats', icon: BarChart3 },
          { key: 'ABOUT', label: 'About & Mission', icon: BookOpen },
          { key: 'SERVICES', label: 'Services (6+)', icon: Layers },
          { key: 'STORIES', label: 'Impact Stories', icon: Sparkles },
          { key: 'GALLERY', label: 'Photo Gallery', icon: ImageIcon },
          { key: 'CAMPAIGNS', label: 'Donation Drives', icon: HeartHandshake },
          { key: 'FOOTER', label: 'Footer & Contacts', icon: FileText },
          { key: 'AUDIT', label: 'Audit History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-bgLight'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: HERO */}
      {activeTab === 'HERO' && (
        <form onSubmit={handleSaveHero} className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-base font-bold text-brand-primaryDark">Hero Section Configuration</h3>
            <p className="text-xs text-brand-muted mt-0.5">Control the primary headline, imagery, and call-to-action buttons seen by all visitors.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Primary Hero Headline</label>
              <input
                type="text"
                required
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Hero Sub-Headline</label>
              <textarea
                rows={2}
                required
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Expanded Narrative Description</label>
              <textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Hero Background Image URL</label>
              <input
                type="url"
                required
                value={heroBgImage}
                onChange={(e) => setHeroBgImage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
              {heroBgImage && (
                <div className="mt-2 relative w-full h-36 rounded-xl overflow-hidden border border-brand-border">
                  <Image src={heroBgImage} alt="Hero Background Preview" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">Preview</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">CTA Button 1 Label</label>
                <input
                  type="text"
                  value={heroCta1Text}
                  onChange={(e) => setHeroCta1Text(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">CTA Button 1 Destination Link</label>
                <input
                  type="text"
                  value={heroCta1Link}
                  onChange={(e) => setHeroCta1Link(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">CTA Button 2 Label</label>
                <input
                  type="text"
                  value={heroCta2Text}
                  onChange={(e) => setHeroCta2Text(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">CTA Button 2 Destination Link</label>
                <input
                  type="text"
                  value={heroCta2Link}
                  onChange={(e) => setHeroCta2Link(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-brand-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroVisible}
                  onChange={(e) => setHeroVisible(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary"
                />
                <span>Hero Section Visible on Public Homepage</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/60 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Save Hero Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: STATS */}
      {activeTab === 'STATS' && (
        <form onSubmit={handleSaveStats} className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-base font-bold text-brand-primaryDark">Homepage Dynamic Statistics Configuration</h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Live statistics are computed from real ground data. You can configure verified baseline offsets, display threshold formats, and reach calculation sources.
            </p>
          </div>

          {/* Current Live Computed Preview Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-brand-bgLight rounded-2xl border border-brand-border">
            <div>
              <span className="text-[10px] text-brand-muted uppercase block">Lives Impacted</span>
              <span className="text-sm font-black text-brand-primary">{computedStats.formatStatValue(computedStats.livesImpacted, statsConfig.livesImpacted?.format)}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted uppercase block">Volunteers</span>
              <span className="text-sm font-black text-brand-primary">{computedStats.formatStatValue(computedStats.activeVolunteers, statsConfig.activeVolunteers?.format)}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted uppercase block">Camps</span>
              <span className="text-sm font-black text-brand-primary">{computedStats.formatStatValue(computedStats.campsCount, statsConfig.campsCount?.format)}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted uppercase block">Welfare Raised</span>
              <span className="text-sm font-black text-brand-primary">₹{(computedStats.welfareRaised / 100000).toFixed(1)}L+</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted uppercase block">Community</span>
              <span className="text-sm font-black text-brand-primary">{computedStats.formatStatValue(computedStats.communityMembers, statsConfig.communityMembers?.format)}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted uppercase block">Connected Reach</span>
              <span className="text-sm font-black text-brand-primary">{computedStats.formatStatValue(computedStats.connectedReach, statsConfig.connectedReach?.format)}</span>
            </div>
          </div>

          {/* Configuration Form Rows */}
          <div className="space-y-5">
            {/* Lives Impacted */}
            <div className="p-4 rounded-2xl border border-brand-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primaryDark">1. Lives Directly Impacted</span>
                <label className="text-[11px] font-bold text-brand-muted flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statsConfig.livesImpacted?.enabled !== false}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        livesImpacted: { ...statsConfig.livesImpacted, enabled: e.target.checked },
                      })
                    }
                  />
                  <span>Enabled</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Label</label>
                  <input
                    type="text"
                    value={statsConfig.livesImpacted?.label}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        livesImpacted: { ...statsConfig.livesImpacted, label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Verified Baseline (Offset)</label>
                  <input
                    type="number"
                    value={statsConfig.livesImpacted?.baseline}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        livesImpacted: { ...statsConfig.livesImpacted, baseline: parseInt(e.target.value, 10) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Format Threshold</label>
                  <select
                    value={statsConfig.livesImpacted?.format || 'AUTO'}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        livesImpacted: { ...statsConfig.livesImpacted, format: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white"
                  >
                    <option value="AUTO">AUTO (Intelligent rounding)</option>
                    <option value="EXACT">EXACT Count</option>
                    <option value="500+">500+</option>
                    <option value="1000+">1,000+</option>
                    <option value="5000+">5,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Volunteers */}
            <div className="p-4 rounded-2xl border border-brand-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primaryDark">2. Active Ground Volunteers</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Rule: Counts approved active volunteers only
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Label</label>
                  <input
                    type="text"
                    value={statsConfig.activeVolunteers?.label}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        activeVolunteers: { ...statsConfig.activeVolunteers, label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Format Threshold</label>
                  <select
                    value={statsConfig.activeVolunteers?.format || '500+'}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        activeVolunteers: { ...statsConfig.activeVolunteers, format: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white"
                  >
                    <option value="AUTO">AUTO</option>
                    <option value="EXACT">EXACT Count</option>
                    <option value="100+">100+</option>
                    <option value="500+">500+</option>
                    <option value="1000+">1,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical & Blood Camps */}
            <div className="p-4 rounded-2xl border border-brand-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primaryDark">3. Medical & Blood Camps</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Rule: Verified completed camps count
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Label</label>
                  <input
                    type="text"
                    value={statsConfig.campsCount?.label}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        campsCount: { ...statsConfig.campsCount, label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Format Threshold</label>
                  <select
                    value={statsConfig.campsCount?.format || '50+'}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        campsCount: { ...statsConfig.campsCount, format: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white"
                  >
                    <option value="AUTO">AUTO</option>
                    <option value="EXACT">EXACT Count</option>
                    <option value="20+">20+</option>
                    <option value="50+">50+</option>
                    <option value="100+">100+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Direct Welfare Raised */}
            <div className="p-4 rounded-2xl border border-brand-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primaryDark">4. Direct Welfare Raised</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Rule: Sums verified donations only (excludes pending/rejected)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Label</label>
                  <input
                    type="text"
                    value={statsConfig.welfareRaised?.label}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        welfareRaised: { ...statsConfig.welfareRaised, label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Verified Baseline (₹)</label>
                  <input
                    type="number"
                    value={statsConfig.welfareRaised?.baseline}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        welfareRaised: { ...statsConfig.welfareRaised, baseline: parseInt(e.target.value, 10) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
                  />
                </div>
              </div>
            </div>

            {/* People Connected (New Statistic) */}
            <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primaryDark flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-secondary" />
                  <span>5. People Connected to Bharathi Foundation (New Community Reach Metric)</span>
                </span>
                <label className="text-[11px] font-bold text-brand-muted flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statsConfig.connectedReach?.enabled !== false}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        connectedReach: { ...statsConfig.connectedReach, enabled: e.target.checked },
                      })
                    }
                  />
                  <span>Show on Homepage</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Label</label>
                  <input
                    type="text"
                    value={statsConfig.connectedReach?.label}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        connectedReach: { ...statsConfig.connectedReach, label: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Counting Method Source</label>
                  <select
                    value={statsConfig.connectedReach?.source || 'COMBINED'}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        connectedReach: { ...statsConfig.connectedReach, source: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white"
                  >
                    <option value="COMBINED">Combined Unique Community Members</option>
                    <option value="USERS">Unique Registered Users</option>
                    <option value="VOLUNTEERS">Approved Volunteers Only</option>
                    <option value="NGOS">Approved NGO Partners Only</option>
                    <option value="DONORS">Verified Donors Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Format Threshold</label>
                  <select
                    value={statsConfig.connectedReach?.format || '1000+'}
                    onChange={(e) =>
                      setStatsConfig({
                        ...statsConfig,
                        connectedReach: { ...statsConfig.connectedReach, format: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white"
                  >
                    <option value="AUTO">AUTO</option>
                    <option value="EXACT">EXACT Count</option>
                    <option value="500+">500+</option>
                    <option value="1000+">1,000+</option>
                    <option value="5000+">5,000+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/60 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Save Statistics Configuration
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: ABOUT */}
      {activeTab === 'ABOUT' && (
        <form onSubmit={handleSaveAbout} className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-base font-bold text-brand-primaryDark">About Us, Mission & Vision CMS</h3>
            <p className="text-xs text-brand-muted mt-0.5">Edit public foundation story, guiding values, and organizational mandate.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">About Section Heading</label>
              <input
                type="text"
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Foundation Story & Guiding Ethos</label>
              <textarea
                rows={3}
                value={aboutStory}
                onChange={(e) => setAboutStory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">About Foundation Descriptive Prose</label>
              <textarea
                rows={3}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Official Mission Statement</label>
                <textarea
                  rows={3}
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Official Vision Statement</label>
                <textarea
                  rows={3}
                  value={visionText}
                  onChange={(e) => setVisionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/60 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Save About Content
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: SERVICES */}
      {activeTab === 'SERVICES' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">Core Foundation Services (CMS)</h3>
              <p className="text-xs text-brand-muted mt-0.5">Manage, add, reorder, and publish/unpublish core service pillars.</p>
            </div>
            <button
              type="button"
              onClick={() => setNewServiceModal(true)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesList.map((service, idx) => (
              <div
                key={service.id}
                className={`p-4 rounded-2xl border transition-all ${
                  service.published ? 'border-brand-border bg-white' : 'border-dashed border-gray-300 bg-gray-50 opacity-70'
                }`}
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-purple-100">
                  <Image src={service.imageUrl} alt={service.title} fill className="object-cover" />
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-brand-primary">
                    #{idx + 1}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-brand-primaryDark">{service.title}</h4>
                <span className="text-[10px] text-brand-secondary font-semibold block">{service.category}</span>
                <p className="text-[11px] text-brand-muted line-clamp-2 mt-1">{service.description}</p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-brand-border/60">
                  <button
                    type="button"
                    onClick={() => handleToggleServicePublish(service.id)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      service.published
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {service.published ? 'Published' : 'Hidden (Draft)'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingService(service)}
                      className="text-brand-primary hover:text-brand-primaryDark p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Service Modal */}
          {editingService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
              <form
                onSubmit={handleSaveEditedService}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold text-brand-primaryDark">Edit Service Pillar</h3>
                    <p className="text-[11px] text-brand-muted">Update service details, replace or upload image, and adjust display status.</p>
                  </div>
                  <button type="button" onClick={() => setEditingService(null)} className="text-brand-muted hover:text-brand-text p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Service Title</label>
                  <input
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Category</label>
                    <input
                      value={editingService.category}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingService.order || 1}
                      onChange={(e) => setEditingService({ ...editingService, order: parseInt(e.target.value, 10) || 1 })}
                      min={1}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Description</label>
                  <textarea
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    rows={3}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                {/* Persistent Image Uploader */}
                <CMSImageUploader
                  label="Service Image"
                  currentImageUrl={editingService.imageUrl}
                  onImageChanged={(newUrl) => setEditingService({ ...editingService, imageUrl: newUrl })}
                  helperText="Upload PNG, JPG, WebP file or paste external image URL"
                />

                <div className="flex items-center gap-2 pt-2 border-t">
                  <input
                    type="checkbox"
                    id="editServicePub"
                    checked={editingService.published !== false}
                    onChange={(e) => setEditingService({ ...editingService, published: e.target.checked })}
                    className="rounded text-brand-primary focus:ring-brand-primary"
                  />
                  <label htmlFor="editServicePub" className="text-xs font-semibold text-brand-text">
                    Publish Live on Homepage
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-brand-border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* New Service Modal */}
          {newServiceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <form
                onSubmit={handleCreateService}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-sm font-bold text-brand-primaryDark">Add New Foundation Service</h3>
                  <button type="button" onClick={() => setNewServiceModal(false)} className="text-brand-muted hover:text-brand-text">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Service Title</label>
                  <input name="title" required placeholder="e.g. Mobile Vision Care Clinic" className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Category</label>
                  <input name="category" required placeholder="e.g. Free Medical Camps" className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Description</label>
                  <textarea name="description" rows={3} required placeholder="Detailed service description..." className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Image URL</label>
                  <input name="imageUrl" type="url" placeholder="https://..." className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setNewServiceModal(false)} className="px-4 py-2 text-xs rounded-xl border">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl">Save & Publish</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: IMPACT STORIES */}
      {activeTab === 'STORIES' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">Impact Stories & Case Studies (CMS)</h3>
              <p className="text-xs text-brand-muted mt-0.5">Document verified real-world transformations with photography and verified beneficiary counts.</p>
            </div>
            <button
              type="button"
              onClick={() => setNewStoryModal(true)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Impact Story</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactStoriesList.map((story) => (
              <div key={story.id} className="p-4 rounded-2xl border border-brand-border bg-white flex flex-col justify-between">
                <div>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-purple-100">
                    <Image src={story.images[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'} alt={story.title} fill className="object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      {story.beneficiariesCount} Beneficiaries
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-brand-primaryDark">{story.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5">
                    <span>{story.category}</span>
                    <span>•</span>
                    <span>{story.location}</span>
                    <span>•</span>
                    <span>{story.date}</span>
                  </div>
                  <p className="text-[11px] text-brand-muted line-clamp-3 mt-2">{story.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-brand-border/60">
                  <button
                    type="button"
                    onClick={() => handleToggleStoryPublish(story.id)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      story.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {story.published ? 'Published Live' : 'Hidden'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingStory(story)}
                      className="text-brand-primary hover:text-brand-primaryDark p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Edit Story"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Impact Story Modal */}
          {editingStory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
              <form
                onSubmit={handleSaveEditedStory}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold text-brand-primaryDark">Edit Impact Story</h3>
                    <p className="text-[11px] text-brand-muted">Update headline, category, verified count, and replacement featured image.</p>
                  </div>
                  <button type="button" onClick={() => setEditingStory(null)} className="text-brand-muted hover:text-brand-text p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Story Title</label>
                  <input
                    value={editingStory.title}
                    onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Category</label>
                    <input
                      value={editingStory.category}
                      onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Beneficiaries Count</label>
                    <input
                      type="number"
                      value={editingStory.beneficiariesCount || 0}
                      onChange={(e) => setEditingStory({ ...editingStory, beneficiariesCount: parseInt(e.target.value, 10) || 0 })}
                      min={1}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Location</label>
                    <input
                      value={editingStory.location}
                      onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Date</label>
                    <input
                      type="date"
                      value={editingStory.date}
                      onChange={(e) => setEditingStory({ ...editingStory, date: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Detailed Narrative</label>
                  <textarea
                    value={editingStory.description}
                    onChange={(e) => setEditingStory({ ...editingStory, description: e.target.value })}
                    rows={4}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                {/* Persistent Image Uploader */}
                <CMSImageUploader
                  label="Featured Story Photograph"
                  currentImageUrl={editingStory.images?.[0] || ''}
                  onImageChanged={(newUrl) => setEditingStory({ ...editingStory, images: [newUrl] })}
                  helperText="Upload PNG, JPG, WebP file or paste external image URL"
                />

                <div className="flex items-center gap-2 pt-2 border-t">
                  <input
                    type="checkbox"
                    id="editStoryPub"
                    checked={editingStory.published !== false}
                    onChange={(e) => setEditingStory({ ...editingStory, published: e.target.checked })}
                    className="rounded text-brand-primary focus:ring-brand-primary"
                  />
                  <label htmlFor="editStoryPub" className="text-xs font-semibold text-brand-text">
                    Publish Live in Stories & Ground Gallery
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingStory(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-brand-border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* New Story Modal */}
          {newStoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <form
                onSubmit={handleCreateStory}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-sm font-bold text-brand-primaryDark">Add New Impact Story</h3>
                  <button type="button" onClick={() => setNewStoryModal(false)} className="text-brand-muted hover:text-brand-text">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Story Title</label>
                  <input name="title" required placeholder="e.g. Empowering 100 Rural Girls through STEM" className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Category</label>
                    <input name="category" required placeholder="Educational Programs" className="w-full px-3 py-2 text-xs rounded-xl border" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Beneficiaries</label>
                    <input name="beneficiariesCount" type="number" required placeholder="100" className="w-full px-3 py-2 text-xs rounded-xl border" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Location</label>
                    <input name="location" required placeholder="Ramanagara Hamlets" className="w-full px-3 py-2 text-xs rounded-xl border" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Date</label>
                    <input name="date" type="date" required className="w-full px-3 py-2 text-xs rounded-xl border" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Story Description</label>
                  <textarea name="description" rows={3} required placeholder="Detailed narrative..." className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Photo URL</label>
                  <input name="imageUrl" type="url" placeholder="https://..." className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setNewStoryModal(false)} className="px-4 py-2 text-xs rounded-xl border">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl">Publish Story</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: GALLERY */}
      {activeTab === 'GALLERY' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-base font-bold text-brand-primaryDark">Photo Gallery Management</h3>
            <p className="text-xs text-brand-muted mt-0.5">Upload new verified field photographs and manage visibility across the public homepage gallery.</p>
          </div>

          {/* Quick Upload Bar */}
          <form onSubmit={handleAddGalleryPhoto} className="p-4 bg-brand-bgLight rounded-2xl border border-brand-border space-y-3">
            <span className="text-xs font-bold text-brand-primaryDark block">Upload / Add New Photograph</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="url"
                required
                placeholder="Image URL (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white sm:col-span-2"
              />
              <input
                type="text"
                placeholder="Caption / Title"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Gallery</span>
              </button>
            </div>
          </form>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div key={img.id} className="p-2.5 rounded-2xl border border-brand-border bg-white group relative">
                <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2 bg-purple-100">
                  <Image src={img.imageUrl} alt={img.title} fill className="object-cover" />
                  <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${img.isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {img.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <h5 className="text-[11px] font-bold text-brand-primaryDark truncate">{img.title}</h5>
                <span className="text-[10px] text-brand-muted block">{img.category}</span>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-brand-border/60">
                  {!img.isApproved && (
                    <button
                      type="button"
                      onClick={() => approvePhoto(img.id)}
                      className="text-[10px] text-emerald-600 font-bold hover:underline"
                    >
                      Approve
                    </button>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => setEditingPhoto(img)}
                      className="text-brand-primary hover:text-brand-primaryDark p-1 rounded hover:bg-purple-50 transition-colors"
                      title="Edit Photograph"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePhoto(img.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete Photograph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Photograph Modal */}
          {editingPhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
              <form
                onSubmit={handleSaveEditedPhoto}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold text-brand-primaryDark">Edit Gallery Photograph</h3>
                    <p className="text-[11px] text-brand-muted">Update photograph title, location, category, and replace image.</p>
                  </div>
                  <button type="button" onClick={() => setEditingPhoto(null)} className="text-brand-muted hover:text-brand-text p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Photograph Title / Caption</label>
                  <input
                    value={editingPhoto.title}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Category</label>
                    <select
                      value={editingPhoto.category}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    >
                      <option value="BLOOD_CAMP">Blood Donation Camps</option>
                      <option value="MEDICAL_OUTREACH">Medical Diagnostics</option>
                      <option value="COMMUNITY">Annadanam & Community</option>
                      <option value="CHILD_WELFARE">Child Welfare & Education</option>
                      <option value="DISASTER_RELIEF">Disaster Relief</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Date</label>
                    <input
                      type="date"
                      value={editingPhoto.date}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Location</label>
                  <input
                    value={editingPhoto.location}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Description</label>
                  <textarea
                    value={editingPhoto.description}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                {/* Persistent Image Uploader */}
                <CMSImageUploader
                  label="Gallery Photograph"
                  currentImageUrl={editingPhoto.imageUrl}
                  onImageChanged={(newUrl) => setEditingPhoto({ ...editingPhoto, imageUrl: newUrl })}
                  helperText="Upload PNG, JPG, WebP file or paste external image URL"
                />

                <div className="flex items-center gap-2 pt-2 border-t">
                  <input
                    type="checkbox"
                    id="editPhotoAppr"
                    checked={editingPhoto.isApproved}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, isApproved: e.target.checked })}
                    className="rounded text-brand-primary focus:ring-brand-primary"
                  />
                  <label htmlFor="editPhotoAppr" className="text-xs font-semibold text-brand-text">
                    Approved & Visible on Public Homepage Gallery
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingPhoto(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-brand-border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CAMPAIGNS */}
      {activeTab === 'CAMPAIGNS' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">Featured Donation Campaigns (CMS)</h3>
              <p className="text-xs text-brand-muted mt-0.5">Create and manage targeted fundraising campaigns displayed on the public homepage with UPI QR integration.</p>
            </div>
            <button
              type="button"
              onClick={() => setNewCampaignModal(true)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaignsList.map((campaign) => (
              <div key={campaign.id} className="p-4 rounded-2xl border border-brand-border bg-white flex flex-col justify-between">
                <div>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-purple-100">
                    <Image src={campaign.imageUrl} alt={campaign.title} fill className="object-cover" />
                    <span className="absolute top-2 right-2 bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      Goal: ₹{campaign.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-brand-primaryDark">{campaign.title}</h4>
                  <span className="text-[10px] text-brand-secondary font-semibold block">{campaign.category}</span>
                  <p className="text-[11px] text-brand-muted line-clamp-2 mt-1">{campaign.description}</p>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-brand-muted">
                      <span>Raised: ₹{campaign.raisedAmount.toLocaleString('en-IN')}</span>
                      <span>{Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-brand-bgLight overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-brand-border/60">
                  <button
                    type="button"
                    onClick={() => handleToggleCampaignPublish(campaign.id)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      campaign.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {campaign.published ? 'Published Live' : 'Hidden'}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brand-muted">{campaign.donorsCount} Donors</span>
                    <button
                      type="button"
                      onClick={() => setEditingCampaign(campaign)}
                      className="text-brand-primary hover:text-brand-primaryDark p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Edit Campaign"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Campaign Modal */}
          {editingCampaign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
              <form
                onSubmit={handleSaveEditedCampaign}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold text-brand-primaryDark">Edit Donation Campaign</h3>
                    <p className="text-[11px] text-brand-muted">Update campaign targets, descriptions, and replacement image.</p>
                  </div>
                  <button type="button" onClick={() => setEditingCampaign(null)} className="text-brand-muted hover:text-brand-text p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Campaign Title</label>
                  <input
                    value={editingCampaign.title}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Category</label>
                    <input
                      value={editingCampaign.category}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Target Amount (₹)</label>
                    <input
                      type="number"
                      value={editingCampaign.targetAmount}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, targetAmount: parseInt(e.target.value, 10) || 0 })}
                      min={1000}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Description</label>
                  <textarea
                    value={editingCampaign.description}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                    rows={3}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                  />
                </div>

                {/* Persistent Image Uploader */}
                <CMSImageUploader
                  label="Campaign Banner Image"
                  currentImageUrl={editingCampaign.imageUrl}
                  onImageChanged={(newUrl) => setEditingCampaign({ ...editingCampaign, imageUrl: newUrl })}
                  helperText="Upload PNG, JPG, WebP file or paste external image URL"
                />

                <div className="flex items-center gap-2 pt-2 border-t">
                  <input
                    type="checkbox"
                    id="editCampPub"
                    checked={editingCampaign.published !== false}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, published: e.target.checked })}
                    className="rounded text-brand-primary focus:ring-brand-primary"
                  />
                  <label htmlFor="editCampPub" className="text-xs font-semibold text-brand-text">
                    Publish Live on Homepage
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingCampaign(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-brand-border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* New Campaign Modal */}
          {newCampaignModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <form
                onSubmit={handleCreateCampaign}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-sm font-bold text-brand-primaryDark">Create Targeted Donation Campaign</h3>
                  <button type="button" onClick={() => setNewCampaignModal(false)} className="text-brand-muted hover:text-brand-text">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Campaign Title</label>
                  <input name="title" required placeholder="e.g. Winter Blankets for 100 Destitute Seniors" className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Category</label>
                    <input name="category" required placeholder="Elderly Care" className="w-full px-3 py-2 text-xs rounded-xl border" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-muted mb-1">Target Amount (₹)</label>
                    <input name="targetAmount" type="number" required placeholder="150000" className="w-full px-3 py-2 text-xs rounded-xl border" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Campaign Description</label>
                  <textarea name="description" rows={3} required placeholder="Detailed objective and transparent breakdown..." className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-muted mb-1">Feature Photograph URL</label>
                  <input name="imageUrl" type="url" placeholder="https://..." className="w-full px-3 py-2 text-xs rounded-xl border" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setNewCampaignModal(false)} className="px-4 py-2 text-xs rounded-xl border">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl">Launch Campaign</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: FOOTER */}
      {activeTab === 'FOOTER' && (
        <form onSubmit={handleSaveFooter} className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-base font-bold text-brand-primaryDark">Footer & Helpline Contacts CMS</h3>
            <p className="text-xs text-brand-muted mt-0.5">Control emergency helpline phone numbers, official trust registered address, and footer disclaimer.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Primary Phone</label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">24/7 SOS Emergency Blood Line</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  Official WhatsApp Helpline Number (with Country Code)
                </label>
                <input
                  type="text"
                  required
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
                <p className="text-[10px] text-brand-muted mt-1">
                  Powers the floating WhatsApp SOS button, blood desk chat, and instant messaging. Format: +91 98765 43210
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-brand-text mb-1">Registered Trust Address</label>
                <input
                  type="text"
                  required
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Footer Brand Statement</label>
              <textarea
                rows={2}
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Copyright & Legal Disclosures</label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/60 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Save Footer & Contacts
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="border-b border-brand-border/60 pb-4">
            <h3 className="text-base font-bold text-brand-primaryDark">CMS Version History & Audit Trail</h3>
            <p className="text-xs text-brand-muted mt-0.5">Every content update, publish action, and baseline change is cryptographically audited.</p>
          </div>

          <div className="divide-y divide-brand-border/60">
            {(websiteContent.auditLogs || []).map((log) => (
              <div key={log.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-brand-primaryDark block">{log.details}</span>
                  <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5">
                    <span className="bg-purple-100 text-brand-primary font-bold px-1.5 py-0.5 rounded">{log.action}</span>
                    <span>•</span>
                    <span>By {log.adminName}</span>
                  </div>
                </div>
                <span className="text-[10px] text-brand-muted shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-brand-border space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-primary" />
                <h3 className="text-base font-bold text-brand-primaryDark">Live Public Homepage Content Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-brand-muted hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-bgLight"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hero Section Preview */}
            <div className="relative rounded-2xl overflow-hidden p-8 text-white space-y-3" style={{ background: 'linear-gradient(135deg, #51247A 0%, #2E0854 100%)' }}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-secondary bg-white/10 px-3 py-1 rounded-full">
                Hero Section Preview
              </span>
              <h2 className="text-2xl font-black">{heroHeading}</h2>
              <p className="text-xs text-purple-200 max-w-2xl">{heroSubheading}</p>
              <div className="flex gap-2 pt-2">
                <span className="px-4 py-2 bg-white text-brand-primary text-xs font-bold rounded-xl">{heroCta1Text}</span>
                <span className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl">{heroCta2Text}</span>
              </div>
            </div>

            {/* About & Mission Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-brand-bgLight border border-brand-border">
                <span className="text-[10px] font-bold text-brand-primary uppercase">Mission</span>
                <p className="text-xs text-brand-muted mt-1">{missionText}</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-bgLight border border-brand-border">
                <span className="text-[10px] font-bold text-brand-primary uppercase">Vision</span>
                <p className="text-xs text-brand-muted mt-1">{visionText}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
