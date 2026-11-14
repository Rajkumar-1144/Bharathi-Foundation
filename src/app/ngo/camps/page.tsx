'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Tent, Plus, Calendar, MapPin, Users } from 'lucide-react';

export default function NGOCampsPage() {
  const { currentUser } = useAuth();
  const { ngos, camps, createCamp } = useAppData();
  const currentNGO = ngos.find((n) => n.userId === currentUser?.id) || ngos[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [campType, setCampType] = useState<any>('MEDICAL_CHECKUP');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState(currentNGO?.city || 'Bengaluru');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM - 03:00 PM');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState(200);
  const [volunteersNeeded, setVolunteersNeeded] = useState(8);
  const [description, setDescription] = useState('');

  const myCamps = camps.filter(
    (c) => c.organizerNgoId === currentNGO?.id || c.organizerName.includes(currentNGO?.name || '')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !date) return;

    createCamp({
      title,
      campType,
      organizerName: currentNGO?.name || 'Partner NGO',
      organizerNgoId: currentNGO?.id,
      venue,
      city,
      date,
      time,
      targetBeneficiaries,
      volunteersNeeded,
      description,
      status: 'UPCOMING',
    });

    setModalOpen(false);
    setTitle('');
    setVenue('');
    setDescription('');
  };

  return (
    <DashboardLayout
      allowedRole="NGO"
      title="Camp Meetings & Drives Planner"
      subtitle="Organize local community diagnostics, blood donation camps, and eye testing"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Total Camps Organized: <strong className="text-brand-text">{myCamps.length}</strong>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Plan New Camp</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCamps.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-bgLight px-2.5 py-1 rounded-full">
                    {camp.campType.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      camp.status === 'UPCOMING'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-brand-text">{camp.title}</h3>
                <p className="text-xs text-brand-muted line-clamp-2">{camp.description}</p>

                <div className="space-y-1.5 text-xs text-brand-muted border-t border-brand-border/60 pt-3">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{camp.date} • {camp.time}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{camp.venue}, {camp.city}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 mt-4 flex items-center justify-between text-xs">
                <span className="font-bold text-brand-primary">
                  {camp.volunteersRegistered} / {camp.volunteersNeeded} Volunteers
                </span>
                <span className="text-brand-muted">Target: {camp.targetBeneficiaries}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Schedule Field Camp Meeting"
          subtitle="Propose venue, target beneficiaries, and required medical volunteers"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Camp Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Free Cataract Surgery Identification Camp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Camp Type</label>
                <select
                  value={campType}
                  onChange={(e) => setCampType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  <option value="MEDICAL_CHECKUP">Medical Checkup</option>
                  <option value="EYE_CARE">Eye Care & Spectacles</option>
                  <option value="BLOOD_DONATION">Blood Donation</option>
                  <option value="PEDIATRIC">Pediatric Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Venue Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panchayat Community Hall"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Target Beneficiaries</label>
                <input
                  type="number"
                  value={targetBeneficiaries}
                  onChange={(e) => setTargetBeneficiaries(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Volunteers Needed</label>
                <input
                  type="number"
                  value={volunteersNeeded}
                  onChange={(e) => setVolunteersNeeded(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Description & Logistics</label>
              <textarea
                rows={3}
                placeholder="Doctor requirements, screening kits needed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Publish Camp to Schedule
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

