'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { Users, Plus, CheckCircle2, MapPin, Calendar } from 'lucide-react';

export default function NGOVolunteerRequestsPage() {
  const { currentUser } = useAuth();
  const { ngos, volunteerRequests, createVolunteerRequest } = useAppData();
  const currentNGO = ngos.find((n) => n.userId === currentUser?.id) || ngos[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('First Aid, Registration, Crowd Management');
  const [countNeeded, setCountNeeded] = useState(10);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState(currentNGO?.city || 'Bengaluru');

  const myRequests = volunteerRequests.filter((v) => v.ngoId === currentNGO?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    createVolunteerRequest({
      ngoId: currentNGO?.id || 'ngo-1',
      ngoName: currentNGO?.name || 'Partner NGO',
      title,
      skillsNeeded: skills.split(',').map((s) => s.trim()),
      countNeeded,
      date,
      location,
      status: 'OPEN',
    });

    setModalOpen(false);
    setTitle('');
  };

  return (
    <DashboardLayout
      allowedRole="NGO"
      title="Volunteer Workforce Requisitions"
      subtitle="Request skilled volunteers from the Bharathi Foundation cadre for event assistance"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Active Requests: <strong className="text-brand-text">{myRequests.length}</strong>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Request Volunteer Headcount</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-brand-text">{req.title}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {req.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-brand-muted">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{req.date}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{req.location}</span>
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] font-bold text-brand-muted mb-1">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {req.skillsNeeded.map((s, i) => (
                      <span
                        key={i}
                        className="bg-brand-bgLight text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 mt-4 flex items-center justify-between text-xs">
                <span className="font-bold text-brand-primary">
                  {req.countAssigned} / {req.countNeeded} Volunteers Assigned
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">Active Broadcast</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create Volunteer Headcount Request"
          subtitle="Mobilize trained volunteers for upcoming camps or food drives"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Role / Task Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Registration Desk & Patient Crowd Management"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Date Needed *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Volunteers Needed *</label>
                <input
                  type="number"
                  required
                  value={countNeeded}
                  onChange={(e) => setCountNeeded(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Location / Venue</label>
              <input
                type="text"
                required
                placeholder="e.g. City Civil Hospital Gate 2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Specific Skills Needed (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Post Volunteer Requisition
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

