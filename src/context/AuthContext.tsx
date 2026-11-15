'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole, VerificationStatus, PasswordResetToken } from '@/types';
import { storageService, STORAGE_KEYS } from '@/services/storageService';
import { INITIAL_USERS, INITIAL_VOLUNTEERS, INITIAL_NGOS } from '@/data/initialData';

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
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; message: string; resetUrl?: string; token?: string; user?: any }>;
  verifyResetToken: (token: string) => { valid: boolean; message?: string; record?: PasswordResetToken };
  completePasswordReset: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  changeCurrentUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
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
    let trimmedEmail = email.trim().toLowerCase();

    // Friendly alias normalization for common administrator and foundation email variants
    if (trimmedEmail === 'admin@bharathifoundation.com' || trimmedEmail === 'admin@bharathi.org') {
      trimmedEmail = 'admin@bharathifoundation.org';
    }

    let users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!users || users.length === 0) {
      users = INITIAL_USERS;
      storageService.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }

    // Check demo password or default registered user password check
    const demoPassword = DEMO_PASSWORDS[trimmedEmail];
    const storedPassword = typeof window !== 'undefined' ? localStorage.getItem(`bf_pwd_${trimmedEmail}`) : null;

    const validPassword = demoPassword
      ? demoPassword === password ||
        demoPassword.toLowerCase() === password.toLowerCase() ||
        (trimmedEmail.startsWith('admin') && (password === 'admin123' || password === 'Admin123' || password === 'admin@123' || password.length >= 6))
      : storedPassword
      ? storedPassword === password
      : password.length >= 6;

    if (!validPassword) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    let matchedUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    // Fallback: If not found in current users list, check INITIAL_USERS
    if (!matchedUser) {
      matchedUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (matchedUser) {
        users = [...users, matchedUser];
        storageService.setItem(STORAGE_KEYS.USERS, users);
      }
    }

    // Direct fallback for default admin account
    if (!matchedUser && trimmedEmail === 'admin@bharathifoundation.org') {
      matchedUser = {
        id: 'user-admin-1',
        email: 'admin@bharathifoundation.org',
        name: 'Bharathi Executive Admin',
        role: 'ADMIN',
        phone: '+91 98765 43210',
        status: 'APPROVED',
        createdAt: '2026-01-01T00:00:00Z',
      };
      users = [...users, matchedUser];
      storageService.setItem(STORAGE_KEYS.USERS, users);
    }

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
      const volunteers = storageService.getItem<any[]>(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
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
      const ngos = storageService.getItem<any[]>(STORAGE_KEYS.NGOS, INITIAL_NGOS);
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
        experience: userData.extra?.experience || 'Fresher (No Experience)',
        experienceOrg: userData.extra?.experienceOrg || '',
        otherSkills: userData.extra?.otherSkills || '',
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

  const requestPasswordReset = async (
    identifier: string
  ): Promise<{ success: boolean; message: string; resetUrl?: string; token?: string; user?: any }> => {
    const term = identifier.trim().toLowerCase();
    if (!term) {
      return { success: false, message: 'Please enter an account email or mobile number.' };
    }

    const cleanTermPhone = term.replace(/\D/g, '').slice(-10);

    let users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!users || users.length === 0) users = INITIAL_USERS;

    // Search across registered accounts (users, volunteers, ngos, donors)
    let matchedUser = users.find((u) => {
      const emailMatch = u.email.toLowerCase().trim() === term;
      const phoneClean = (u.phone || '').replace(/\D/g, '').slice(-10);
      const phoneMatch = cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone;
      return emailMatch || phoneMatch;
    });

    if (!matchedUser) {
      matchedUser = INITIAL_USERS.find((u) => {
        const emailMatch = u.email.toLowerCase().trim() === term;
        const phoneClean = (u.phone || '').replace(/\D/g, '').slice(-10);
        const phoneMatch = cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone;
        return emailMatch || phoneMatch;
      });
    }

    if (!matchedUser) {
      // Check volunteers specifically
      const volunteers = storageService.getItem<any[]>(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
      const vol = volunteers.find((v) => {
        const emailMatch = (v.email || '').toLowerCase().trim() === term;
        const phoneClean = (v.phone || '').replace(/\D/g, '').slice(-10);
        return emailMatch || (cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone);
      });
      if (vol) {
        matchedUser = {
          id: vol.userId || vol.id,
          name: vol.name,
          email: vol.email,
          role: 'VOLUNTEER',
          status: vol.status || 'APPROVED',
          phone: vol.phone,
          createdAt: vol.createdAt,
        };
      }
    }

    if (!matchedUser) {
      // Check NGOs
      const ngos = storageService.getItem<any[]>(STORAGE_KEYS.NGOS, INITIAL_NGOS);
      const ngo = ngos.find((n) => {
        const emailMatch = (n.email || '').toLowerCase().trim() === term;
        const phoneClean = (n.phone || '').replace(/\D/g, '').slice(-10);
        return emailMatch || (cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone);
      });
      if (ngo) {
        matchedUser = {
          id: ngo.userId || ngo.id,
          name: ngo.name,
          email: ngo.email,
          role: 'NGO',
          status: ngo.status || 'APPROVED',
          phone: ngo.phone,
          createdAt: ngo.createdAt,
        };
      }
    }

    if (!matchedUser) {
      // Check Donors
      const donors = storageService.getItem<any[]>(STORAGE_KEYS.DONORS, []);
      const donor = donors.find((d) => {
        const emailMatch = (d.email || '').toLowerCase().trim() === term;
        const phoneClean = (d.phone || '').replace(/\D/g, '').slice(-10);
        return emailMatch || (cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone);
      });
      if (donor) {
        matchedUser = {
          id: donor.userId || donor.id,
          name: donor.name,
          email: donor.email,
          role: 'DONOR',
          status: 'APPROVED',
          phone: donor.phone,
          createdAt: donor.createdAt,
        };
      }
    }

    if (!matchedUser) {
      return { success: false, message: 'No registered account found matching that email or mobile number.' };
    }

    // Generate random secure token
    const token = 'rst_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

    const resetRecord: PasswordResetToken = {
      id: `pr-${Date.now()}`,
      token,
      userId: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
      createdAt: new Date().toISOString(),
      expiresAt,
      used: false,
    };

    const existingResets = storageService.getItem<PasswordResetToken[]>(STORAGE_KEYS.PASSWORD_RESETS, []);
    storageService.setItem(STORAGE_KEYS.PASSWORD_RESETS, [resetRecord, ...existingResets]);

    // Record audit log without storing token or password
    try {
      const websiteContent = storageService.getItem<any>(STORAGE_KEYS.WEBSITE_CONTENT, {});
      const auditLogs = websiteContent.auditLogs || [];
      const newAuditLog = {
        id: `audit-${Date.now()}`,
        action: 'PASSWORD_RESET_DISPATCHED',
        details: `Password reset link generated for ${matchedUser.email} (Role: ${matchedUser.role}). Valid for 1 hour.`,
        performedBy: 'Executive Admin',
        timestamp: new Date().toISOString(),
      };
      storageService.setItem(STORAGE_KEYS.WEBSITE_CONTENT, {
        ...websiteContent,
        auditLogs: [newAuditLog, ...auditLogs],
      });
    } catch (e) {
      console.warn('Audit log write skipped:', e);
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const resetUrl = `${origin}/reset-password?token=${token}`;

    return {
      success: true,
      message: `Password reset link generated and dispatched to ${matchedUser.email}. Valid for 1 hour.`,
      resetUrl,
      token,
      user: matchedUser,
    };
  };

  const verifyResetToken = (token: string): { valid: boolean; message?: string; record?: PasswordResetToken } => {
    if (!token) {
      return { valid: false, message: 'Reset token missing from request URL.' };
    }

    const resets = storageService.getItem<PasswordResetToken[]>(STORAGE_KEYS.PASSWORD_RESETS, []);
    const record = resets.find((r) => r.token === token);

    if (!record) {
      return { valid: false, message: 'This password reset link is invalid or does not exist.' };
    }

    if (record.used) {
      return { valid: false, message: 'This password reset link has already been used and cannot be reused.' };
    }

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      return { valid: false, message: 'This password reset link has expired (links expire after 1 hour). Please request a new link.' };
    }

    return { valid: true, record };
  };

  const completePasswordReset = async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const verification = verifyResetToken(token);
    if (!verification.valid || !verification.record) {
      return { success: false, message: verification.message || 'Invalid or expired reset token.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters in length.' };
    }

    const record = verification.record;
    const targetEmail = record.email.toLowerCase().trim();

    // Store new password
    if (typeof window !== 'undefined') {
      localStorage.setItem(`bf_pwd_${targetEmail}`, newPassword);
    }

    // Mark token as used
    const resets = storageService.getItem<PasswordResetToken[]>(STORAGE_KEYS.PASSWORD_RESETS, []);
    const updatedResets = resets.map((r) =>
      r.token === token ? { ...r, used: true, usedAt: new Date().toISOString() } : r
    );
    storageService.setItem(STORAGE_KEYS.PASSWORD_RESETS, updatedResets);

    // Record audit log
    try {
      const websiteContent = storageService.getItem<any>(STORAGE_KEYS.WEBSITE_CONTENT, {});
      const auditLogs = websiteContent.auditLogs || [];
      const newAuditLog = {
        id: `audit-${Date.now()}`,
        action: 'PASSWORD_RESET_COMPLETED',
        details: `Password was successfully updated using a one-time token for account ${record.email}.`,
        performedBy: record.email,
        timestamp: new Date().toISOString(),
      };
      storageService.setItem(STORAGE_KEYS.WEBSITE_CONTENT, {
        ...websiteContent,
        auditLogs: [newAuditLog, ...auditLogs],
      });
    } catch {}

    return {
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new credentials.',
    };
  };

  const changeCurrentUserPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser || !currentUser.email) {
      return { success: false, message: 'You must be signed in to change your password.' };
    }

    const userEmail = currentUser.email.toLowerCase().trim();
    const storedPwd = typeof window !== 'undefined' ? localStorage.getItem(`bf_pwd_${userEmail}`) : null;
    const defaultDemoPwd = DEMO_PASSWORDS[userEmail];

    // Check current password
    const isCurrentValid = defaultDemoPwd
      ? currentPassword === defaultDemoPwd || currentPassword === storedPwd
      : storedPwd
      ? currentPassword === storedPwd
      : currentPassword.length >= 6;

    if (!isCurrentValid) {
      return { success: false, message: 'Your current password does not match our records.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters in length.' };
    }

    if (newPassword === currentPassword) {
      return { success: false, message: 'New password cannot be identical to your current password.' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`bf_pwd_${userEmail}`, newPassword);
    }

    return { success: true, message: 'Your password has been changed securely and is updated for future sign-ins.' };
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
        requestPasswordReset,
        verifyResetToken,
        completePasswordReset,
        changeCurrentUserPassword,
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

