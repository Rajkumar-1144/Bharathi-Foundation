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
  Sparkles,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registeredParam = searchParams.get('registered');

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [pendingNotice, setPendingNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

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

  // Quick fill helper for reviewers
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
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

      {/* Quick Demo Test Accounts Drawer / Helper */}
      <div className="mt-6 pt-5 border-t border-brand-border/40">
        <details className="group">
          <summary className="text-[11px] font-bold text-brand-muted/80 uppercase tracking-wider cursor-pointer list-none flex items-center justify-between hover:text-brand-primary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
              Quick Demo Logins (Click to autofill)
            </span>
            <span className="text-[10px] text-brand-primary group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@bharathifoundation.org', 'Admin@123')}
              className="text-left p-2.5 rounded-xl border border-brand-border/70 hover:border-brand-primary/50 bg-brand-bgLight/40 hover:bg-brand-bgLight text-xs transition-all"
            >
              <span className="font-bold text-brand-primary block text-[11px]">Admin</span>
              <span className="text-[10px] text-brand-muted truncate block">admin@bharathi...</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ngo@bharathifoundation.org', 'Ngo@123')}
              className="text-left p-2.5 rounded-xl border border-brand-border/70 hover:border-brand-primary/50 bg-brand-bgLight/40 hover:bg-brand-bgLight text-xs transition-all"
            >
              <span className="font-bold text-brand-primary block text-[11px]">NGO Partner</span>
              <span className="text-[10px] text-brand-muted truncate block">ngo@bharathi...</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('volunteer@bharathifoundation.org', 'Volunteer@123')}
              className="text-left p-2.5 rounded-xl border border-brand-border/70 hover:border-brand-primary/50 bg-brand-bgLight/40 hover:bg-brand-bgLight text-xs transition-all"
            >
              <span className="font-bold text-brand-primary block text-[11px]">Volunteer</span>
              <span className="text-[10px] text-brand-muted truncate block">volunteer@bharathi...</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('donor@bharathifoundation.org', 'Donor@123')}
              className="text-left p-2.5 rounded-xl border border-brand-border/70 hover:border-brand-primary/50 bg-brand-bgLight/40 hover:bg-brand-bgLight text-xs transition-all"
            >
              <span className="font-bold text-brand-primary block text-[11px]">Donor</span>
              <span className="text-[10px] text-brand-muted truncate block">donor@bharathi...</span>
            </button>
          </div>
        </details>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-brand-primary">
                <HelpCircle className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-brand-muted hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-bgLight transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">Account Password Recovery</h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                For security, password resets are processed by the Bharathi Foundation administrative desk.
              </p>
            </div>
            <div className="p-3 bg-brand-bgLight rounded-2xl border border-brand-border space-y-1.5 text-xs text-brand-text">
              <div>
                <span className="text-brand-muted block text-[11px]">Support Email:</span>
                <span className="font-bold text-brand-primary">support@bharathifoundation.org</span>
              </div>
              <div>
                <span className="text-brand-muted block text-[11px]">Helpline:</span>
                <span className="font-bold">+91 98765 43210</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primaryDark transition-colors"
            >
              Understood
            </button>
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
