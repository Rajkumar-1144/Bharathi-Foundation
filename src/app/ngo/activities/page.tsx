'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Layers, Plus, Calendar, MapPin, Users } from 'lucide-react';

export default function NGOActivitiesPage() {
  const { currentUser } = useAuth();
  const { ngos, ngoActivities, createActivity } = useAppData();
  const currentNGO = ngos.find((n) => n.userId === currentUser?.id) || ngos[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Child Welfare');
  const [description, setDescription] = useState('');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState(100);
  const [location, setLocation] = useState('Bengaluru Rural');
  const [volunteersRequired, setVolunteersRequired] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const myActivities = ngoActivities.filter(
    (a) => a.ngoName === currentNGO?.name || a.ngoId === currentNGO?.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    createActivity({
      ngoId: currentNGO?.id || 'ngo-1',
      ngoName: currentNGO?.name || 'Partner NGO',
      title,
      category,
      description,
      targetBeneficiaries,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      location,
      status: 'APPROVED',
      volunteersRequired,
    });

    setModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <DashboardLayout
      allowedRole="NGO"
      title="Welfare Initiatives & Projects"
      subtitle="Propose and manage joint social welfare programs sponsored by Bharathi Foundation"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Total Projects: <strong className="text-brand-text">{myActivities.length}</strong>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Propose Welfare Activity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-primary bg-brand-bgLight px-3 py-1 rounded-full border border-brand-border">
                    {act.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      act.status === 'COMPLETED'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-text">{act.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{act.description}</p>
              </div>

              <div className="pt-4 border-t border-brand-border/60 mt-4 space-y-2 text-xs text-brand-muted">
                <div className="flex items-center justify-between">
                  <span>Location: <strong className="text-brand-text">{act.location}</strong></span>
                  <span>Beneficiaries: <strong className="text-brand-text">{act.targetBeneficiaries}</strong></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Volunteers Required: <strong className="text-brand-primary">{act.volunteersRequired}</strong></span>
                  <span>Timeline: {act.startDate} to {act.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Propose Community Welfare Initiative"
          subtitle="Submit proposal for Bharathi Foundation resource and volunteer allocation"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Activity Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rural Eye Checkup & Nutrition Distribution"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  <option value="Child Welfare">Child Welfare</option>
                  <option value="Health & Medical">Health & Medical</option>
                  <option value="Education & Livelihood">Education & Livelihood</option>
                  <option value="Elder Care">Elder Care</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandya Rural"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  value={volunteersRequired}
                  onChange={(e) => setVolunteersRequired(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Description & Scope</label>
              <textarea
                rows={3}
                required
                placeholder="Objectives, target group, resources required..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Submit Initiative Proposal
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

