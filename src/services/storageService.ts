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
  EmergencyBloodRequest,
  AttendanceRecord,
  ExpenditureRecord,
} from '@/types';
import {
  INITIAL_USERS,
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
} from '@/data/initialData';

export const STORAGE_KEYS = {
  USERS: 'bf_users',
  CURRENT_USER: 'bf_current_user',
  NGOS: 'bf_ngos',
  VOLUNTEERS: 'bf_volunteers',
  DONORS: 'bf_donors',
  BLOOD_DONORS: 'bf_blood_donors',
  CAMPS: 'bf_camps',
  NGO_ACTIVITIES: 'bf_ngo_activities',
  VOLUNTEER_REQUESTS: 'bf_volunteer_requests',
  DONATIONS: 'bf_donations',
  GALLERY: 'bf_gallery',
  NOTIFICATIONS: 'bf_notifications',
  WEBSITE_CONTENT: 'bf_website_content',
  BLOOD_REQUESTS: 'bf_blood_requests',
  EXPENDITURES: 'bf_expenditures',
  ATTENDANCE: 'bf_attendance',
  LANGUAGE: 'bf_language',
  CARE_HOMES: 'bf_care_homes',
  CARE_HOME_EVENTS: 'bf_care_home_events',
  CARE_HOME_CAMPAIGNS: 'bf_care_home_campaigns',
};

const isBrowser = () => typeof window !== 'undefined';

// Cross-tab real-time communication channel
let syncChannel: BroadcastChannel | null = null;
if (isBrowser() && typeof BroadcastChannel !== 'undefined') {
  try {
    syncChannel = new BroadcastChannel('bf_realtime_sync');
    syncChannel.onmessage = (event) => {
      if (event.data?.key) {
        window.dispatchEvent(
          new CustomEvent('bf-storage-update', {
            detail: { key: event.data.key, value: event.data.value, fromBroadcast: true },
          })
        );
      }
    };
  } catch (e) {
    console.warn('BroadcastChannel initialization skipped', e);
  }
}

export const storageService = {
  getItem<T>(key: string, defaultValue: T): T {
    if (!isBrowser()) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        // Initialize with default value if absent
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      if (key === STORAGE_KEYS.USERS) {
        const parsed = JSON.parse(item);
        if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.some((u: any) => u.email === 'admin@bharathifoundation.org')) {
          const existingIds = new Set(Array.isArray(parsed) ? parsed.map((u: any) => u.id || u.email?.toLowerCase()?.trim()) : []);
          const merged = [
            ...(Array.isArray(parsed) ? parsed : []),
            ...INITIAL_USERS.filter((iu) => !existingIds.has(iu.id) && !existingIds.has(iu.email.toLowerCase().trim())),
          ];
          localStorage.setItem(key, JSON.stringify(merged));
          return merged as T;
        }
      }
      if (key === STORAGE_KEYS.WEBSITE_CONTENT) {
        const parsed = JSON.parse(item);
        if (!parsed.heroHeading || !parsed.heroHeading.includes('Lives Touched') || !parsed.missionText?.includes("mother's love")) {
          const updated = { ...parsed, ...defaultValue };
          localStorage.setItem(key, JSON.stringify(updated));
          return updated as T;
        }
      }
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch in-tab event
      window.dispatchEvent(new CustomEvent('bf-storage-update', { detail: { key, value } }));
      // Broadcast to other tabs/windows in real time
      if (syncChannel) {
        syncChannel.postMessage({ key, value });
      }
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  },

  removeItem(key: string): void {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('bf-storage-update', { detail: { key, value: null } }));
      if (syncChannel) {
        syncChannel.postMessage({ key, value: null });
      }
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
    }
  },

  // Initialize all storage on app boot
  initializeAll(): void {
    if (!isBrowser()) return;
    this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.getItem<NGO[]>(STORAGE_KEYS.NGOS, INITIAL_NGOS);
    this.getItem<Volunteer[]>(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    this.getItem<Donor[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS);
    this.getItem<BloodDonor[]>(STORAGE_KEYS.BLOOD_DONORS, INITIAL_BLOOD_DONORS);
    this.getItem<CampMeeting[]>(STORAGE_KEYS.CAMPS, INITIAL_CAMPS);
    this.getItem<NGOActivity[]>(STORAGE_KEYS.NGO_ACTIVITIES, INITIAL_NGO_ACTIVITIES);
    this.getItem<VolunteerRequest[]>(STORAGE_KEYS.VOLUNTEER_REQUESTS, INITIAL_VOLUNTEER_REQUESTS);
    this.getItem<DonationRecord[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
    this.getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.getItem<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
    this.getItem<EmergencyBloodRequest[]>(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS);
    this.getItem<ExpenditureRecord[]>(STORAGE_KEYS.EXPENDITURES, INITIAL_EXPENDITURES);
    this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },

  resetToDefaults(): void {
    if (!isBrowser()) return;
    this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setItem(STORAGE_KEYS.NGOS, INITIAL_NGOS);
    this.setItem(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    this.setItem(STORAGE_KEYS.DONORS, INITIAL_DONORS);
    this.setItem(STORAGE_KEYS.BLOOD_DONORS, INITIAL_BLOOD_DONORS);
    this.setItem(STORAGE_KEYS.CAMPS, INITIAL_CAMPS);
    this.setItem(STORAGE_KEYS.NGO_ACTIVITIES, INITIAL_NGO_ACTIVITIES);
    this.setItem(STORAGE_KEYS.VOLUNTEER_REQUESTS, INITIAL_VOLUNTEER_REQUESTS);
    this.setItem(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
    this.setItem(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.setItem(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
    this.setItem(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS);
    this.setItem(STORAGE_KEYS.EXPENDITURES, INITIAL_EXPENDITURES);
    this.setItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    this.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
};

