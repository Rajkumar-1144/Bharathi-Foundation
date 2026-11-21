'use client';

import React, { useState } from 'react';
import { MessageCircle, Siren, X, Droplet, ArrowRight } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export function FloatingWhatsAppSOS() {
  const { websiteContent } = useAppData();
  const [isExpanded, setIsExpanded] = useState(false);

  // Priority: 1. dedicated whatsappPhone, 2. emergencyPhone, 3. contactPhone, 4. default
  const rawTarget =
    websiteContent.whatsappPhone ||
    websiteContent.emergencyPhone ||
    websiteContent.contactPhone ||
    '+91 98765 43210';

  // If there are multiple numbers separated by slash/comma, extract the primary mobile
  const primaryNumberPart = rawTarget.split(/[/,]/)[0].trim();

  // Clean for WhatsApp wa.me API: digits only with country code
  let cleanWhatsApp = primaryNumberPart.replace(/\D/g, '');
  if (cleanWhatsApp.length === 10) {
    cleanWhatsApp = `91${cleanWhatsApp}`;
  }
  if (cleanWhatsApp.length < 10) {
    cleanWhatsApp = '919876543210';
  }

  // Emergency voice hotline
  const callPhone = websiteContent.emergencyPhone || websiteContent.contactPhone || '+91 98765 43210';
  const cleanCallTel = callPhone.split(/[/,]/)[0].replace(/[^+\d]/g, '') || '+919876543210';

  // Pre-filled structured emergency blood request template
  const defaultMessage = `*EMERGENCY BLOOD REQUEST (Bharathi Foundation SOS)*
Patient Name: 
Blood Group Required: 
Units Required: 
Hospital & City: 
Attendant Name: 
Attendant Phone: 
Urgency Level: IMMEDIATE / CRITICAL

Please mobilize nearby voluntary standby donors from your registry.`;

  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`;

  return (
    <aside aria-label="Emergency Blood SOS Assistance" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Quick SOS Action Card */}
      {isExpanded && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl p-5 shadow-2xl border-2 border-red-500/30 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between pb-3 border-b border-brand-border/70">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse">
                <Siren className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-black text-brand-primaryDark">24/7 Blood SOS WhatsApp</h4>
                <p className="text-[11px] text-red-600 font-bold">Fast-Track Emergency Dispatch</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-brand-muted hover:text-brand-text p-1 rounded-lg hover:bg-brand-bgLight transition-colors"
              aria-label="Close SOS popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2 text-xs text-brand-muted">
            <p className="text-brand-text font-medium leading-relaxed">
              Need blood units urgently for a patient? Click below to send a pre-filled, structured emergency request directly to our 24/7 donor mobilization desk.
            </p>
            <div className="bg-red-50 border border-red-200/80 rounded-xl p-2.5 text-[11px] text-red-800 space-y-1">
              <span className="font-bold block">Pre-filled Structured Template includes:</span>
              <span className="block text-red-700">• Patient & Hospital Coordinates</span>
              <span className="block text-red-700">• Blood Group & Units Needed</span>
              <span className="block text-red-700">• Real-time Standby Donor Matching</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 text-center"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open WhatsApp with SOS Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={`tel:${cleanCallTel}`}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 text-center"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              <span>Call Emergency Hotline Now</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Open 24/7 Blood SOS WhatsApp Helpline"
          className="relative flex items-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba59] hover:to-[#0e7467] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95 border-2 border-white/60"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-white text-transparent" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-100 block leading-tight">
              Emergency SOS
            </span>
            <span className="text-xs font-bold block leading-tight">WhatsApp Blood Desk</span>
          </div>
        </button>

        {/* Pulse Emergency Badge for Mobile */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Direct WhatsApp Blood SOS"
          className="sm:hidden absolute -top-2 -left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md animate-pulse"
        >
          SOS
        </a>
      </div>
    </aside>
  );
}
