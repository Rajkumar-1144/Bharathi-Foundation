'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DataTable, Column } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { CampMeeting } from '@/types';
import { exportService } from '@/services/exportService';
import { Tent, Plus, Trash2, Edit2, FileDown, Calendar, Users, MapPin } from 'lucide-react';

export default function AdminCampsPage() {
  const { camps, createCamp, updateCamp, deleteCamp } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<CampMeeting | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [campType, setCampType] = useState<CampMeeting['campType']>('BLOOD_DONATION');
  const [organizerName, setOrganizerName] = useState('Bharathi Foundation & Red Cross');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM - 04:00 PM');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState(150);
  const [volunteersNeeded, setVolunteersNeeded] = useState(10);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<CampMeeting['status']>('UPCOMING');

  const openCreateModal = () => {
    setEditingCamp(null);
    setTitle('');
    setCampType('BLOOD_DONATION');
    setOrganizerName('Bharathi Foundation');
    setVenue('');
    setCity('Bengaluru');
    setDate('');
    setTime('09:00 AM - 04:00 PM');
    setTargetBeneficiaries(150);
    setVolunteersNeeded(10);
    setDescription('');
    setStatus('UPCOMING');
    setModalOpen(true);
  };

  const openEditModal = (camp: CampMeeting) => {
    setEditingCamp(camp);
    setTitle(camp.title);
    setCampType(camp.campType);
    setOrganizerName(camp.organizerName);
    setVenue(camp.venue);
    setCity(camp.city);
    setDate(camp.date);
    setTime(camp.time);
    setTargetBeneficiaries(camp.targetBeneficiaries);
    setVolunteersNeeded(camp.volunteersNeeded);
    setDescription(camp.description);
    setStatus(camp.status);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !date) return;

    if (editingCamp) {
      updateCamp(editingCamp.id, {
        title,
        campType,
        organizerName,
        venue,
        city,
        date,
        time,
        targetBeneficiaries,
        volunteersNeeded,
        description,
        status,
      });
    } else {
      createCamp({
        title,
        campType,
        organizerName,
        venue,
        city,
        date,
        time,
        targetBeneficiaries,
        volunteersNeeded,
        description,
        status,
        bannerImage:
          campType === 'BLOOD_DONATION'
            ? 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800'
            : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      });
    }
    setModalOpen(false);
  };

  const columns: Column<CampMeeting>[] = [
    {
      header: 'Camp Title & Type',
      accessorKey: 'title',
      cell: (row) => (
        <div>
          <p className="font-bold text-brand-text">{row.title}</p>
          <span className="text-[10px] font-bold text-brand-primary uppercase">
            {row.campType.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      cell: (row) => (
        <div className="text-xs">
          <p className="font-bold text-brand-text">{row.date}</p>
          <p className="text-brand-muted">{row.time}</p>
        </div>
      ),
    },
    {
      header: 'Venue & City',
      cell: (row) => (
        <div className="text-xs">
          <p className="font-medium text-brand-text">{row.venue}</p>
          <p className="text-brand-muted">{row.city}</p>
        </div>
      ),
    },
    {
      header: 'Volunteers',
      cell: (row) => (
        <span className="text-xs font-bold text-brand-primary">
          {row.volunteersRegistered} / {row.volunteersNeeded}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            row.status === 'UPCOMING'
              ? 'bg-emerald-100 text-emerald-800'
              : row.status === 'ONGOING'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-bgLight"
            title="Edit Camp"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete camp "${row.title}"?`)) {
                deleteCamp(row.id);
              }
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete Camp"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Camp Meetings & Drives Management"
      subtitle="Schedule medical outreach, blood donation campaigns, and volunteer workforce allocations"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => exportService.exportCampsPDF(camps)}
            className="flex items-center gap-1.5 bg-white border border-brand-border hover:bg-brand-bgLight text-brand-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Camps PDF</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Schedule New Camp</span>
          </button>
        </div>

        <DataTable
          data={camps}
          columns={columns}
          searchPlaceholder="Search camp by title, venue, city..."
          searchFields={['title', 'venue', 'city', 'campType']}
          filterColumn={{
            header: 'Camp Type',
            field: 'campType',
            options: [
              { label: 'Blood Donation', value: 'BLOOD_DONATION' },
              { label: 'Medical Checkup', value: 'MEDICAL_CHECKUP' },
              { label: 'Eye Care', value: 'EYE_CARE' },
              { label: 'Pediatric Care', value: 'PEDIATRIC' },
            ],
          }}
          exportFilename="Bharathi_Foundation_Camps"
        />

        {/* Create/Edit Camp Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCamp ? 'Edit Camp Meeting Details' : 'Schedule New Field Camp'}
          subtitle="Camp details will be broadcast across the public homepage and volunteer dashboards"
          maxWidth="xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Camp Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mega Free Eye Care & Cataract Camp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Camp Classification *</label>
                <select
                  value={campType}
                  onChange={(e) => setCampType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  <option value="BLOOD_DONATION">Blood Donation</option>
                  <option value="EYE_CARE">Eye Care & Ophthalmology</option>
                  <option value="PEDIATRIC">Pediatric & Child Health</option>
                  <option value="MEDICAL_CHECKUP">General Medical Diagnostic</option>
                  <option value="FOOD_RELIEF">Food & Emergency Relief</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Operating Hours</label>
                <input
                  type="text"
                  placeholder="09:00 AM - 04:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Venue / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Town Hall Auditorium"
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
              <label className="block text-xs font-bold text-brand-text mb-1">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Details of services, doctors attending, supplies..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              {editingCamp ? 'Save Changes' : 'Publish Camp Meeting'}
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

