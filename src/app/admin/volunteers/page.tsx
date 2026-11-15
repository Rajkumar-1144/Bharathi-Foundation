'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DataTable, Column } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { Volunteer } from '@/types';
import { exportService } from '@/services/exportService';
import {
  Users,
  CheckCircle,
  XCircle,
  Award,
  FileDown,
  Eye,
  Clock,
  ShieldCheck,
  Ban,
  MapPin,
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function AdminVolunteersPage() {
  const { volunteers, approveVolunteer, rejectVolunteer, suspendVolunteer } = useAppData();
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);
  const [rejectingVol, setRejectingVol] = useState<Volunteer | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingVolunteers = volunteers.filter((v) => v.status === 'PENDING');
  const approvedVolunteers = volunteers.filter((v) => v.status === 'APPROVED');
  const suspendedVolunteers = volunteers.filter(
    (v) => v.status === 'REJECTED' || v.status === 'SUSPENDED'
  );

  const handleConfirmReject = () => {
    if (rejectingVol) {
      rejectVolunteer(rejectingVol.id, rejectionReason || 'Application criteria not met');
      setRejectingVol(null);
      setRejectionReason('');
      if (selectedVol?.id === rejectingVol.id) {
        setSelectedVol(null);
      }
    }
  };

  const columns: Column<Volunteer>[] = [
    {
      header: 'Volunteer Profile',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.profilePhoto ? (
            <img
              src={row.profilePhoto}
              alt={row.name}
              className="w-10 h-10 rounded-xl object-cover border border-brand-border shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0">
              {row.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-brand-text flex items-center gap-1.5">
              <span>{row.name}</span>
              {row.volunteerIdNumber && (
                <span className="font-mono text-[10px] text-brand-muted bg-brand-bgLight px-1.5 py-0.5 rounded border border-brand-border">
                  {row.volunteerIdNumber}
                </span>
              )}
            </p>
            <p className="text-xs text-brand-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Blood Group',
      accessorKey: 'bloodGroup',
      cell: (row) => (
        <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
          {row.bloodGroup || '—'}
        </span>
      ),
    },
    {
      header: 'Location & Phone',
      cell: (row) => (
        <div>
          <p className="font-medium text-brand-text text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-muted" />
            {row.city || 'Bengaluru'}{row.state ? `, ${row.state}` : ''}
          </p>
          <p className="text-xs text-brand-muted mt-0.5">{row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Skills & Availability',
      cell: (row) => (
        <div className="max-w-xs space-y-1">
          <div className="flex flex-wrap gap-1">
            {row.skills?.slice(0, 2).map((s, idx) => (
              <span
                key={idx}
                className="bg-brand-bgLight text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded"
              >
                {s}
              </span>
            ))}
            {(row.skills?.length || 0) > 2 && (
              <span className="text-[10px] text-brand-muted font-medium">
                +{row.skills.length - 2} more
              </span>
            )}
          </div>
          <p className="text-[11px] text-brand-muted font-medium">{row.availability || 'Weekends'}</p>
        </div>
      ),
    },
    {
      header: 'Experience',
      accessorKey: 'experience',
      cell: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-brand-primaryDark border border-purple-200">
          {row.experience || 'Fresher (No Experience)'}
        </span>
      ),
    },
    {
      header: 'Hours Served',
      accessorKey: 'hoursServed',
      cell: (row) => (
        <div className="text-center">
          <span className="font-bold text-xs text-brand-primary block">{row.hoursServed || 0} hrs</span>
          <span className="text-[10px] text-brand-muted">{row.certificatesCount || 0} certs</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
            row.status === 'APPROVED'
              ? 'bg-emerald-100 text-emerald-800'
              : row.status === 'PENDING'
              ? 'bg-amber-100 text-amber-800 animate-pulse'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedVol(row)}
            className="p-1.5 text-brand-primary hover:bg-brand-bgLight rounded-lg transition-colors"
            title="View Full Profile Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => approveVolunteer(row.id)}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-bold text-xs flex items-center gap-1"
                title="Approve Volunteer"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Approve</span>
              </button>
              <button
                onClick={() => setRejectingVol(row)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject Volunteer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <button
              onClick={() => suspendVolunteer(row.id, 'Suspended by admin')}
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Suspend Access"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Volunteer Cadre Administration"
      subtitle="Verify volunteer registrations, issue digital credentials, and track grassroots hours"
    >
      <div className="space-y-8">
        {/* TOP SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-muted">Total Volunteers</span>
              <Users className="w-4 h-4 text-brand-primary" />
            </div>
            <p className="text-2xl font-black text-brand-primaryDark">{volunteers.length}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs bg-amber-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-700">{pendingVolunteers.length}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs bg-emerald-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800">Approved & Active</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700">{approvedVolunteers.length}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-muted">Hours Rendered</span>
              <Award className="w-4 h-4 text-brand-secondaryDark" />
            </div>
            <p className="text-2xl font-black text-brand-primaryDark">
              {volunteers.reduce((sum, v) => sum + (v.hoursServed || 0), 0)} hrs
            </p>
          </div>
        </div>

        {/* PENDING APPROVAL QUEUE SECTION */}
        {pendingVolunteers.length > 0 && (
          <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                <h3 className="text-base font-bold text-brand-primaryDark">
                  Volunteer Approval Requests ({pendingVolunteers.length} Awaiting Review)
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Action Required
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              Review volunteer details, verify eligibility, and approve or reject accounts. Approved volunteers
              can immediately log in and access their digital ID card.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {pendingVolunteers.map((vol) => (
                <div
                  key={vol.id}
                  className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    {vol.profilePhoto ? (
                      <img
                        src={vol.profilePhoto}
                        alt={vol.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-amber-300 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shrink-0">
                        {vol.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-brand-text text-sm truncate">{vol.name}</h4>
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          {vol.bloodGroup || 'O+'}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted truncate">{vol.email}</p>
                      <p className="text-xs text-brand-muted mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-muted" />
                        {vol.city || 'Bengaluru'}{vol.state ? `, ${vol.state}` : ''} • {vol.phone}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="bg-purple-50 text-brand-primaryDark border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                          Exp: {vol.experience || 'Fresher (No Experience)'}
                        </span>
                        {vol.skills?.slice(0, 2).map((s, i) => (
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

                  <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedVol(vol)}
                      className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRejectingVol(vol)}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveVolunteer(vol.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL VOLUNTEERS DIRECTORY TABLE */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-brand-primaryDark">Volunteer Master Roster</h3>
              <p className="text-xs text-brand-muted">
                Complete database of enrolled, active, and past volunteers with service records
              </p>
            </div>
            <button
              onClick={() => exportService.exportVolunteersPDF(volunteers)}
              className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Volunteers PDF Directory</span>
            </button>
          </div>

          <DataTable
            data={volunteers}
            columns={columns}
            searchPlaceholder="Search volunteer by name, email, city, skills, ID..."
            searchFields={['name', 'city', 'phone', 'email', 'volunteerIdNumber']}
            filterColumn={{
              header: 'Status',
              field: 'status',
              options: [
                { label: 'Active (Approved)', value: 'APPROVED' },
                { label: 'Pending Review', value: 'PENDING' },
                { label: 'Rejected / Suspended', value: 'REJECTED' },
              ],
            }}
            exportFilename="Bharathi_Foundation_Volunteers"
          />
        </div>
      </div>

      {/* VIEW VOLUNTEER DETAILS MODAL */}
      <Modal
        isOpen={!!selectedVol}
        onClose={() => setSelectedVol(null)}
        title="Volunteer Comprehensive Profile"
      >
        {selectedVol && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-brand-bgLight rounded-2xl border border-brand-border">
              {selectedVol.profilePhoto ? (
                <img
                  src={selectedVol.profilePhoto}
                  alt={selectedVol.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-primary shadow-xs shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedVol.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-brand-text truncate">{selectedVol.name}</h3>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      selectedVol.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedVol.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedVol.status}
                  </span>
                </div>
                <p className="font-mono text-xs font-bold text-brand-primary mt-0.5">
                  ID: {selectedVol.volunteerIdNumber || 'Pending Issuance'}
                </p>
                <p className="text-xs text-brand-muted mt-1">
                  Enrolled on: {new Date(selectedVol.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-brand-border">
                <span className="text-brand-muted block font-medium">Contact Email</span>
                <span className="font-bold text-brand-text truncate block mt-0.5">{selectedVol.email}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-brand-border">
                <span className="text-brand-muted block font-medium">Mobile Number</span>
                <span className="font-bold text-brand-text block mt-0.5">{selectedVol.phone}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-brand-border">
                <span className="text-brand-muted block font-medium">Blood Group</span>
                <span className="font-bold text-red-700 block mt-0.5">{selectedVol.bloodGroup || 'Not specified'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-brand-border">
                <span className="text-brand-muted block font-medium">Volunteering Experience</span>
                <span className="font-bold text-brand-primaryDark block mt-0.5">
                  {selectedVol.experience || 'Fresher (No Experience)'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-brand-border">
                <span className="text-brand-muted block font-medium">Availability</span>
                <span className="font-bold text-brand-text block mt-0.5">
                  {selectedVol.availability || 'Weekends'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-brand-border">
                <span className="text-brand-muted block font-medium">Date of Birth & Gender</span>
                <span className="font-bold text-brand-text block mt-0.5">
                  {selectedVol.dob || '—'} ({selectedVol.gender || 'Not specified'})
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-brand-border text-xs">
              <span className="text-brand-muted block font-medium">Residential Address</span>
              <span className="font-bold text-brand-text block mt-0.5">
                {selectedVol.address ? `${selectedVol.address}, ` : ''}
                {selectedVol.city}
                {selectedVol.state ? `, ${selectedVol.state}` : ''}
                {selectedVol.pincode ? ` - ${selectedVol.pincode}` : ''}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-brand-text block mb-1.5">Registered Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedVol.skills?.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-brand-bgLight text-brand-primary text-xs font-bold px-2.5 py-1 rounded-lg border border-brand-border"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {selectedVol.areasOfInterest && selectedVol.areasOfInterest.length > 0 && (
              <div>
                <span className="text-xs font-bold text-brand-text block mb-1.5">Areas of Interest</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVol.areasOfInterest.map((interest, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-50 text-brand-secondaryDark text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 p-3 bg-brand-bgLight rounded-xl text-center text-xs">
              <div>
                <p className="text-brand-muted">Total Hours Served</p>
                <p className="text-lg font-black text-brand-primary mt-0.5">{selectedVol.hoursServed || 0} Hours</p>
              </div>
              <div>
                <p className="text-brand-muted">Camps Attended</p>
                <p className="text-lg font-black text-brand-primary mt-0.5">{selectedVol.certificatesCount || 0}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
              {selectedVol.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      setRejectingVol(selectedVol);
                    }}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      approveVolunteer(selectedVol.id);
                      setSelectedVol({ ...selectedVol, status: 'APPROVED', volunteerIdNumber: selectedVol.volunteerIdNumber || 'BF-VOL-2026-0130' });
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Issue ID</span>
                  </button>
                </>
              )}
              {selectedVol.status === 'APPROVED' && (
                <button
                  onClick={() => {
                    suspendVolunteer(selectedVol.id);
                    setSelectedVol({ ...selectedVol, status: 'SUSPENDED' });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  <span>Suspend Account</span>
                </button>
              )}
              {selectedVol.status === 'SUSPENDED' && (
                <button
                  onClick={() => {
                    approveVolunteer(selectedVol.id);
                    setSelectedVol({ ...selectedVol, status: 'APPROVED' });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Re-Activate Account</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* REJECT CONFIRMATION MODAL */}
      <Modal
        isOpen={!!rejectingVol}
        onClose={() => setRejectingVol(null)}
        title="Reject Volunteer Application"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              Rejecting <strong>{rejectingVol?.name}</strong> will update their registration status to REJECTED.
              The applicant will be informed upon login.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">
              Reason for Rejection (Optional)
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete address verification, does not meet age requirements..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setRejectingVol(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-bgLight cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
