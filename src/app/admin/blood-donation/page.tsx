'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DataTable, Column } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { BloodDonor, EmergencyBloodRequest } from '@/types';
import { exportService } from '@/services/exportService';
import {
  Droplet,
  Phone,
  Plus,
  FileDown,
  CheckCircle2,
  Siren,
  Users,
  AlertTriangle,
  Hospital,
  MapPin,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export default function AdminBloodDonationPage() {
  const {
    bloodDonors,
    bloodRequests,
    registerBloodDonor,
    updateBloodDonorAvailability,
    updateBloodRequestStatus,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'DONORS'>('REQUESTS');
  const [modalOpen, setModalOpen] = useState(false);
  const [matchingRequest, setMatchingRequest] = useState<EmergencyBloodRequest | null>(null);

  // New Donor Form
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');

  // Matched Donors for currently inspected request
  const matchedDonors = matchingRequest
    ? bloodDonors.filter(
        (d) =>
          d.isAvailable &&
          (d.bloodGroup === matchingRequest.bloodGroup || matchingRequest.bloodGroup === 'Any')
      )
    : [];

  // Columns for Emergency Requests
  const requestColumns: Column<EmergencyBloodRequest>[] = [
    {
      header: 'Tracking ID & Patient',
      accessorKey: 'patientName',
      cell: (row) => (
        <div>
          <span className="font-mono text-[10px] text-brand-primary font-bold bg-brand-bgLight px-1.5 py-0.5 rounded border border-brand-border block w-fit mb-0.5">
            {row.id}
          </span>
          <p className="font-bold text-brand-text">{row.patientName}</p>
          <p className="text-xs text-brand-muted">Attendant: {row.contactPerson} ({row.mobileNumber})</p>
        </div>
      ),
    },
    {
      header: 'Group & Units',
      accessorKey: 'bloodGroup',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
            {row.bloodGroup}
          </span>
          <div>
            <span className="font-bold text-xs text-brand-text block">{row.unitsRequired} Units</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block ${
                row.priority === 'CRITICAL'
                  ? 'bg-red-100 text-red-800'
                  : row.priority === 'URGENT'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {row.priority}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Hospital & City',
      cell: (row) => (
        <div>
          <p className="font-bold text-xs text-brand-text flex items-center gap-1">
            <Hospital className="w-3.5 h-3.5 text-brand-muted" />
            {row.hospitalName}
          </p>
          <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-brand-muted" />
            {row.hospitalLocation}, {row.city}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => updateBloodRequestStatus(row.id, e.target.value as any)}
          className={`text-xs font-bold px-2 py-1 rounded-xl border transition-colors cursor-pointer ${
            row.status === 'FULFILLED'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : row.status === 'DONOR_IDENTIFIED'
              ? 'bg-purple-50 text-brand-primary border-purple-300'
              : row.status === 'VERIFIED'
              ? 'bg-blue-50 text-blue-800 border-blue-300'
              : row.status === 'PENDING'
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-gray-100 text-gray-700 border-gray-300'
          }`}
        >
          <option value="PENDING">PENDING</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="DONOR_IDENTIFIED">DONOR IDENTIFIED</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="FULFILLED">FULFILLED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => setMatchingRequest(row)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>Match Donors ({bloodDonors.filter((d) => d.isAvailable && d.bloodGroup === row.bloodGroup).length})</span>
        </button>
      ),
    },
  ];

  // Columns for Donors Registry
  const donorColumns: Column<BloodDonor>[] = [
    {
      header: 'Donor Name',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <p className="font-bold text-brand-text">{row.name}</p>
          <p className="text-xs text-brand-muted">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Blood Group',
      accessorKey: 'bloodGroup',
      cell: (row) => (
        <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
          {row.bloodGroup}
        </span>
      ),
    },
    {
      header: 'Location & City',
      cell: (row) => (
        <div>
          <p className="font-medium text-brand-text text-xs">{row.location}</p>
          <p className="text-xs text-brand-muted">{row.city}</p>
        </div>
      ),
    },
    {
      header: 'Emergency Phone',
      accessorKey: 'phone',
      cell: (row) => (
        <a
          href={`tel:${row.phone}`}
          className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{row.phone}</span>
        </a>
      ),
    },
    {
      header: 'Availability',
      cell: (row) => (
        <button
          onClick={() => updateBloodDonorAvailability(row.id, !row.isAvailable)}
          className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
            row.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {row.isAvailable ? '✓ Ready on Call' : 'Cooldown / Off'}
        </button>
      ),
    },
  ];

  const handleCreateDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) return;

    registerBloodDonor({
      name,
      bloodGroup,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@donor.org`,
      city,
      location: location || city,
      isAvailable: true,
    });

    setModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setLocation('');
  };

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Emergency Blood Donation & SOS Management"
      subtitle="Coordinate live blood requests, match voluntary standby donors, and track life-saving calls"
    >
      <div className="space-y-6">
        {/* TABS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-4">
          <div className="flex items-center gap-2 p-1.5 bg-brand-bgLight rounded-2xl border border-brand-border">
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'REQUESTS'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <Siren className="w-4 h-4" />
              <span>Emergency Requests ({bloodRequests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('DONORS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'DONORS'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Donors Registry ({bloodDonors.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'DONORS' && (
              <>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enlist New Donor</span>
                </button>
                <button
                  onClick={() => exportService.exportBloodDonorsPDF(bloodDonors)}
                  className="flex items-center gap-2 border border-brand-border bg-white hover:bg-brand-bgLight text-brand-text text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Export Donors PDF</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* TAB 1: EMERGENCY BLOOD REQUESTS */}
        {activeTab === 'REQUESTS' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-900">
              <div className="flex items-center gap-2 font-bold">
                <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                <span>Active Blood Emergencies Awaiting Fulfillment</span>
              </div>
              <span className="font-bold">
                {bloodRequests.filter((r) => r.status !== 'FULFILLED' && r.status !== 'CANCELLED').length} Active Cases
              </span>
            </div>

            <DataTable
              data={bloodRequests}
              columns={requestColumns}
              searchPlaceholder="Search by patient, hospital, city, blood group, ID..."
              searchFields={['patientName', 'hospitalName', 'city', 'bloodGroup', 'id']}
              filterColumn={{
                header: 'Status',
                field: 'status',
                options: [
                  { label: 'Pending Verification', value: 'PENDING' },
                  { label: 'Verified', value: 'VERIFIED' },
                  { label: 'Donor Identified', value: 'DONOR_IDENTIFIED' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Fulfilled', value: 'FULFILLED' },
                ],
              }}
              exportFilename="Bharathi_Foundation_Blood_Requests"
            />
          </div>
        )}

        {/* TAB 2: DONOR DIRECTORY */}
        {activeTab === 'DONORS' && (
          <div className="space-y-4">
            <DataTable
              data={bloodDonors}
              columns={donorColumns}
              searchPlaceholder="Search donor by name, city, location..."
              searchFields={['name', 'city', 'location', 'phone']}
              filterColumn={{
                header: 'Blood Group',
                field: 'bloodGroup',
                options: [
                  { label: 'A+', value: 'A+' },
                  { label: 'A-', value: 'A-' },
                  { label: 'B+', value: 'B+' },
                  { label: 'B-', value: 'B-' },
                  { label: 'O+', value: 'O+' },
                  { label: 'O-', value: 'O-' },
                  { label: 'AB+', value: 'AB+' },
                  { label: 'AB-', value: 'AB-' },
                ],
              }}
              exportFilename="Bharathi_Foundation_Blood_Donors"
            />
          </div>
        )}
      </div>

      {/* MATCH DONORS MODAL */}
      <Modal
        isOpen={!!matchingRequest}
        onClose={() => setMatchingRequest(null)}
        title="Live Standby Donors Matching Engine"
      >
        {matchingRequest && (
          <div className="space-y-5">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-red-600 font-bold block">{matchingRequest.id}</span>
                  <h4 className="text-sm font-bold text-brand-text">
                    {matchingRequest.patientName} • Requires {matchingRequest.unitsRequired} Units of{' '}
                    <span className="text-red-600 underline font-black">{matchingRequest.bloodGroup}</span>
                  </h4>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {matchingRequest.hospitalName}, {matchingRequest.city} (Attendant: {matchingRequest.mobileNumber})
                  </p>
                </div>
                <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  {matchingRequest.bloodGroup}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-brand-primaryDark uppercase tracking-wider mb-2">
                Available Donors with Matching Blood Group ({matchedDonors.length} Found)
              </h4>

              {matchedDonors.length === 0 ? (
                <div className="p-6 bg-brand-bgLight rounded-2xl text-center text-xs text-brand-muted">
                  No standby donors currently available for {matchingRequest.bloodGroup} in this location.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {matchedDonors.map((donor) => (
                    <div
                      key={donor.id}
                      className="p-3 bg-white rounded-xl border border-brand-border flex items-center justify-between shadow-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-brand-text flex items-center gap-1.5">
                          <span>{donor.name}</span>
                          <span className="text-[10px] font-bold text-white bg-red-600 px-1 rounded">
                            {donor.bloodGroup}
                          </span>
                        </p>
                        <p className="text-[11px] text-brand-muted">
                          {donor.location}, {donor.city} • Last Donated: {donor.lastDonationDate || 'Ready'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${donor.phone}`}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Donor</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-brand-border">
              <button
                onClick={() => {
                  updateBloodRequestStatus(matchingRequest.id, 'DONOR_IDENTIFIED', matchedDonors.length);
                  setMatchingRequest(null);
                }}
                className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Mark Status as &ldquo;Donor Identified&rdquo;
              </button>
              <button
                onClick={() => setMatchingRequest(null)}
                className="text-xs text-brand-muted hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ENLIST NEW DONOR MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Enlist Standby Blood Donor">
        <form onSubmit={handleCreateDonor} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Donor Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="donor@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Locality</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indiranagar"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-bgLight cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              Save Donor Record
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
