'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { Logo } from '@/components/common/Logo';
import { TRANSLATIONS } from '@/translations';
import {
  Heart,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Globe,
  Phone,
  Droplet,
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useAppData();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navLinks = [
    { label: t.navHome || 'Home', href: '/' },
    { label: t.navAbout || 'About Us', href: '/about' },
    { label: t.navServices || 'Our Services', href: '/services' },
    { label: 'Care Homes', href: '/care-homes' },
    { label: 'Activities', href: '/activities' },
    { label: 'NGOs', href: '/ngos' },
    { label: t.navBloodDonation || 'Blood Donation', href: '/blood-donation' },
    { label: t.navCamps || 'Camp Meetings', href: '/camps' },
    { label: t.navGallery || 'Gallery', href: '/gallery' },
    { label: t.navContact || 'Contact Us', href: '/contact' },
  ];

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    switch (currentUser.role) {
      case 'ADMIN':
        return '/admin';
      case 'NGO':
        return '/ngo';
      case 'VOLUNTEER':
        return '/volunteer';
      case 'DONOR':
        return '/donor';
      default:
        return '/';
    }
  };

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-brand-border shadow-xs">
      {/* Top Emergency & Trust Alert Bar */}
      <div className="bg-[#371555] text-white text-xs py-2 px-3 sm:px-5 lg:px-6 2xl:px-8 border-b border-purple-900/40">
        <div className="w-full max-w-[1680px] mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <a
              href="tel:+919876543210"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs transition-colors cursor-pointer shrink-0"
              title="Click to dial 24/7 Blood SOS Hotline"
            >
              <Droplet className="w-3 h-3 fill-white shrink-0" />
              <span>SOS Helpline</span>
            </a>
            <span className="hidden md:inline text-purple-100">
              Urgent need for O- and B+ blood donors at City Civil Hospital
            </span>
            <span className="hidden sm:inline md:hidden text-purple-100">
              Urgent O- & B+ blood donors needed
            </span>
            <span className="sm:hidden text-purple-100 font-medium truncate max-w-[200px]">
              Urgent O- & B+ Needed
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] shrink-0">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1.5 text-purple-200 hover:text-white font-bold transition-colors"
              title="Call 24/7 Blood Dispatch Hotline"
            >
              <Phone className="w-3 h-3 text-brand-secondary shrink-0" />
              <span>24/7 Helpline: +91 98765 43210</span>
            </a>
            <span className="hidden min-[1100px]:inline-block text-brand-secondary font-bold bg-white/10 px-2 py-0.5 rounded text-[10px] xl:text-[11px]">
              80G Tax Exempt Public Trust
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6 2xl:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 xl:gap-3 2xl:gap-4">
        {/* Brand Logo - Aligned to Left */}
        <div className="flex items-center shrink-0">
          <Logo size="md" priority href="/" />
        </div>

        {/* Desktop Navigation Links (Visible on 1280px and above) */}
        <nav
          className="hidden xl:flex items-center space-x-0.5 min-[1400px]:space-x-1 2xl:space-x-1.5"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-1.5 min-[1400px]:px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 rounded-lg 2xl:rounded-xl text-[11px] min-[1400px]:text-xs 2xl:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-brand-primary font-bold bg-brand-bgLight shadow-2xs'
                    : 'text-brand-text hover:text-brand-primary hover:bg-brand-bgLight/70'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right CTA Actions (Visible on 1280px and above) */}
        <div className="hidden xl:flex items-center gap-1.5 min-[1400px]:gap-2 2xl:gap-3 shrink-0">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-2.5 2xl:px-3 py-1.5 2xl:py-2 rounded-full border border-brand-border bg-brand-bgLight hover:bg-white text-[11px] 2xl:text-xs font-bold text-brand-primary transition-all shadow-2xs hover:border-brand-secondary cursor-pointer whitespace-nowrap shrink-0"
            title="Switch Language (English / తెలుగు)"
            aria-label={`Switch language to ${language === 'en' ? 'Telugu' : 'English'}`}
          >
            <Globe className="w-3.5 h-3.5 text-brand-secondaryDark shrink-0" />
            <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Donate Button with Heart Icon */}
          <Link
            href="/donate"
            className="flex items-center gap-1.5 2xl:gap-2 bg-gradient-to-r from-brand-primary to-[#6D28D9] hover:from-brand-primaryDark hover:to-brand-primary text-white px-3 min-[1400px]:px-4 2xl:px-5 py-1.5 2xl:py-2 rounded-full text-[11px] 2xl:text-xs font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
          >
            <Heart className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 fill-white text-white animate-pulse shrink-0" />
            <span className="hidden min-[1350px]:inline">{t.navDonateNow || 'Donate Now'}</span>
            <span className="min-[1350px]:hidden">Donate</span>
          </Link>

          {/* Login or User Dropdown */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 border border-brand-border bg-brand-bgLight hover:bg-white text-brand-primary font-medium px-2.5 2xl:px-3 py-1.5 2xl:py-2 rounded-full text-[11px] 2xl:text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[10px] 2xl:text-xs shrink-0">
                  {(currentUser.name || 'U').charAt(0)}
                </div>
                <span className="max-w-[80px] min-[1400px]:max-w-[110px] truncate font-bold text-[11px] 2xl:text-xs">
                  {currentUser.name || 'User'}
                </span>
                <ChevronDown className="w-3 h-3 text-brand-muted shrink-0" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-brand-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-brand-border/60">
                    <p className="text-xs text-brand-muted font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-brand-text truncate">{currentUser.name || 'User'}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-brand-primary">
                      {currentUser.role}
                    </span>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-text hover:bg-brand-bgLight font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                    <span>My Dashboard</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-2.5 min-[1400px]:px-3.5 2xl:px-4 py-1.5 2xl:py-2 rounded-full text-[11px] 2xl:text-xs font-bold transition-all whitespace-nowrap shrink-0"
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{t.navLogin || 'Login'}</span>
            </Link>
          )}
        </div>

        {/* Mobile & Tablet Header Controls (Visible on screens below 1280px) */}
        <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full border border-brand-border bg-brand-bgLight hover:bg-white text-xs font-bold text-brand-primary transition-colors cursor-pointer shrink-0"
            title="Switch Language (English / తెలుగు)"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-brand-secondaryDark shrink-0" />
            <span className="hidden sm:inline">{language === 'en' ? 'తెలుగు' : 'English'}</span>
            <span className="sm:hidden">{language === 'en' ? 'తె' : 'EN'}</span>
          </button>

          {/* Donate Action Button with Heart Icon */}
          <Link
            href="/donate"
            className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-brand-primary to-[#6D28D9] text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0"
            title="Donate to Bharathi Foundation"
          >
            <Heart className="w-3.5 h-3.5 fill-white text-white shrink-0" />
            <span className="hidden sm:inline">{t.navDonateNow || 'Donate Now'}</span>
            <span className="sm:hidden">Donate</span>
          </Link>

          {/* Tablet Direct Login (Visible on 768px-1279px) */}
          {!isAuthenticated && (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0"
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{t.navLogin || 'Login'}</span>
            </Link>
          )}

          {/* Tablet Authenticated Dashboard Pill */}
          {isAuthenticated && currentUser && (
            <Link
              href={getDashboardLink()}
              className="hidden md:flex items-center gap-1.5 border border-brand-border bg-brand-bgLight px-2.5 py-1.5 rounded-full text-xs font-bold text-brand-primary shrink-0"
              title={`Dashboard (${currentUser.role})`}
            >
              <div className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[10px]">
                {(currentUser.name || 'U').charAt(0)}
              </div>
              <span className="max-w-[70px] truncate">{currentUser.name || 'User'}</span>
            </Link>
          )}

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 rounded-xl text-brand-primary hover:bg-brand-bgLight focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-colors cursor-pointer shrink-0"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Drawer (Below 1280px) */}
      {mobileMenuOpen && (
        <div
          className="xl:hidden bg-white/98 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 pt-3 pb-6 space-y-3 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Menu"
        >
          {/* Navigation Links Grid / List */}
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation Links">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-primary font-bold bg-brand-bgLight border border-brand-border/60'
                      : 'text-brand-text hover:bg-brand-bgLight/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs in Drawer */}
          <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2">
            <Link
              href="/register?role=volunteer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-brand-bgLight hover:bg-brand-bgLight/80 text-brand-primary py-2.5 rounded-xl text-sm font-bold border border-brand-border transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span>Join as Volunteer</span>
            </Link>

            <Link
              href="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-primary to-[#6D28D9] text-white py-2.5 rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t.navDonateNow || 'Donate Now'}</span>
            </Link>

            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-black shadow-xs transition-colors"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              <span>Emergency Blood SOS: +91 98765 43210</span>
            </a>

            {isAuthenticated && currentUser ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-purple-50 text-brand-primary py-2.5 rounded-xl text-sm font-bold border border-purple-200"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open {currentUser.role} Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
