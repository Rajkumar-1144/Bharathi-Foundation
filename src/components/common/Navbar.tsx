'use client';

import React, { useState } from 'react';
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-brand-border shadow-xs">
      {/* Top Emergency & Trust Alert Bar */}
      <div className="bg-[#371555] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-purple-900/40">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <a
              href="tel:+919876543210"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              title="Click to dial 24/7 Blood SOS Hotline"
            >
              <Droplet className="w-3 h-3 fill-white" />
              <span>SOS Helpline</span>
            </a>
            <span className="hidden sm:inline text-purple-100">
              Urgent need for O- and B+ blood donors at City Civil Hospital
            </span>
            <span className="sm:hidden text-purple-100 font-medium">Urgent O- & B+ Needed</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1.5 text-purple-200 hover:text-white font-bold transition-colors"
              title="Call 24/7 Blood Dispatch Hotline"
            >
              <Phone className="w-3 h-3 text-brand-secondary shrink-0" />
              <span>24/7 Helpline: +91 98765 43210</span>
            </a>
            <span className="hidden md:inline-block text-brand-secondary font-bold bg-white/10 px-2 py-0.5 rounded">
              80G Tax Exempt Public Trust
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 2xl:px-8 h-20 flex items-center justify-between gap-2 xl:gap-3 2xl:gap-4">
        {/* Brand Logo - Aligned to Left */}
        <div className="flex items-center shrink-0">
          <Logo size="md" priority href="/" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-0.5 2xl:space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 xl:px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 rounded-xl text-xs xl:text-[13px] 2xl:text-sm font-semibold transition-all whitespace-nowrap ${
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

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 2xl:gap-3 shrink-0">
          {/* Language Switcher Pill */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 2xl:py-2 rounded-full border border-brand-border bg-brand-bgLight hover:bg-white text-xs font-bold text-brand-primary transition-all shadow-2xs hover:border-brand-secondary cursor-pointer whitespace-nowrap"
            title="Switch Language (English / తెలుగు)"
          >
            <Globe className="w-3.5 h-3.5 text-brand-secondaryDark" />
            <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          <Link
            href="/donate"
            className="flex items-center gap-1.5 xl:gap-2 bg-gradient-to-r from-brand-primary to-[#6D28D9] hover:from-brand-primaryDark hover:to-brand-primary text-white px-3.5 xl:px-4 2xl:px-5 py-2 2xl:py-2.5 rounded-full text-xs xl:text-xs 2xl:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-white text-white animate-pulse shrink-0" />
            <span>{t.navDonateNow || 'Donate Now'}</span>
          </Link>

          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 border border-brand-border bg-brand-bgLight hover:bg-white text-brand-primary font-medium px-3 xl:px-3.5 py-1.5 2xl:py-2 rounded-full text-xs xl:text-xs 2xl:text-sm transition-all whitespace-nowrap"
              >
                <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                  {(currentUser.name || 'U').charAt(0)}
                </div>
                <span className="max-w-[100px] xl:max-w-[120px] truncate font-bold text-xs">{currentUser.name || 'User'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
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
              className="flex items-center gap-1.5 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-3 xl:px-3.5 2xl:px-4 py-1.5 2xl:py-2 rounded-full text-xs xl:text-xs 2xl:text-sm font-bold transition-all whitespace-nowrap"
            >
              <UserIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              <span>{t.navLogin || 'Login'}</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-brand-border bg-brand-bgLight text-xs font-bold text-brand-primary"
          >
            <Globe className="w-3.5 h-3.5 text-brand-secondaryDark" />
            <span>{language === 'en' ? 'తె' : 'EN'}</span>
          </button>

          <Link
            href="/donate"
            className="flex items-center gap-1 bg-brand-primary text-white px-3 py-1.5 rounded-full text-xs font-bold"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Donate</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-brand-primary hover:bg-brand-bgLight focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-brand-border px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-primary font-bold bg-brand-bgLight'
                      : 'text-brand-text hover:bg-brand-bgLight/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-brand-border/60 flex flex-col gap-2">
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
                  className="flex items-center justify-center gap-2 w-full bg-brand-bgLight text-brand-primary py-2.5 rounded-xl text-sm font-bold border border-brand-border"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open {currentUser.role} Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full border border-brand-primary text-brand-primary py-2.5 rounded-xl text-sm font-bold"
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
