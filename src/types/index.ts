export type UserRole = 'ADMIN' | 'NGO' | 'VOLUNTEER' | 'DONOR';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type DonationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: VerificationStatus;
  createdAt: string;
}

export interface NGO {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  darpanId: string;
  regNumber: string;
  foundedYear: number;
  contactPerson: string;
  address?: string;
  city: string;
  state?: string;
  website?: string;
  logo?: string;
  orgType?: string;
  taxExempt12A?: boolean;
  taxExempt80G?: boolean;
  authorizedPerson?: string;
  documents?: { name: string; url: string; verified: boolean }[];
  status: VerificationStatus;
  rejectionReason?: string;
  createdAt: string;
}

export const VOLUNTEER_EXPERIENCE_OPTIONS = [
  'Fresher (No Experience)',
  'Less than 1 Year',
  '1–2 Years',
  '3–5 Years',
  '5–10 Years',
  'More than 10 Years',
] as const;

export type VolunteerExperience = typeof VOLUNTEER_EXPERIENCE_OPTIONS[number];

export interface Volunteer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  emergencyContact: string;
  dob?: string;
  gender?: string;
  address?: string;
  state?: string;
  city: string;
  pincode: string;
  skills: string[];
  areasOfInterest?: string[];
  profilePhoto?: string;
  volunteerIdNumber?: string; // e.g. BF-VOL-2026-0128
  idCardIssued?: boolean;
  availability: string;
  hoursServed: number;
  experience?: string;
  experienceOrg?: string;
  otherSkills?: string;
  status: VerificationStatus;
  rejectionReason?: string;
  certificatesCount: number;
  idProofUrl?: string;
  createdAt: string;
}

export interface Donor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  panNumber?: string;
  isAnonymous: boolean;
  totalDonated: number;
  donationCount: number;
  createdAt: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  email: string;
  city: string;
  location: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  registeredAt: string;
}

export interface CampMeeting {
  id: string;
  title: string;
  campType: 'BLOOD_DONATION' | 'MEDICAL_CHECKUP' | 'EYE_CARE' | 'PEDIATRIC' | 'FOOD_RELIEF';
  organizerName: string;
  organizerNgoId?: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  targetBeneficiaries: number;
  volunteersNeeded: number;
  volunteersRegistered: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  description: string;
  bannerImage?: string;
  registeredVolunteerIds: string[];
  createdAt: string;
}

export interface NGOActivity {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  category: string;
  description: string;
  targetBeneficiaries: number;
  startDate: string;
  endDate: string;
  location: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  fundsAllocated?: number;
  volunteersRequired: number;
  createdAt: string;
}

export interface VolunteerRequest {
  id: string;
  ngoId: string;
  ngoName: string;
  campId?: string;
  title: string;
  skillsNeeded: string[];
  countNeeded: number;
  countAssigned: number;
  date: string;
  location: string;
  status: 'OPEN' | 'FULFILLED' | 'CLOSED';
}

export interface DonationRecord {
  id: string;
  donorId?: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorPan?: string;
  amount: number;
  utrReference: string;
  paymentMethod: 'UPI' | 'QR_SCAN' | 'NET_BANKING';
  campaignTitle: string;
  purpose?: string;
  otherPurpose?: string;
  notes?: string;
  status: DonationStatus;
  screenshotUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'BLOOD_CAMP' | 'MEDICAL_OUTREACH' | 'CHILD_WELFARE' | 'COMMUNITY' | 'DISASTER_RELIEF';
  imageUrl: string;
  uploadedByRole: UserRole;
  uploadedByName: string;
  isApproved: boolean;
  date: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole | 'ALL';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  createdAt: string;
}

export interface CMSServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  imageUrl: string;
  published: boolean;
  order: number;
}

export interface CMSImpactStory {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  location: string;
  images: string[];
  beneficiariesCount: number;
  published: boolean;
}

export interface CMSCampaignItem {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  description: string;
  imageUrl: string;
  status: 'ACTIVE' | 'GOAL_REACHED' | 'CLOSED';
  donorsCount: number;
  published: boolean;
}

export interface CMSAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  details: string;
}

export interface CMSDraft {
  id: string;
  savedAt: string;
  note: string;
  contentSnapshot: Partial<WebsiteContent>;
}

