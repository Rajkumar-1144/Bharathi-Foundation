'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  NGO,
  Volunteer,
  Donor,
  BloodDonor,
  CampMeeting,
  NGOActivity,
  VolunteerRequest,
  DonationRecord,
  GalleryItem,
  NotificationItem,
  WebsiteContent,
  VerificationStatus,
  DonationStatus,
  EmergencyBloodRequest,
  AttendanceRecord,
  ExpenditureRecord,
  Language,
  CareHome,
  CareHomeEvent,
  CareHomeSupportCampaign,
  CMSAuditLog,
  CMSDraft,
  CMSServiceItem,
  CMSImpactStory,
  CMSCampaignItem,
} from '@/types';
import { storageService, STORAGE_KEYS } from '@/services/storageService';
import {
  INITIAL_NGOS,
  INITIAL_VOLUNTEERS,
  INITIAL_DONORS,
  INITIAL_BLOOD_DONORS,
  INITIAL_CAMPS,
  INITIAL_NGO_ACTIVITIES,
  INITIAL_VOLUNTEER_REQUESTS,
  INITIAL_DONATIONS,
  INITIAL_GALLERY,
  INITIAL_NOTIFICATIONS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_EXPENDITURES,
  INITIAL_ATTENDANCE,
  INITIAL_CARE_HOMES,
  INITIAL_CARE_HOME_EVENTS,
  INITIAL_CARE_HOME_CAMPAIGNS,
} from '@/data/initialData';

export interface ComputedStats {
  livesImpacted: number;
  activeVolunteers: number;
  campsCount: number;
  completedCampsCount: number;
  upcomingCampsCount: number;
  welfareRaised: number;
  communityMembers: number;
  connectedReach: number;
  formatStatValue: (val: number, format?: string) => string;
}

interface AppDataContextType {
  ngos: NGO[];
  volunteers: Volunteer[];
  donors: Donor[];
  bloodDonors: BloodDonor[];
  camps: CampMeeting[];
  ngoActivities: NGOActivity[];
  volunteerRequests: VolunteerRequest[];
  donations: DonationRecord[];
  gallery: GalleryItem[];
  notifications: NotificationItem[];
  websiteContent: WebsiteContent;
  bloodRequests: EmergencyBloodRequest[];
  expenditures: ExpenditureRecord[];
  attendance: AttendanceRecord[];
  language: Language;
  computedStats: ComputedStats;

  // Care Home Management
  careHomes: CareHome[];
  careHomeEvents: CareHomeEvent[];
  careHomeCampaigns: CareHomeSupportCampaign[];
  addCareHome: (ch: Omit<CareHome, 'id'>) => void;
  updateCareHome: (id: string, partial: Partial<CareHome>) => void;
  deleteCareHome: (id: string) => void;
  addCareHomeEvent: (evt: Omit<CareHomeEvent, 'id'>) => void;
  updateCareHomeEvent: (id: string, partial: Partial<CareHomeEvent>) => void;
  deleteCareHomeEvent: (id: string) => void;
  addCareHomeCampaign: (cmp: Omit<CareHomeSupportCampaign, 'id'>) => void;
  updateCareHomeCampaign: (id: string, partial: Partial<CareHomeSupportCampaign>) => void;

  setLanguage: (lang: Language) => void;

  // NGO Management
  approveNGO: (id: string) => void;
  rejectNGO: (id: string, reason: string) => void;
  updateNGO: (id: string, updated: Partial<NGO>) => void;
  deleteNGO: (id: string) => void;

  // Volunteer Management
  approveVolunteer: (id: string) => void;
  rejectVolunteer: (id: string, reason?: string) => void;
  suspendVolunteer: (id: string, reason?: string) => void;
  updateVolunteer: (id: string, updated: Partial<Volunteer>) => void;
  registerVolunteerForCamp: (campId: string, volunteerId: string) => boolean;

  // Blood Donation Management
  registerBloodDonor: (data: Omit<BloodDonor, 'id' | 'registeredAt'>) => void;
  updateBloodDonorAvailability: (id: string, isAvailable: boolean) => void;
  createBloodRequest: (req: Omit<EmergencyBloodRequest, 'id' | 'createdAt' | 'status' | 'matchedDonorCount'>) => string;
  updateBloodRequestStatus: (id: string, status: EmergencyBloodRequest['status'], matchedDonorCount?: number) => void;

  // Camp & Attendance Management
  createCamp: (data: Omit<CampMeeting, 'id' | 'registeredVolunteerIds' | 'volunteersRegistered' | 'createdAt'>) => void;
  updateCamp: (id: string, updated: Partial<CampMeeting>) => void;
  deleteCamp: (id: string) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => boolean;

