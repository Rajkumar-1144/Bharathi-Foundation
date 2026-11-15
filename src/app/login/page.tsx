'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  X,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registeredParam = searchParams.get('registered');

  const { login, requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [pendingNotice, setPendingNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotResetUrl, setForgotResetUrl] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Load Remembered Email on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('bf_remember_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }

    if (registeredParam === 'pending') {
      setPendingNotice(
        'Your registration was submitted successfully. Please wait for Admin approval before logging in.'
      );
    }
  }, [registeredParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Authenticate without forced role selection
      const res = await login(trimmedEmail, password);

      if (res.success && res.redirectUrl) {
        // Handle Remember Me
        if (typeof window !== 'undefined') {
          if (rememberMe) {
            localStorage.setItem('bf_remember_email', trimmedEmail);
          } else {
            localStorage.removeItem('bf_remember_email');
          }
        }
        router.push(res.redirectUrl);
      } else {
        setErrorMsg(res.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl shadow-brand-primary/10 rounded-3xl border border-purple-100/90 relative">
      {/* Registration Pending Alert */}
      {pendingNotice && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-2xl flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold">Registration Submitted</strong>
            {pendingNotice}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Main Single Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-brand-text mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-brand-border bg-white text-brand-text placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-brand-text uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full pl-10 pr-12 py-3 text-sm rounded-xl border border-brand-border bg-white text-brand-text placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary outline-hidden transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-primary focus:outline-hidden transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Option */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-md border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
            />
            <span className="text-xs text-brand-muted font-medium">Remember Me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md shadow-brand-primary/20 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Authenticating...</span>
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Account Creation & Home Navigation Links */}
      <div className="mt-8 pt-6 border-t border-brand-border/70 text-center space-y-3">
        <p className="text-xs text-brand-muted">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            className="font-bold text-brand-primary hover:text-brand-secondary transition-colors underline-offset-2 hover:underline"
          >
            Create a New Account
          </Link>
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors"
          >
            ← Return to Public Homepage
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-brand-primary">
                <HelpCircle className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotMsg('');
                  setForgotResetUrl('');
                }}
                className="text-brand-muted hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-bgLight transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">Account Password Recovery</h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Enter your registered email address or mobile number below to generate a secure, 1-hour password reset authorization link.
              </p>
            </div>

            {forgotMsg && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 ${
                forgotResetUrl ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {forgotResetUrl ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                <div className="leading-relaxed">{forgotMsg}</div>
              </div>
            )}

            {forgotResetUrl ? (
              <div className="space-y-3 pt-2">
                <Link
                  href={forgotResetUrl}
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primaryDark transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Proceed to Reset Password</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotMsg('');
                    setForgotResetUrl('');
                  }}
                  className="w-full py-2 border border-brand-border text-brand-muted hover:text-brand-text rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!forgotEmail.trim()) return;
                  setForgotLoading(true);
                  setForgotMsg('');
                  setForgotResetUrl('');
                  try {
                    const res = await requestPasswordReset(forgotEmail.trim());
                    if (res.success && res.resetUrl) {
                      setForgotMsg(res.message);
                      setForgotResetUrl(res.resetUrl);
                    } else {
                      setForgotMsg(res.message);
                    }
                  } catch (err: any) {
                    setForgotMsg(err.message || 'Failed to request password reset.');
                  } finally {
                    setForgotLoading(false);
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    Registered Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. volunteer@bharathifoundation.org"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primaryDark disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {forgotLoading ? 'Processing...' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 border border-brand-border text-brand-muted hover:text-brand-text rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 border-t border-brand-border/60 text-[11px] text-brand-muted">
              <span>Foundation Administrative Desk: </span>
              <span className="font-semibold text-brand-text">support@bharathifoundation.org</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7FD] via-[#F4EEFA] to-[#EAE0F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Foundation Official Logo */}
        <div className="flex justify-center mb-5">
          <Logo size="lg" priority href="/" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-brand-primaryDark tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-brand-muted">
          Sign in to your Bharathi Foundation account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white p-8 rounded-3xl text-center text-xs text-brand-muted shadow-xl">
              Loading authentication...
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