export interface CareHome {
  id: string;
  type: 'OLD_AGE' | 'CHILD_CARE';
  name: string;
  location: string;
  city: string;
  establishedYear: string;
  inmatesCount: number;
  capacity: number;
  description: string;
  facilities: string[];
  medicalSupport: string;
  images: string[];
  featuredImage: string;
  status: 'PUBLISHED' | 'DRAFT';
  careActivities: string[];
  urgentNeeds: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface CareHomeEvent {
  id: string;
  careHomeId: string;
  careHomeName: string;
  title: string;
  type: 'CELEBRATION' | 'MEDICAL_CAMP' | 'VOLUNTEER_VISIT' | 'WORKSHOP' | 'FOOD_DRIVE';
  date: string;
  time: string;
  description: string;
  images: string[];
  status: 'UPCOMING' | 'COMPLETED';
  volunteersNeeded: number;
  registeredVolunteers: number;
}

export interface CareHomeSupportCampaign {
  id: string;
  careHomeId: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
  itemNeeded: string;
  status: 'ACTIVE' | 'FULFILLED';
}

export interface WebsiteContent {
  heroHeading: string;
  heroSubheading: string;
  heroDescription?: string;
  heroBgImage?: string;
  heroSideImage?: string;
  heroCta1Text?: string;
  heroCta1Link?: string;
  heroCta2Text?: string;
  heroCta2Link?: string;
  heroVisible?: boolean;

  aboutHeading?: string;
  aboutText: string;
  aboutStory?: string;
  aboutImage?: string;
  missionText: string;
  visionText: string;

  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  emergencyPhone?: string;
  whatsappPhone?: string;
  upiId: string;
  upiName: string;
  qrCodeUrl: string;
  qrSettings?: {
    qrCodeUrl: string;
    upiId: string;
    accountHolderName: string;
    paymentInstructions: string;
    isPublished: boolean;
    updatedAt: string;
  };

  footerDescription?: string;
  copyrightText?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };

  stats: {
    livesImpacted: number;
    volunteersActive: number;
    campsOrganized: number;
    donationsRaised: number;
  };

  statsConfig?: {
    livesImpacted: { label: string; baseline: number; enabled: boolean; format: string; icon: string };
    activeVolunteers: { label: string; baseline: number; enabled: boolean; format: string; icon: string };
    campsCount: { label: string; baseline: number; enabled: boolean; format: string; icon: string };
    welfareRaised: { label: string; baseline: number; enabled: boolean; format: string; icon: string };
    communityMembers: { label: string; baseline: number; enabled: boolean; format: string; icon: string };
    connectedReach: {
      label: string;
      enabled: boolean;
      source: 'COMBINED' | 'USERS' | 'VOLUNTEERS' | 'NGOS' | 'DONORS';
      format: string;
      icon: string;
    };
  };

  servicesList?: CMSServiceItem[];
  impactStoriesList?: CMSImpactStory[];
  donationCampaignsList?: CMSCampaignItem[];
  auditLogs?: CMSAuditLog[];
  drafts?: CMSDraft[];
  lastPublishedAt?: string;
}

export type BloodRequestPriority = 'NORMAL' | 'URGENT' | 'CRITICAL';
export type BloodRequestStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'DONOR_IDENTIFIED'
  | 'IN_PROGRESS'
  | 'FULFILLED'
  | 'CANCELLED';

export interface EmergencyBloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalLocation: string;
  city: string;
  state: string;
  requiredDate: string;
  priority: BloodRequestPriority;
  contactPerson: string;
  mobileNumber: string;
  additionalInfo?: string;
  status: BloodRequestStatus;
  matchedDonorCount?: number;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  campId: string;
  volunteerId: string;
  volunteerName: string;
  timestamp: string;
  status: 'PRESENT' | 'ABSENT' | 'MANUAL_OVERRIDE';
  notes?: string;
}

export interface ExpenditureRecord {
  id: string;
  campaignTitle: string;
  category: 'Food Donation' | 'Healthcare' | 'Blood Donation Camps' | 'Community Support' | 'Emergency Relief';
  amount: number;
  description: string;
  receiptUrl?: string;
  date: string;
  verifiedBy?: string;
  invoiceNumber?: string;
}

export type Language = 'en' | 'te';

export interface PasswordResetToken {
  id: string;
  token: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
}