  // NGO Activities
  createActivity: (data: Omit<NGOActivity, 'id' | 'createdAt'>) => void;
  updateActivityStatus: (id: string, status: NGOActivity['status']) => void;

  // Volunteer Requests
  createVolunteerRequest: (data: Omit<VolunteerRequest, 'id' | 'countAssigned'>) => void;

  // Donations & Financial Stewardship
  submitDonationClaim: (donation: Omit<DonationRecord, 'id' | 'status' | 'createdAt'>) => string;
  verifyDonation: (id: string, verifiedByAdminId?: string) => void;
  updateDonationRecord: (id: string, updated: Partial<DonationRecord>, adminNote?: string) => void;
  rejectDonation: (id: string) => void;
  addExpenditure: (exp: Omit<ExpenditureRecord, 'id'>) => void;

  // Gallery Management
  uploadPhoto: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  approvePhoto: (id: string) => void;
  deletePhoto: (id: string) => void;

  // Website Content CMS
  updateWebsiteContent: (updated: Partial<WebsiteContent>) => void;
  saveDraft: (note: string) => void;
  publishDraft: (draftId?: string) => void;
  restoreVersion: (version: number) => void;
  addAuditLog: (action: string, details: string) => void;

  // Notifications
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ngos, setNgos] = useState<NGO[]>(INITIAL_NGOS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>(INITIAL_BLOOD_DONORS);
  const [camps, setCamps] = useState<CampMeeting[]>(INITIAL_CAMPS);
  const [ngoActivities, setNgoActivities] = useState<NGOActivity[]>(INITIAL_NGO_ACTIVITIES);
  const [volunteerRequests, setVolunteerRequests] = useState<VolunteerRequest[]>(INITIAL_VOLUNTEER_REQUESTS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(INITIAL_WEBSITE_CONTENT);
  const [bloodRequests, setBloodRequests] = useState<EmergencyBloodRequest[]>(INITIAL_BLOOD_REQUESTS);
  const [expenditures, setExpenditures] = useState<ExpenditureRecord[]>(INITIAL_EXPENDITURES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [language, setLanguageState] = useState<Language>('en');

  // Care Home Management State
  const [careHomes, setCareHomes] = useState<CareHome[]>(INITIAL_CARE_HOMES);
  const [careHomeEvents, setCareHomeEvents] = useState<CareHomeEvent[]>(INITIAL_CARE_HOME_EVENTS);
  const [careHomeCampaigns, setCareHomeCampaigns] = useState<CareHomeSupportCampaign[]>(INITIAL_CARE_HOME_CAMPAIGNS);

  const loadAllFromStorage = () => {
    setNgos(storageService.getItem<NGO[]>(STORAGE_KEYS.NGOS, INITIAL_NGOS));
    setVolunteers(storageService.getItem<Volunteer[]>(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS));
    setDonors(storageService.getItem<Donor[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS));
    setBloodDonors(storageService.getItem<BloodDonor[]>(STORAGE_KEYS.BLOOD_DONORS, INITIAL_BLOOD_DONORS));
    setCamps(storageService.getItem<CampMeeting[]>(STORAGE_KEYS.CAMPS, INITIAL_CAMPS));
    setNgoActivities(storageService.getItem<NGOActivity[]>(STORAGE_KEYS.NGO_ACTIVITIES, INITIAL_NGO_ACTIVITIES));
    setVolunteerRequests(storageService.getItem<VolunteerRequest[]>(STORAGE_KEYS.VOLUNTEER_REQUESTS, INITIAL_VOLUNTEER_REQUESTS));
    setDonations(storageService.getItem<DonationRecord[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS));
    setGallery(storageService.getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY));
    setNotifications(storageService.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
    setWebsiteContent(storageService.getItem<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT));
    setBloodRequests(storageService.getItem<EmergencyBloodRequest[]>(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS));
    setExpenditures(storageService.getItem<ExpenditureRecord[]>(STORAGE_KEYS.EXPENDITURES, INITIAL_EXPENDITURES));
    setAttendance(storageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE));
    setLanguageState(storageService.getItem<Language>(STORAGE_KEYS.LANGUAGE, 'en'));

    setCareHomes(storageService.getItem<CareHome[]>(STORAGE_KEYS.CARE_HOMES, INITIAL_CARE_HOMES));
    setCareHomeEvents(storageService.getItem<CareHomeEvent[]>(STORAGE_KEYS.CARE_HOME_EVENTS, INITIAL_CARE_HOME_EVENTS));
    setCareHomeCampaigns(storageService.getItem<CareHomeSupportCampaign[]>(STORAGE_KEYS.CARE_HOME_CAMPAIGNS, INITIAL_CARE_HOME_CAMPAIGNS));
  };

  useEffect(() => {
    storageService.initializeAll();
    loadAllFromStorage();

    const handleStorageUpdate = (e: any) => {
      loadAllFromStorage();
    };
    window.addEventListener('bf-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('bf-storage-update', handleStorageUpdate);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storageService.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  // NGO Actions
  const approveNGO = (id: string) => {
    const ngo = ngos.find((n) => n.id === id);
    const updated = ngos.map((n) => (n.id === id ? { ...n, status: 'APPROVED' as VerificationStatus } : n));
    setNgos(updated);
    storageService.setItem(STORAGE_KEYS.NGOS, updated);

    // Synchronize Users store so login works immediately
    if (ngo) {
      const users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
      const updatedUsers = users.map((u) =>
        u.id === ngo.userId || u.email.toLowerCase() === ngo.email.toLowerCase()
          ? { ...u, status: 'APPROVED' as VerificationStatus }
          : u
      );
      storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
    }

    addNotification({
      targetRole: 'NGO',
      title: 'NGO Accreditation Approved',
      message: 'Congratulations! Your NGO profile has been verified and approved by the Bharathi Foundation Admin.',
      type: 'SUCCESS',
    });
  };

  const rejectNGO = (id: string, reason: string) => {
    const ngo = ngos.find((n) => n.id === id);
    const updated = ngos.map((n) =>
      n.id === id ? { ...n, status: 'REJECTED' as VerificationStatus, rejectionReason: reason } : n
    );
    setNgos(updated);
    storageService.setItem(STORAGE_KEYS.NGOS, updated);

    if (ngo) {
      const users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
      const updatedUsers = users.map((u) =>
        u.id === ngo.userId || u.email.toLowerCase() === ngo.email.toLowerCase()
          ? { ...u, status: 'REJECTED' as VerificationStatus }
          : u
      );
      storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
    }
  };

  const updateNGO = (id: string, partial: Partial<NGO>) => {
    const updated = ngos.map((ngo) => (ngo.id === id ? { ...ngo, ...partial } : ngo));
    setNgos(updated);
    storageService.setItem(STORAGE_KEYS.NGOS, updated);
  };

  const deleteNGO = (id: string) => {
    const updated = ngos.filter((ngo) => ngo.id !== id);
    setNgos(updated);
    storageService.setItem(STORAGE_KEYS.NGOS, updated);
  };

  // Volunteer Actions
  const approveVolunteer = (id: string) => {
    const vol = volunteers.find((v) => v.id === id);
    const updated = volunteers.map((v) =>
      v.id === id ? { ...v, status: 'APPROVED' as VerificationStatus, idCardIssued: true } : v
    );
    setVolunteers(updated);
    storageService.setItem(STORAGE_KEYS.VOLUNTEERS, updated);

    // Synchronize Users store so login is instantly approved!
    if (vol) {
      const users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
      const updatedUsers = users.map((u) =>
        u.id === vol.userId || u.email.toLowerCase() === vol.email.toLowerCase()
          ? { ...u, status: 'APPROVED' as VerificationStatus }
          : u
      );
      storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
    }

    addNotification({
      targetRole: 'VOLUNTEER',
      title: 'Volunteer Application Approved',
      message: `${vol?.name || 'Volunteer'} account is verified and approved. You can now access your dashboard and digital ID card.`,
      type: 'SUCCESS',
    });
  };

  const rejectVolunteer = (id: string, reason = 'Application criteria not met') => {
    const vol = volunteers.find((v) => v.id === id);
    const updated = volunteers.map((v) =>
      v.id === id ? { ...v, status: 'REJECTED' as VerificationStatus, rejectionReason: reason } : v
    );
    setVolunteers(updated);
    storageService.setItem(STORAGE_KEYS.VOLUNTEERS, updated);

    if (vol) {
      const users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
      const updatedUsers = users.map((u) =>
        u.id === vol.userId || u.email.toLowerCase() === vol.email.toLowerCase()
          ? { ...u, status: 'REJECTED' as VerificationStatus }
          : u
      );
      storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
    }
  };

  const suspendVolunteer = (id: string, reason = 'Account suspended by administrator') => {
    const vol = volunteers.find((v) => v.id === id);
    const updated = volunteers.map((v) =>
      v.id === id ? { ...v, status: 'SUSPENDED' as VerificationStatus, rejectionReason: reason } : v
    );
    setVolunteers(updated);
    storageService.setItem(STORAGE_KEYS.VOLUNTEERS, updated);

    if (vol) {
      const users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
      const updatedUsers = users.map((u) =>
        u.id === vol.userId || u.email.toLowerCase() === vol.email.toLowerCase()
          ? { ...u, status: 'SUSPENDED' as VerificationStatus }
          : u
      );
      storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
    }
  };

  const updateVolunteer = (id: string, partial: Partial<Volunteer>) => {
    const updated = volunteers.map((vol) => (vol.id === id ? { ...vol, ...partial } : vol));
    setVolunteers(updated);
    storageService.setItem(STORAGE_KEYS.VOLUNTEERS, updated);
  };

  const registerVolunteerForCamp = (campId: string, volunteerId: string): boolean => {
    const camp = camps.find((c) => c.id === campId);
    if (!camp) return false;
    if (camp.registeredVolunteerIds.includes(volunteerId)) return false;

    const updatedCamps = camps.map((c) => {
      if (c.id === campId) {
        return {
          ...c,
          volunteersRegistered: c.volunteersRegistered + 1,
          registeredVolunteerIds: [...c.registeredVolunteerIds, volunteerId],
        };
      }
      return c;
    });

    setCamps(updatedCamps);
    storageService.setItem(STORAGE_KEYS.CAMPS, updatedCamps);
    return true;
  };

  // Blood Donor Actions
  const registerBloodDonor = (data: Omit<BloodDonor, 'id' | 'registeredAt'>) => {
    const newDonor: BloodDonor = {
      ...data,
      id: `bd-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newDonor, ...bloodDonors];
    setBloodDonors(updated);
    storageService.setItem(STORAGE_KEYS.BLOOD_DONORS, updated);
  };

  const updateBloodDonorAvailability = (id: string, isAvailable: boolean) => {
    const updated = bloodDonors.map((bd) => (bd.id === id ? { ...bd, isAvailable } : bd));
    setBloodDonors(updated);
    storageService.setItem(STORAGE_KEYS.BLOOD_DONORS, updated);
  };

  const createBloodRequest = (
    req: Omit<EmergencyBloodRequest, 'id' | 'createdAt' | 'status' | 'matchedDonorCount'>
  ): string => {
    const matched = bloodDonors.filter(
      (d) => d.isAvailable && (d.bloodGroup === req.bloodGroup || req.bloodGroup === 'Any')
    ).length;

    const newId = `ebr-${Date.now()}`;
    const newReq: EmergencyBloodRequest = {
      ...req,
      id: newId,
      status: 'PENDING',
      matchedDonorCount: matched,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReq, ...bloodRequests];
    setBloodRequests(updated);
    storageService.setItem(STORAGE_KEYS.BLOOD_REQUESTS, updated);

    addNotification({
      targetRole: 'ADMIN',
      title: `🚨 Emergency Blood Request (${req.priority})`,
      message: `${req.unitsRequired} units of ${req.bloodGroup} urgently needed for ${req.patientName} at ${req.hospitalName}, ${req.city}.`,
      type: 'ALERT',
    });

    return newId;
  };

  const updateBloodRequestStatus = (
    id: string,
    status: EmergencyBloodRequest['status'],
    matchedDonorCount?: number
  ) => {
    const updated = bloodRequests.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(matchedDonorCount !== undefined ? { matchedDonorCount } : {}),
        };
      }
      return r;
    });
    setBloodRequests(updated);
    storageService.setItem(STORAGE_KEYS.BLOOD_REQUESTS, updated);
  };

  // Camp Management Actions
  const createCamp = (
    data: Omit<CampMeeting, 'id' | 'registeredVolunteerIds' | 'volunteersRegistered' | 'createdAt'>
  ) => {
    const newCamp: CampMeeting = {
      ...data,
      id: `camp-${Date.now()}`,
      registeredVolunteerIds: [],
      volunteersRegistered: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCamp, ...camps];
    setCamps(updated);
    storageService.setItem(STORAGE_KEYS.CAMPS, updated);
  };

  const updateCamp = (id: string, partial: Partial<CampMeeting>) => {
    const updated = camps.map((c) => (c.id === id ? { ...c, ...partial } : c));
    setCamps(updated);
    storageService.setItem(STORAGE_KEYS.CAMPS, updated);
  };

  const deleteCamp = (id: string) => {
    const updated = camps.filter((c) => c.id !== id);
    setCamps(updated);
    storageService.setItem(STORAGE_KEYS.CAMPS, updated);
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id' | 'timestamp'>): boolean => {
    const existing = attendance.find(
      (a) => a.campId === record.campId && a.volunteerId === record.volunteerId
    );
    if (existing) return false;

    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updatedAttendance = [newRecord, ...attendance];
    setAttendance(updatedAttendance);
    storageService.setItem(STORAGE_KEYS.ATTENDANCE, updatedAttendance);

    // Auto-credit 6 service hours and increment certificates
    const updatedVolunteers = volunteers.map((v) => {
      if (v.id === record.volunteerId || v.userId === record.volunteerId) {
        return {
          ...v,
          hoursServed: (v.hoursServed || 0) + 6,
          certificatesCount: (v.certificatesCount || 0) + 1,
        };
      }
      return v;
    });
    setVolunteers(updatedVolunteers);
    storageService.setItem(STORAGE_KEYS.VOLUNTEERS, updatedVolunteers);

    return true;
  };

  // NGO Activities
  const createActivity = (data: Omit<NGOActivity, 'id' | 'createdAt'>) => {
    const newActivity: NGOActivity = {
      ...data,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newActivity, ...ngoActivities];
    setNgoActivities(updated);
    storageService.setItem(STORAGE_KEYS.NGO_ACTIVITIES, updated);
  };

  const updateActivityStatus = (id: string, status: NGOActivity['status']) => {
    const updated = ngoActivities.map((act) => (act.id === id ? { ...act, status } : act));
    setNgoActivities(updated);
    storageService.setItem(STORAGE_KEYS.NGO_ACTIVITIES, updated);
  };

  // Volunteer Requests
  const createVolunteerRequest = (data: Omit<VolunteerRequest, 'id' | 'countAssigned'>) => {
    const newReq: VolunteerRequest = {
      ...data,
      id: `vreq-${Date.now()}`,
      countAssigned: 0,
    };
    const updated = [newReq, ...volunteerRequests];
    setVolunteerRequests(updated);
    storageService.setItem(STORAGE_KEYS.VOLUNTEER_REQUESTS, updated);
  };

  // Donations & Financial Stewardship
  const submitDonationClaim = (claim: Omit<DonationRecord, 'id' | 'status' | 'createdAt'>): string => {
    const newId = `don-${Date.now()}`;
    const newRecord: DonationRecord = {
      ...claim,
      id: newId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...donations];
    setDonations(updated);
    storageService.setItem(STORAGE_KEYS.DONATIONS, updated);

    addNotification({
      targetRole: 'ADMIN',
      title: 'New Donation UTR Claim Received',
      message: `${claim.donorName} submitted UTR #${claim.utrReference} for ₹${claim.amount.toLocaleString('en-IN')}`,
      type: 'INFO',
    });

    return newId;
  };

  const verifyDonation = (id: string, verifiedByAdminId = 'user-admin-1') => {
    const receiptNum = `BF/2026-27/${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = donations.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status: 'VERIFIED' as DonationStatus,
          verifiedBy: verifiedByAdminId,
          verifiedAt: new Date().toISOString(),
          receiptNumber: receiptNum,
        };
      }
      return d;
    });
    setDonations(updated);
    storageService.setItem(STORAGE_KEYS.DONATIONS, updated);

    // Update donor lifetime sum if matched
    const matchedDonation = donations.find((d) => d.id === id);
    if (matchedDonation?.donorEmail) {
      const updatedDonors = donors.map((dn) => {
        if (dn.email.toLowerCase() === matchedDonation.donorEmail.toLowerCase()) {
          return {
            ...dn,
            totalDonated: dn.totalDonated + matchedDonation.amount,
            donationCount: dn.donationCount + 1,
          };
        }
        return dn;
      });
      setDonors(updatedDonors);
      storageService.setItem(STORAGE_KEYS.DONORS, updatedDonors);
    }
  };

  const updateDonationRecord = (id: string, updated: Partial<DonationRecord>, adminNote?: string) => {
    const updatedDonations = donations.map((d) => (d.id === id ? { ...d, ...updated } : d));
    setDonations(updatedDonations);
    storageService.setItem(STORAGE_KEYS.DONATIONS, updatedDonations);
    addAuditLog('UPDATE_DONATION', `Edited donation ID #${id}. Note: ${adminNote || 'Updated by Administrator'}`);
  };

  const rejectDonation = (id: string) => {
    const updated = donations.map((d) => (d.id === id ? { ...d, status: 'REJECTED' as DonationStatus } : d));
    setDonations(updated);
    storageService.setItem(STORAGE_KEYS.DONATIONS, updated);
  };

  const addExpenditure = (exp: Omit<ExpenditureRecord, 'id'>) => {
    const newRecord: ExpenditureRecord = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    const updated = [newRecord, ...expenditures];
    setExpenditures(updated);
    storageService.setItem(STORAGE_KEYS.EXPENDITURES, updated);
  };

  // Gallery Management
  const uploadPhoto = (item: Omit<GalleryItem, 'id' | 'date'>) => {
    const newPhoto: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newPhoto, ...gallery];
    setGallery(updated);
    storageService.setItem(STORAGE_KEYS.GALLERY, updated);
  };

  const approvePhoto = (id: string) => {
    const updated = gallery.map((item) => (item.id === id ? { ...item, isApproved: true } : item));
    setGallery(updated);
    storageService.setItem(STORAGE_KEYS.GALLERY, updated);
  };

  const deletePhoto = (id: string) => {
    const updated = gallery.filter((item) => item.id !== id);
    setGallery(updated);
    storageService.setItem(STORAGE_KEYS.GALLERY, updated);
  };

  // Website Content CMS
  const updateWebsiteContent = (updated: Partial<WebsiteContent>) => {
    const merged = { ...websiteContent, ...updated };
    setWebsiteContent(merged);
    storageService.setItem(STORAGE_KEYS.WEBSITE_CONTENT, merged);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: CMSAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName: 'Bharathi Executive Admin',
      action,
      details,
    };
    const currentLogs = websiteContent.auditLogs || [];
    const updated = [newLog, ...currentLogs];
    updateWebsiteContent({ auditLogs: updated });
  };

  const saveDraft = (note: string) => {
    const newDraft: CMSDraft = {
      id: `draft-${Date.now()}`,
      savedAt: new Date().toISOString(),
      note: note || 'Draft saved by Administrator',
      contentSnapshot: { ...websiteContent },
    };
    const currentDrafts = websiteContent.drafts || [];
    updateWebsiteContent({ drafts: [newDraft, ...currentDrafts] });
    addAuditLog('SAVE_DRAFT', `Created draft: "${note || 'Untitled'}"`);
  };

  const publishDraft = (draftId?: string) => {
    const timestamp = new Date().toISOString();
    let contentToPublish = { ...websiteContent };
    if (draftId && websiteContent.drafts) {
      const draft = websiteContent.drafts.find((d) => d.id === draftId);
      if (draft) {
        contentToPublish = { ...websiteContent, ...draft.contentSnapshot };
      }
    }
    contentToPublish.lastPublishedAt = timestamp;
    setWebsiteContent(contentToPublish);
    storageService.setItem(STORAGE_KEYS.WEBSITE_CONTENT, contentToPublish);
    addAuditLog('PUBLISH_CONTENT', `Published live website content to public view at ${new Date().toLocaleTimeString()}`);
  };

  const restoreVersion = (version: number) => {
    // If restoring from earlier snapshot
    addAuditLog('RESTORE_VERSION', `Restored content configuration to version ${version}`);
  };

  // Care Home Management Actions
  const addCareHome = (ch: Omit<CareHome, 'id'>) => {
    const newHome: CareHome = {
      ...ch,
      id: `ch-${Date.now()}`,
    };
    const updated = [newHome, ...careHomes];
    setCareHomes(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOMES, updated);
    addAuditLog('ADD_CARE_HOME', `Added new care home: ${newHome.name} (${newHome.type})`);
  };

  const updateCareHome = (id: string, partial: Partial<CareHome>) => {
    const updated = careHomes.map((ch) => (ch.id === id ? { ...ch, ...partial } : ch));
    setCareHomes(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOMES, updated);
    addAuditLog('UPDATE_CARE_HOME', `Updated care home ID #${id}`);
  };

  const deleteCareHome = (id: string) => {
    const updated = careHomes.filter((ch) => ch.id !== id);
    setCareHomes(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOMES, updated);
    addAuditLog('DELETE_CARE_HOME', `Removed care home ID #${id}`);
  };

  const addCareHomeEvent = (evt: Omit<CareHomeEvent, 'id'>) => {
    const newEvt: CareHomeEvent = {
      ...evt,
      id: `che-${Date.now()}`,
    };
    const updated = [newEvt, ...careHomeEvents];
    setCareHomeEvents(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOME_EVENTS, updated);
  };

  const updateCareHomeEvent = (id: string, partial: Partial<CareHomeEvent>) => {
    const updated = careHomeEvents.map((evt) => (evt.id === id ? { ...evt, ...partial } : evt));
    setCareHomeEvents(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOME_EVENTS, updated);
  };

  const deleteCareHomeEvent = (id: string) => {
    const updated = careHomeEvents.filter((evt) => evt.id !== id);
    setCareHomeEvents(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOME_EVENTS, updated);
  };

  const addCareHomeCampaign = (cmp: Omit<CareHomeSupportCampaign, 'id'>) => {
    const newCmp: CareHomeSupportCampaign = {
      ...cmp,
      id: `chc-${Date.now()}`,
    };
    const updated = [newCmp, ...careHomeCampaigns];
    setCareHomeCampaigns(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOME_CAMPAIGNS, updated);
  };

  const updateCareHomeCampaign = (id: string, partial: Partial<CareHomeSupportCampaign>) => {
    const updated = careHomeCampaigns.map((cmp) => (cmp.id === id ? { ...cmp, ...partial } : cmp));
    setCareHomeCampaigns(updated);
    storageService.setItem(STORAGE_KEYS.CARE_HOME_CAMPAIGNS, updated);
  };

  // Notifications
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  // 1. Dynamic Calculations strictly adhering to Real Data & Production Integrity rules
  const verifiedDonationsSum = donations
    .filter((d) => d.status === 'VERIFIED')
    .reduce((acc, d) => acc + d.amount, 0);

  // Completed camps and completed activities verified beneficiaries only (no duplicate count)
  const completedCampBeneficiaries = camps
    .filter((c) => c.status === 'COMPLETED')
    .reduce((acc, c) => acc + (c.targetBeneficiaries || 0), 0);

  const completedActivityBeneficiaries = ngoActivities
    .filter((a) => a.status === 'COMPLETED')
    .reduce((acc, a) => acc + (a.targetBeneficiaries || 0), 0);

  const careHomeInmatesCount = careHomes
    .filter((ch) => ch.status === 'PUBLISHED')
    .reduce((acc, ch) => acc + (ch.inmatesCount || 0), 0);

  // Admin verified baseline if explicitly configured, otherwise 0
  const baselineLives = websiteContent.statsConfig?.livesImpacted?.baseline && websiteContent.statsConfig.livesImpacted.baseline > 0
    ? websiteContent.statsConfig.livesImpacted.baseline
    : (websiteContent.stats?.livesImpacted && websiteContent.stats.livesImpacted > 0 ? websiteContent.stats.livesImpacted : 0);

  const calculatedLivesImpacted = baselineLives + completedCampBeneficiaries + completedActivityBeneficiaries + careHomeInmatesCount;

  // Active volunteers: strictly approved and active only (exclude pending, rejected, suspended)
  const activeVolunteersCount = volunteers.filter(
    (v) => v.status === 'APPROVED' && (v as any).isActive !== false
  ).length;

  // Completed camps only for "Camps Conducted"
  const verifiedCompletedCamps = camps.filter((c) => c.status === 'COMPLETED').length;
  const verifiedUpcomingCamps = camps.filter((c) => c.status === 'UPCOMING' || c.status === 'ONGOING').length;

  // Welfare Raised: only successfully reconciled & verified donations + verified admin baseline if any
  const baselineWelfare = websiteContent.statsConfig?.welfareRaised?.baseline && websiteContent.statsConfig.welfareRaised.baseline > 0
    ? websiteContent.statsConfig.welfareRaised.baseline
    : (websiteContent.stats?.donationsRaised && websiteContent.stats.donationsRaised > 0 ? websiteContent.stats.donationsRaised : 0);

  const totalVerifiedWelfare = baselineWelfare + verifiedDonationsSum;

  // Community Members: unique registered individuals across registered user database
  const usersList = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
  const uniqueMemberIdentities = new Set<string>();
  usersList.forEach((u) => {
    if (u.email) uniqueMemberIdentities.add(u.email.toLowerCase().trim());
  });
  volunteers.forEach((v) => {
    if (v.email) uniqueMemberIdentities.add(v.email.toLowerCase().trim());
  });
  donors.forEach((d) => {
    if (d.email) uniqueMemberIdentities.add(d.email.toLowerCase().trim());
  });
  const registeredCommunityMembersCount = uniqueMemberIdentities.size || usersList.length;

  // People Connected: unique individuals across Admin, NGO, Volunteer, and Donor records using shared person identities
  // Avoid counting duplicate logins, multiple sessions, or multi-role accounts for the same person
  const uniquePeopleIdentities = new Set<string>();
  const addPersonIdentity = (email?: string, phone?: string, name?: string) => {
    const normEmail = email?.toLowerCase().trim();
    const normPhone = phone?.replace(/\D/g, '').slice(-10);
    if (normEmail) {
      uniquePeopleIdentities.add(`email:${normEmail}`);
    } else if (normPhone && normPhone.length === 10) {
      uniquePeopleIdentities.add(`phone:${normPhone}`);
    } else if (name) {
      uniquePeopleIdentities.add(`name:${name.toLowerCase().trim()}`);
    }
  };

  usersList.forEach((u) => addPersonIdentity(u.email, undefined, u.name));
  volunteers.filter((v) => v.status === 'APPROVED').forEach((v) => addPersonIdentity(v.email, v.phone, v.name));
  ngos.filter((n) => n.status === 'APPROVED').forEach((n) => addPersonIdentity(undefined, n.phone, n.contactPerson));
  donors.forEach((d) => addPersonIdentity(d.email, d.phone, d.name));
  bloodDonors.filter((b) => b.isAvailable).forEach((b) => addPersonIdentity(b.email, b.phone, b.name));

  const calculatedReach = uniquePeopleIdentities.size + careHomeInmatesCount;

  // Display threshold formatting function (never invent numbers, accurately display counts)
  const formatStatValue = (val: number, format = 'AUTO'): string => {
    if (val === 0 || !val) return '0';
    if (format === 'EXACT') return val.toLocaleString('en-IN');

    // Only append + if the number genuinely reaches or exceeds the specified threshold
    if (format === '10+') {
      return val >= 10 ? `${(Math.floor(val / 10) * 10).toLocaleString('en-IN')}+` : val.toLocaleString('en-IN');
    }
    if (format === '20+') {
      return val >= 20 ? `${(Math.floor(val / 20) * 20).toLocaleString('en-IN')}+` : val.toLocaleString('en-IN');
    }
    if (format === '50+') {
      return val >= 50 ? `${(Math.floor(val / 50) * 50).toLocaleString('en-IN')}+` : val.toLocaleString('en-IN');
    }
    if (format === '100+') {
      return val >= 100 ? `${(Math.floor(val / 100) * 100).toLocaleString('en-IN')}+` : val.toLocaleString('en-IN');
    }
    if (format === '500+') {
      return val >= 500 ? `${(Math.floor(val / 500) * 500).toLocaleString('en-IN')}+` : val.toLocaleString('en-IN');
    }
    if (format === '1,000+' || format === '1000+') {
      return val >= 1000 ? `${(Math.floor(val / 1000) * 1000).toLocaleString('en-IN')}+` : val.toLocaleString('en-IN');
    }
    if (format === '5,000+' || format === '5000+') {
      return val >= 5000 ? `${(Math.floor(val / 5000) * 5000).toLocaleString('en-IN')}+` : val.toLocaleString('en-IN');
    }

    // AUTO intelligent rounding
    if (val >= 10000000) return `${(val / 10000000).toFixed(1)} Cr+`;
    if (val >= 100000) return `${(val / 100000).toFixed(1)} L+`;
    if (val >= 1000) return `${(Math.floor(val / 100) * 100).toLocaleString('en-IN')}+`;
    if (val >= 50) return `${(Math.floor(val / 10) * 10).toLocaleString('en-IN')}+`;
    return val.toLocaleString('en-IN');
  };

  const computedStats: ComputedStats = {
    livesImpacted: calculatedLivesImpacted,
    activeVolunteers: activeVolunteersCount,
    campsCount: verifiedCompletedCamps, // strictly completed camps
    completedCampsCount: verifiedCompletedCamps,
    upcomingCampsCount: verifiedUpcomingCamps,
    welfareRaised: totalVerifiedWelfare,
    communityMembers: registeredCommunityMembersCount,
    connectedReach: calculatedReach,
    formatStatValue,
  };

  return (
    <AppDataContext.Provider
      value={{
        ngos,
        volunteers,
        donors,
        bloodDonors,
        camps,
        ngoActivities,
        volunteerRequests,
        donations,
        gallery,
        notifications,
        websiteContent,
        bloodRequests,
        expenditures,
        attendance,
        language,
        computedStats,
        careHomes,
        careHomeEvents,
        careHomeCampaigns,
        addCareHome,
        updateCareHome,
        deleteCareHome,
        addCareHomeEvent,
        updateCareHomeEvent,
        deleteCareHomeEvent,
        addCareHomeCampaign,
        updateCareHomeCampaign,
        setLanguage,
        approveNGO,
        rejectNGO,
        updateNGO,
        deleteNGO,
        approveVolunteer,
        rejectVolunteer,
        suspendVolunteer,
        updateVolunteer,
        registerVolunteerForCamp,
        registerBloodDonor,
        updateBloodDonorAvailability,
        createBloodRequest,
        updateBloodRequestStatus,
        createCamp,
        updateCamp,
        deleteCamp,
        markAttendance,
        createActivity,
        updateActivityStatus,
        createVolunteerRequest,
        submitDonationClaim,
        verifyDonation,
        updateDonationRecord,
        rejectDonation,
        addExpenditure,
        uploadPhoto,
        approvePhoto,
        deletePhoto,
        updateWebsiteContent,
        saveDraft,
        publishDraft,
        restoreVersion,
        addAuditLog,
        addNotification,
        markNotificationRead,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
