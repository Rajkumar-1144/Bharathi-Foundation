'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { useAppData } from '@/context/AppDataContext';
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Shield,
  ExternalLink,
  Droplet,
  Tent,
  Users,
  Building2,
  MessageCircle,
} from 'lucide-react';

export function Footer() {
  const { websiteContent } = useAppData();

  return (
    <footer className="bg-[#200B35] text-white pt-20 pb-12 border-t-2 border-purple-900/60 relative overflow-hidden">
      {/* Decorative Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Col 1: Brand, Logo & Tagline */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white/95 p-2.5 rounded-2xl inline-block shadow-lg">
              <Logo size="md" href="/" />
            </div>
            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-normal">
              Inspired by a mother&apos;s endless love and the strength of friendship. Bharathi Foundation is an accredited
              public charitable trust serving humanity through food relief, voluntary blood donation networks, and free healthcare camps.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-purple-400/30 text-xs text-brand-secondary font-bold">
                <Shield className="w-3.5 h-3.5 text-brand-secondary" />
                <span>12A & 80G Tax Exempt Certified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-purple-400/30 text-xs text-purple-200 font-bold">
                <span>Darpan Registered NGO</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-purple-800/80 pb-2.5">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-purple-200/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About the Trust
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Our Core Services
                </Link>
              </li>
              <li>
                <Link href="/ngos" className="hover:text-white transition-colors">
                  NGO Partner Alliance
                </Link>
              </li>
              <li>
                <Link href="/blood-donation" className="hover:text-white transition-colors">
                  Blood Donation Drives
                </Link>
              </li>
              <li>
                <Link href="/camps" className="hover:text-white transition-colors">
                  Diagnostic Camps
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Photo Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Role Portals */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-purple-800/80 pb-2.5">
              Dedicated Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-purple-200/80">
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Executive Admin Panel</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-secondary" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>NGO Partner Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-secondary" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Volunteer Self-Service</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-secondary" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Donor Tax & 80G Receipts</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-secondary" />
                </Link>
              </li>
              <li className="pt-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-secondary to-[#C4B5FD] text-brand-primaryDark font-black px-4 py-2 rounded-xl text-xs hover:bg-white transition-all shadow-md"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Join as Volunteer or NGO</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust Address & 24x7 Helpline */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-purple-800/80 pb-2.5">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-purple-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-1" />
                <span className="leading-snug">{websiteContent.contactAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-secondary shrink-0" />
                <a
                  href={`tel:${(websiteContent.contactPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/[^+\d]/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {websiteContent.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Droplet className="w-4 h-4 text-red-400 fill-red-400 shrink-0" />
                <a
                  href={`tel:${(websiteContent.emergencyPhone || websiteContent.contactPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/[^+\d]/g, '')}`}
                  className="text-red-200 hover:text-white font-bold transition-colors"
                >
                  24/7 SOS Helpline: {websiteContent.emergencyPhone || '+91 98765 43210'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20 shrink-0" />
                <a
                  href={`https://wa.me/${(websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/\D/g, '').length === 10 ? `91${(websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/\D/g, '')}` : (websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:text-white font-medium transition-colors"
                >
                  WhatsApp SOS: {websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-secondary shrink-0" />
                <a href={`mailto:${websiteContent.contactEmail}`} className="hover:text-white transition-colors">
                  {websiteContent.contactEmail}
                </a>
              </li>
              <li className="pt-2">
                <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-3.5">
                  <p className="text-[11px] text-brand-secondary font-bold uppercase tracking-wider">
                    Official Foundation UPI ID
                  </p>
                  <p className="font-mono text-sm font-bold text-white mt-0.5">{websiteContent.upiId}</p>
                  <p className="text-[10px] text-purple-300 mt-1">Verified Payee: {websiteContent.upiName}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-purple-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/80">
          <p>© {new Date().getFullYear()} Bharathi Foundation. All Rights Reserved. Motto: WE LOVE TO SERVE.</p>
          <div className="flex items-center gap-1.5">
            <span>Built with devotion &</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>for humanitarian service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
