'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole, VerificationStatus } from '@/types';
import { storageService, STORAGE_KEYS } from '@/services/storageService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; message: string; redirectUrl?: string }>;
  logout: () => void;
  registerUser: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    extra?: any;
  }) => Promise<{ success: boolean; message: string; redirectUrl?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo account password mappings
const DEMO_PASSWORDS: Record<string, string> = {
  'admin@bharathifoundation.org': 'Admin@123',
  'ngo@bharathifoundation.org': 'Ngo@123',
  'volunteer@bharathifoundation.org': 'Volunteer@123',
  'donor@bharathifoundation.org': 'Donor@123',
  'pooja.h@yahoo.com': 'Volunteer@123',
  'contact@jeevanraksha.org': 'Ngo@123',
};

const ROLE_REDIRECTS: Record<UserRole, string> = {
  ADMIN: '/admin',
  NGO: '/ngo',
  VOLUNTEER: '/volunteer',
  DONOR: '/donor',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    storageService.initializeAll();
    const storedUser = storageService.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setIsLoading(false);

    const handleStorageUpdate = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.CURRENT_USER) {
        setCurrentUser(e.detail.value);
      }
    };
    window.addEventListener('bf-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('bf-storage-update', handleStorageUpdate);
  }, []);

  const login = async (
    email: string,
    password: string,
    selectedRole?: UserRole
  ): Promise<{ success: boolean; message: string; redirectUrl?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);

    // Check demo password or default registered user password check
    const demoPassword = DEMO_PASSWORDS[trimmedEmail];
    const storedPassword = typeof window !== 'undefined' ? localStorage.getItem(`bf_pwd_${trimmedEmail}`) : null;

    const validPassword = demoPassword ? demoPassword === password : storedPassword ? storedPassword === password : password.length >= 6;

    if (!validPassword) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    const matchedUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!matchedUser) {
      return { success: false, message: 'Account not found. Please register or check your email address.' };
    }

    if (selectedRole && matchedUser.role !== selectedRole) {
      return {
        success: false,
        message: `Account role mismatch: This account is registered as a ${matchedUser.role}. Please select the correct login tab.`,
      };
    }

    // Role-based status check
    if (matchedUser.role === 'VOLUNTEER') {
      const volunteers = storageService.getItem<any[]>(STORAGE_KEYS.VOLUNTEERS, []);
      const vol = volunteers.find((v) => v.email.toLowerCase() === trimmedEmail || v.userId === matchedUser.id);
      const effectiveStatus = vol?.status || matchedUser.status;

      if (effectiveStatus === 'PENDING') {
        return {
          success: false,
          message: 'Your account is awaiting Admin approval.',
        };
      }
      if (effectiveStatus === 'REJECTED') {
        return {
          success: false,
          message: 'Your registration has been rejected. Please contact the foundation.',
        };
      }
      if (effectiveStatus === 'SUSPENDED') {
        return {
          success: false,
          message: 'Your account has been suspended. Please contact the foundation administrator.',
        };
      }
      if (effectiveStatus !== 'APPROVED') {
        return {
          success: false,
          message: 'Your account is awaiting Admin approval.',
        };
      }
    }

    if (matchedUser.role === 'NGO') {
      const ngos = storageService.getItem<any[]>(STORAGE_KEYS.NGOS, []);
      const ngo = ngos.find((n) => n.email.toLowerCase() === trimmedEmail || n.userId === matchedUser.id);
      const effectiveStatus = ngo?.status || matchedUser.status;

      if (effectiveStatus === 'PENDING') {
        return {
          success: false,
          message: 'Your NGO accreditation is awaiting Admin approval.',
        };
      }
      if (effectiveStatus === 'REJECTED') {
        return {
          success: false,
          message: ngo?.rejectionReason
            ? `Your NGO application was rejected. Reason: ${ngo.rejectionReason}`
            : 'Your NGO application was rejected. Please contact the foundation.',
        };
      }
      if (effectiveStatus === 'SUSPENDED') {
        return {
          success: false,
          message: 'Your NGO account has been suspended. Please contact the foundation administrator.',
        };
      }
      if (effectiveStatus !== 'APPROVED') {
        return {
          success: false,
          message: 'Your NGO accreditation is awaiting Admin approval.',
        };
      }
    }

    // Persist active session
    setCurrentUser(matchedUser);
    storageService.setItem(STORAGE_KEYS.CURRENT_USER, matchedUser);

    const redirectUrl = ROLE_REDIRECTS[matchedUser.role] || '/';
    return {
      success: true,
      message: `Welcome back, ${matchedUser.name}!`,
      redirectUrl,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
    router.push('/');
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    extra?: any;
  }): Promise<{ success: boolean; message: string; redirectUrl?: string }> => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'An account with this email address already exists. Please login.' };
    }

    const newUserId = `user-${userData.role.toLowerCase()}-${Date.now()}`;
    const initialStatus: VerificationStatus =
      userData.role === 'NGO' || userData.role === 'VOLUNTEER' ? 'PENDING' : 'APPROVED';

    const newUser: User = {
      id: newUserId,
      email: trimmedEmail,
      name: userData.name,
      role: userData.role,
      phone: userData.phone || '',
      status: initialStatus,
      createdAt: new Date().toISOString(),
    };

    // Save user password
    if (typeof window !== 'undefined') {
      localStorage.setItem(`bf_pwd_${trimmedEmail}`, userData.password);
    }

    // Append to users list
    storageService.setItem(STORAGE_KEYS.USERS, [newUser, ...users]);

    // Handle role specific entity creation
    if (userData.role === 'NGO') {
      const ngos = storageService.getItem<any[]>(STORAGE_KEYS.NGOS, []);
      const newNgo = {
        id: `ngo-${Date.now()}`,
        userId: newUserId,
        name: userData.name,
        email: trimmedEmail,
        phone: userData.phone || '',
        darpanId: userData.extra?.darpanId || 'PENDING_SUBMISSION',
        regNumber: userData.extra?.regNumber || `REG-${Date.now().toString().slice(-6)}`,
        foundedYear: Number(userData.extra?.foundedYear) || new Date().getFullYear(),
        contactPerson: userData.extra?.contactPerson || userData.name,
        address: userData.extra?.address || 'India',
        city: userData.extra?.city || 'Bengaluru',
        state: userData.extra?.state || 'Karnataka',
        website: userData.extra?.website || '',
        orgType: userData.extra?.orgType || 'Trust',
        taxExempt12A: Boolean(userData.extra?.taxExempt12A),
        taxExempt80G: Boolean(userData.extra?.taxExempt80G),
        authorizedPerson: userData.extra?.authorizedPerson || userData.name,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        documents: [
          { name: 'Registration_Certificate.pdf', url: '#', verified: false },
        ],
      };
      storageService.setItem(STORAGE_KEYS.NGOS, [newNgo, ...ngos]);

      // Emit Admin notification
      const notifications = storageService.getItem<any[]>(STORAGE_KEYS.NOTIFICATIONS, []);
      storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'ADMIN',
          title: 'New NGO Accreditation Application',
          message: `${userData.name} has submitted registration documents awaiting verification.`,
          type: 'INFO',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...notifications,
      ]);

      // Do NOT log in pending account
      return {
        success: true,
        message: 'Your registration is submitted successfully. Please wait for Admin approval.',
        redirectUrl: '/login?role=NGO&status=pending',
      };
    } else if (userData.role === 'VOLUNTEER') {
      const volunteers = storageService.getItem<any[]>(STORAGE_KEYS.VOLUNTEERS, []);
      const nextIdNum = String(volunteers.length + 1).padStart(4, '0');
      const newVolunteer = {
        id: `vol-${Date.now()}`,
        userId: newUserId,
        volunteerIdNumber: `BF-VOL-2026-${nextIdNum}`,
        name: userData.name,
        email: trimmedEmail,
        phone: userData.phone || '',
        bloodGroup: userData.extra?.bloodGroup || 'O+',
        emergencyContact: userData.extra?.emergencyContact || userData.phone || '',
        dob: userData.extra?.dob || '2000-01-01',
        gender: userData.extra?.gender || 'Not Specified',
        address: userData.extra?.address || 'Karnataka, India',
        city: userData.extra?.city || 'Bengaluru',
        state: userData.extra?.state || 'Karnataka',
        pincode: userData.extra?.pincode || '560001',
        skills: Array.isArray(userData.extra?.skills) ? userData.extra.skills : [userData.extra?.skills || 'General Service'],
        areasOfInterest: Array.isArray(userData.extra?.areasOfInterest) ? userData.extra.areasOfInterest : ['Community Service'],
        profilePhoto: userData.extra?.profilePhoto || '',
        availability: userData.extra?.availability || 'Weekends',
        hoursServed: 0,
        status: 'PENDING',
        certificatesCount: 0,
        createdAt: new Date().toISOString(),
      };
      storageService.setItem(STORAGE_KEYS.VOLUNTEERS, [newVolunteer, ...volunteers]);

      // Emit Admin notification
      const notifications = storageService.getItem<any[]>(STORAGE_KEYS.NOTIFICATIONS, []);
      storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'ADMIN',
          title: 'New Volunteer Application',
          message: `${userData.name} registered as a volunteer and is awaiting review.`,
          type: 'INFO',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...notifications,
      ]);

      // Do NOT log in pending account
      return {
        success: true,
        message: 'Your registration is submitted successfully. Please wait for Admin approval.',
        redirectUrl: '/login?role=VOLUNTEER&status=pending',
      };
    } else if (userData.role === 'DONOR') {
      const donors = storageService.getItem<any[]>(STORAGE_KEYS.DONORS, []);
      const newDonor = {
        id: `donor-${Date.now()}`,
        userId: newUserId,
        name: userData.name,
        email: trimmedEmail,
        phone: userData.phone || '',
        panNumber: userData.extra?.panNumber || '',
        isAnonymous: Boolean(userData.extra?.isAnonymous),
        totalDonated: 0,
        donationCount: 0,
        createdAt: new Date().toISOString(),
      };
      storageService.setItem(STORAGE_KEYS.DONORS, [newDonor, ...donors]);

      // Donors are granted immediate access to their portal
      setCurrentUser(newUser);
      storageService.setItem(STORAGE_KEYS.CURRENT_USER, newUser);

      return {
        success: true,
        message: `Welcome, ${userData.name}! Your donor account is active.`,
        redirectUrl: '/donor',
      };
    }

    return {
      success: true,
      message: 'Registration completed successfully.',
      redirectUrl: '/login',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

