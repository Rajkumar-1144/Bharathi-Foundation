'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChangePasswordCard } from '@/components/dashboard/ChangePasswordCard';
import { storageService, STORAGE_KEYS } from '@/services/storageService';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { User, UserRole, PasswordResetToken } from '@/types';
import { INITIAL_USERS } from '@/data/initialData';
import {
  Settings,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Search,
  Send,
  Copy,
  Clock,
  AlertCircle,
  UserCheck,
  ExternalLink,
  Check,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { requestPasswordReset } = useAuth();
  const { addAuditLog } = useAppData();

  const [resetSuccess, setResetSuccess] = useState(false);

  // Password Reset Management State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedAccount, setSearchedAccount] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ type: 'success' | 'error'; message: string; resetUrl?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [recentTokens, setRecentTokens] = useState<PasswordResetToken[]>([]);

  // Load existing tokens
  useEffect(() => {
    const tokens = storageService.getItem<PasswordResetToken[]>(STORAGE_KEYS.PASSWORD_RESETS, []);
    setRecentTokens(tokens);
  }, []);

  const handleSearchAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setResetFeedback(null);
    setSearchedAccount(null);

    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      setSearchError('Please enter an account email or mobile number to search.');
      return;
    }

    const cleanTermPhone = term.replace(/\D/g, '').slice(-10);

    // 1. Check registered users list
    let users = storageService.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!users || users.length === 0) users = INITIAL_USERS;

    let matched = users.find((u) => {
      const emailMatch = u.email.toLowerCase().trim() === term;
      const phoneClean = (u.phone || '').replace(/\D/g, '').slice(-10);
      return emailMatch || (cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone);
    });

    // 2. Check volunteers
    if (!matched) {
      const volunteers = storageService.getItem<any[]>(STORAGE_KEYS.VOLUNTEERS, []);
      const vol = volunteers.find((v) => {
        const emailMatch = (v.email || '').toLowerCase().trim() === term;
        const phoneClean = (v.phone || '').replace(/\D/g, '').slice(-10);
        return emailMatch || (cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone);
      });
      if (vol) {
        matched = {
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

    // 3. Check NGOs
    if (!matched) {
      const ngos = storageService.getItem<any[]>(STORAGE_KEYS.NGOS, []);
      const ngo = ngos.find((n) => {
        const emailMatch = (n.email || '').toLowerCase().trim() === term;
        const phoneClean = (n.phone || '').replace(/\D/g, '').slice(-10);
        return emailMatch || (cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone);
      });
      if (ngo) {
        matched = {
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

    // 4. Check Donors
    if (!matched) {
      const donors = storageService.getItem<any[]>(STORAGE_KEYS.DONORS, []);
      const donor = donors.find((d) => {
        const emailMatch = (d.email || '').toLowerCase().trim() === term;
        const phoneClean = (d.phone || '').replace(/\D/g, '').slice(-10);
        return emailMatch || (cleanTermPhone.length >= 10 && phoneClean === cleanTermPhone);
      });
      if (donor) {
        matched = {
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

    if (matched) {
      setSearchedAccount(matched);
    } else {
      setSearchError(`No registered account found with email or mobile "${searchQuery}".`);
    }
  };

  const handleSendResetLink = async (targetEmail: string) => {
    setIsResetting(true);
    setResetFeedback(null);
    setCopiedLink(false);

    try {
      const res = await requestPasswordReset(targetEmail);
      if (res.success && res.resetUrl) {
        setResetFeedback({
          type: 'success',
          message: res.message,
          resetUrl: res.resetUrl,
        });

        addAuditLog(
          'PASSWORD_RESET_DISPATCHED',
          `Admin dispatched secure password reset link to ${targetEmail}`
        );

        // Refresh token list
        const tokens = storageService.getItem<PasswordResetToken[]>(STORAGE_KEYS.PASSWORD_RESETS, []);
        setRecentTokens(tokens);
      } else {
        setResetFeedback({
          type: 'error',
          message: res.message || 'Failed to dispatch reset link.',
        });
      }
    } catch (err: any) {
      setResetFeedback({
        type: 'error',
        message: err.message || 'An error occurred while generating password reset link.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to reset all data to initial demo state? This will restore all demo users, NGOs, and sample donations.'
      )
    ) {
      storageService.resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Administrative Governance & Settings"
      subtitle="Security parameters, password reset management, and trust profile configuration"
    >
      <div className="max-w-4xl space-y-8">
        {resetSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstration data reset successfully! Reloading workspace...</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. PASSWORD RESET MANAGEMENT FOR ALL DASHBOARDS                            */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-brand-primary flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-brand-primaryDark">
                Password Reset Management (All Roles)
              </h3>
              <p className="text-xs text-brand-muted">
                Search any registered Admin, NGO, Volunteer, or Donor to dispatch a secure 1-hour reset link.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchAccount} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registered user by email address or mobile number..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Account</span>
            </button>
          </form>

          {/* Search Error */}
          {searchError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Search Result Card */}
          {searchedAccount && (
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-primaryDark">{searchedAccount.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        searchedAccount.role === 'ADMIN'
                          ? 'bg-purple-600 text-white'
                          : searchedAccount.role === 'NGO'
                          ? 'bg-blue-600 text-white'
                          : searchedAccount.role === 'VOLUNTEER'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {searchedAccount.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        searchedAccount.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : searchedAccount.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {searchedAccount.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted">
                    Email: <strong className="text-brand-text">{searchedAccount.email}</strong>
                    {searchedAccount.phone && <span> • Phone: {searchedAccount.phone}</span>}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => handleSendResetLink(searchedAccount.email)}
                  className="bg-brand-primary hover:bg-brand-primaryDark disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isResetting ? 'Generating Link...' : 'Send Password Reset Link'}</span>
                </button>
              </div>

              {/* Feedback Alert & Copy Link */}
              {resetFeedback && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    resetFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {resetFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{resetFeedback.message}</span>
                  </div>

                  {resetFeedback.resetUrl && (
                    <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={resetFeedback.resetUrl}
                        className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono text-brand-text select-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyLink(resetFeedback.resetUrl!)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                      </button>
                      <a
                        href={resetFeedback.resetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Form</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Recent Reset Tokens History */}
          <div className="pt-3 border-t border-brand-border space-y-3">
            <h4 className="text-xs font-bold text-brand-text flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-muted" />
              <span>Recent Password Reset Tokens & Audit History</span>
            </h4>

            {recentTokens.length === 0 ? (
              <p className="text-xs text-brand-muted italic">No password reset requests generated yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-brand-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-bgLight text-brand-muted border-b border-brand-border uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Account Holder</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Created</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {recentTokens.slice(0, 5).map((t) => {
                      const isExpired = Date.now() > new Date(t.expiresAt).getTime();
                      return (
                        <tr key={t.id} className="hover:bg-brand-bgLight/40">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-brand-text block">{t.name || t.email}</span>
                            <span className="text-[11px] text-brand-muted">{t.email}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-bgLight border border-brand-border">
                              {t.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {t.used ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                Completed (Used)
                              </span>
                            ) : isExpired ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                Expired
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                                Active (1 hr)
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-brand-muted text-[11px]">
                            {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-2.5 px-3">
                            {!t.used && !isExpired && (
                              <button
                                type="button"
                                onClick={() => {
                                  const origin = typeof window !== 'undefined' ? window.location.origin : '';
                                  handleCopyLink(`${origin}/reset-password?token=${t.token}`);
                                }}
                                className="text-brand-primary hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Link</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ADMIN INDIVIDUAL PASSWORD CHANGE                                        */}
        {/* ========================================================================= */}
        <ChangePasswordCard
          title="Executive Admin Password Change"
          subtitle="Change your master administrator credentials securely with strength validation."
        />

        {/* ========================================================================= */}
        {/* 3. TRUST SECURITY & ACCREDITATION PROFILE                                 */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-bgLight text-brand-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-brand-text">Trust Security & Accreditation Profile</h3>
              <p className="text-xs text-brand-muted">Bharathi Foundation Public Charitable Trust Information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Registration Status:</p>
              <p className="font-bold text-brand-text mt-0.5">Indian Trusts Act, 1882 (Public Charitable Trust)</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Income Tax Exemption:</p>
              <p className="font-bold text-brand-text mt-0.5">Section 12A & 80G Certified</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Persistence Layer:</p>
              <p className="font-bold text-brand-text mt-0.5">Browser LocalStorage & In-Memory Event Pipeline</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-bgLight border border-brand-border">
              <p className="text-brand-muted">Active Admin Session:</p>
              <p className="font-bold text-brand-text mt-0.5">admin@bharathifoundation.org (Master Operator)</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. DEMO STATE RESET BOX                                                    */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-red-700">Demonstration Reset Facility</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Need to return the website to its original pristine demo state for an evaluation or presentation?
            Clicking the button below resets all LocalStorage entities back to pre-seeded demo records.
          </p>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data to Initial Defaults</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
