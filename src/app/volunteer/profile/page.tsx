'use client';

import React, { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import {
  Users,
  CheckCircle2,
  Printer,
  Download,
  ShieldCheck,
  Droplet,
  Phone,
  MapPin,
  QrCode,
  Sparkles,
} from 'lucide-react';

export default function VolunteerProfilePage() {
  const { currentUser } = useAuth();
  const { volunteers, updateVolunteer } = useAppData();

  const currentVol =
    volunteers.find(
      (v) =>
        v.userId === currentUser?.id ||
        (currentUser?.email && v.email.toLowerCase() === currentUser.email.toLowerCase())
    ) || volunteers[0];

  const [name, setName] = useState(currentVol?.name || '');
  const [bloodGroup, setBloodGroup] = useState(currentVol?.bloodGroup || 'O+');
  const [phone, setPhone] = useState(currentVol?.phone || '');
  const [city, setCity] = useState(currentVol?.city || '');
  const [pincode, setPincode] = useState(currentVol?.pincode || '');
  const [availability, setAvailability] = useState(currentVol?.availability || 'Weekends');
  const [skills, setSkills] = useState(currentVol?.skills?.join(', ') || '');
  const [saved, setSaved] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVol) return;

    updateVolunteer(currentVol.id, {
      name,
      bloodGroup,
      phone,
      city,
      pincode,
      availability,
      skills: skills.split(',').map((s) => s.trim()),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const volIdNumber = currentVol?.volunteerIdNumber || `BF-VOL-2026-${(currentVol?.id || '0128').replace(/\D/g, '').padStart(4, '0')}`;

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="Volunteer Profile & Digital ID Card"
      subtitle="Manage your credentials, update standby contacts, and access your official volunteer pass"
    >
      <div className="space-y-8 max-w-5xl">
        {/* DIGITAL VOLUNTEER ID CARD DISPLAY */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
                <h3 className="text-lg font-bold text-brand-primaryDark">Official Digital Volunteer ID</h3>
              </div>
              <p className="text-xs text-brand-muted">
                Authorized identity credential for field camps, emergency relief operations, and blood drives
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintCard}
                className="flex items-center gap-1.5 bg-brand-bgLight hover:bg-brand-border text-brand-primary font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save ID</span>
              </button>
            </div>
          </div>

          {/* THE PHYSICAL-STYLE ID CARD */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="w-full max-w-md bg-gradient-to-br from-brand-primaryDark via-[#44186B] to-[#2D0F4A] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-brand-secondary/40 relative overflow-hidden"
            >
              {/* Decorative Background Accents */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand-secondary/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-brand-primary/40 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header with Logo */}
              <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/bharathi_logo.png"
                      alt="Logo"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-sm tracking-wider uppercase text-white leading-tight">
                      Bharathi Foundation
                    </h4>
                    <p className="text-[10px] text-brand-secondary tracking-widest uppercase font-bold">
                      We Love To Serve
                    </p>
                  </div>
                </div>

                <span className="bg-brand-secondary/30 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-secondary/40">
                  VOLUNTEER PASS
                </span>
              </div>

              {/* Photo & Details Row */}
              <div className="flex items-center gap-4">
                {currentVol?.profilePhoto ? (
                  <img
                    src={currentVol.profilePhoto}
                    alt={currentVol.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-secondary shadow-lg shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border-2 border-brand-secondary flex items-center justify-center text-white font-bold text-2xl shrink-0">
                    {currentVol?.name?.charAt(0) || 'V'}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-lg font-black text-white truncate">{currentVol?.name || 'Devoted Volunteer'}</h3>
                  <p className="font-mono text-xs font-bold text-brand-secondary">{volIdNumber}</p>
                  <p className="text-[11px] text-white/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-secondary shrink-0" />
                    <span>{currentVol?.city || 'Bengaluru'}</span>
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 bg-red-600/80 text-white font-black text-[10px] px-2 py-0.5 rounded-md border border-red-400">
                      <Droplet className="w-3 h-3 fill-current" />
                      <span>{currentVol?.bloodGroup || 'O+'}</span>
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-emerald-400/30">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code & Authority Footer */}
              <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-wider text-white/60">Emergency Contact</p>
                  <p className="text-xs font-bold text-white font-mono">{currentVol?.phone || '+91 98765 43210'}</p>
                  <p className="text-[9px] text-white/60 mt-1">Valid Thru: Dec 2027</p>
                </div>

                <div className="p-2 bg-white rounded-xl shadow-md flex flex-col items-center">
                  {/* Stylized QR Code placeholder */}
                  <div className="w-12 h-12 bg-black p-0.5 rounded grid grid-cols-4 gap-0.5">
                    <div className="bg-white rounded-xs" />
                    <div className="bg-black" />
                    <div className="bg-white rounded-xs" />
                    <div className="bg-white" />
                    <div className="bg-white" />
                    <div className="bg-white rounded-xs" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-white rounded-xs" />
                    <div className="bg-black" />
                    <div className="bg-white rounded-xs" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-white rounded-xs" />
                  </div>
                  <span className="text-[8px] font-bold text-brand-primaryDark mt-1 uppercase">Scan to Verify</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-bold text-brand-primaryDark">Update Volunteer Information</h3>
          </div>

          {saved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details successfully updated!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  Blood Group (Emergency Ready)
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Availability Schedule</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  <option value="Weekends">Weekends Only</option>
                  <option value="Sundays">Sundays Only</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Full-time">Full-time Volunteer</option>
                  <option value="Emergency Response">On-Call Emergencies</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">
                Skills & Service Interests (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
            >
              Save Volunteer Profile
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
