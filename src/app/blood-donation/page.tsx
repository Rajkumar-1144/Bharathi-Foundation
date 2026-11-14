'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { EmergencyBloodRequest, BloodRequestPriority } from '@/types';
import {
  Droplet,
  Search,
  ShieldCheck,
  Heart,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Phone,
  Siren,
  Hospital,
  Clock,
  Send,
  User,
  CheckCircle2,
} from 'lucide-react';

export default function BloodDonationPage() {
  const { bloodDonors, camps, bloodRequests, registerBloodDonor, createBloodRequest } = useAppData();
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [searchCity, setSearchCity] = useState('');

  // Blood Donor Registration State
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [donorSuccessMsg, setDonorSuccessMsg] = useState(false);

  // Emergency Blood Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [reqBloodGroup, setReqBloodGroup] = useState('B+');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [reqCity, setReqCity] = useState('Bengaluru');
  const [reqState, setReqState] = useState('Karnataka');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<BloodRequestPriority>('CRITICAL');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Tracking State
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedRequest, setTrackedRequest] = useState<EmergencyBloodRequest | null>(null);
  const [trackError, setTrackError] = useState('');

  // Filter blood donors
  const filteredDonors = bloodDonors.filter((d) => {
    if (selectedGroup !== 'ALL' && d.bloodGroup !== selectedGroup) return false;
    if (searchCity.trim() && !d.city.toLowerCase().includes(searchCity.toLowerCase())) return false;
    return true;
  });

  // Filter blood donation camps
  const bloodCamps = camps.filter((c) => c.campType === 'BLOOD_DONATION');

  const handleRegisterDonor = (e: React.FormEvent) => {
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

    setDonorSuccessMsg(true);
    setTimeout(() => {
      setDonorSuccessMsg(false);
      setName('');
      setPhone('');
      setEmail('');
      setCity('');
      setLocation('');
    }, 4000);
  };

  const handleCreateBloodRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalName || !mobileNumber) {
      alert('Please fill all mandatory fields for the emergency blood request.');
      return;
    }

    const newId = createBloodRequest({
      patientName,
      bloodGroup: reqBloodGroup,
      unitsRequired: Number(unitsRequired),
      hospitalName,
      hospitalLocation: hospitalLocation || reqCity,
      city: reqCity,
      state: reqState,
      requiredDate,
      priority,
      contactPerson: contactPerson || patientName,
      mobileNumber,
      additionalInfo,
    });

    setCreatedRequestId(newId);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    const query = trackingInput.trim().toLowerCase();
    if (!query) return;

    const found = bloodRequests.find(
      (r) =>
        r.id.toLowerCase() === query ||
        r.patientName.toLowerCase().includes(query) ||
        r.mobileNumber.includes(query)
    );

    if (found) {
      setTrackedRequest(found);
    } else {
      setTrackError('No blood request found matching that tracking ID or patient name.');
      setTrackedRequest(null);
    }
  };

  const getStatusStepIndex = (status: EmergencyBloodRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'VERIFIED':
        return 1;
      case 'DONOR_IDENTIFIED':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'FULFILLED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      {/* Emergency Alert Banner */}
      <div className="bg-red-600 text-white py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-bold gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>24x7 BLOOD SOS HELPLINE: Immediate donor mobilization for hospitals and trauma cases.</span>
          </div>
          <button
            onClick={() => {
              setCreatedRequestId(null);
              setRequestModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-white text-red-600 px-3.5 py-1.5 rounded-full text-xs font-black hover:bg-gray-100 transition-colors shadow-xs cursor-pointer"
          >
            <Siren className="w-3.5 h-3.5" />
            <span>Raise Emergency Blood Request</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <section className="bg-rose-50/50 py-16 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-100 px-3.5 py-1.5 rounded-full">
            Bharathi Blood Bank Alliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">
            Emergency Blood Request & Voluntary Donor Network
          </h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            Connecting voluntary donors with patients across hospitals in urgent need. Non-commercial, verified,
            and fast-tracked.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCreatedRequestId(null);
                setRequestModalOpen(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Siren className="w-4 h-4" />
              <span>Raise Emergency Request (SOS)</span>
            </button>
            <a
              href="#donor-register"
              className="bg-white hover:bg-brand-bgLight text-brand-primary border border-brand-border font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-red-600" />
              <span>Join as Standby Donor</span>
            </a>
          </div>
        </div>
      </section>

      {/* LIVE TRACKER STRIP */}
      <section className="py-8 bg-brand-bgLight border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                placeholder="Track by Emergency Request ID (e.g. BF-BLD-2026-0042) or Patient Name..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Track Request Status
            </button>
          </form>

          {trackError && <p className="text-xs text-red-600 font-bold mt-2 text-center">{trackError}</p>}

          {trackedRequest && (
            <div className="mt-4 p-5 bg-white rounded-2xl border border-brand-border shadow-xs animate-fade-in space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/60 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-primary">{trackedRequest.id}</span>
                  <h4 className="text-sm font-bold text-brand-text">
                    Patient: {trackedRequest.patientName} ({trackedRequest.bloodGroup} • {trackedRequest.unitsRequired} units)
                  </h4>
                  <p className="text-xs text-brand-muted">
                    {trackedRequest.hospitalName}, {trackedRequest.city}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    trackedRequest.priority === 'CRITICAL'
                      ? 'bg-red-100 text-red-800'
                      : trackedRequest.priority === 'URGENT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Priority: {trackedRequest.priority}
                </span>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs">
                {['Pending', 'Verified', 'Donor Identified', 'In Progress', 'Fulfilled'].map(
                  (stepName, idx) => {
                    const activeIndex = getStatusStepIndex(trackedRequest.status);
                    const isDone = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;
                    return (
                      <div key={stepName} className="space-y-1">
                        <div
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-bold text-[10px] transition-colors ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          } ${isCurrent ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`block font-medium ${isCurrent ? 'font-bold text-emerald-800' : 'text-brand-muted'}`}>
                          {stepName}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Blood Group Quick Filter Bar */}
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs">
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider mb-4">
              Registered Voluntary Donors by Blood Group:
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedGroup('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGroup === 'ALL'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-brand-bgLight text-brand-text hover:bg-brand-border'
                }`}
              >
                All Groups ({bloodDonors.length})
              </button>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => {
                const count = bloodDonors.filter((d) => d.bloodGroup === bg).length;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedGroup === bg
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-brand-bgLight text-brand-text hover:bg-brand-border'
                    }`}
                  >
                    {bg} ({count})
                  </button>
                );
              })}
            </div>

            {/* Donor Directory Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDonors.map((donor) => (
                <div key={donor.id} className="p-4 rounded-2xl bg-brand-bgLight border border-brand-border shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-9 h-9 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                      {donor.bloodGroup}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        donor.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {donor.isAvailable ? 'Available' : 'Cooldown'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-brand-text">{donor.name}</h4>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {donor.location}, {donor.city}
                  </p>
                  <p className="text-[11px] text-brand-muted mt-2">
                    Last donated: {donor.lastDonationDate || 'Ready to donate'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form & Upcoming Drives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10" id="donor-register">
            {/* Donor Registration Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-primaryDark">Register as a Blood Donor</h3>
                  <p className="text-xs text-brand-muted">Join our standby network to be contacted in times of emergency</p>
                </div>
              </div>

              {donorSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                  ✓ Success! You are now enlisted in the Bharathi Foundation Emergency Blood Donor Registry.
                </div>
              )}

              <form onSubmit={handleRegisterDonor} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikas Gowda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Blood Group *</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
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
                    <label className="block text-xs font-bold text-brand-text mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="vikas@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Locality / Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Jayanagar 4th Block"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4" />
                  <span>Enlist in Voluntary Donor Directory</span>
                </button>
              </form>
            </div>

            {/* Upcoming Blood Donation Camps */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-brand-primaryDark mb-1">Upcoming Blood Donation Camps</h3>
                <p className="text-xs text-brand-muted">
                  Walk-in camps conducted in association with accredited blood banks and hospital authorities
                </p>
              </div>

              <div className="space-y-4">
                {bloodCamps.length === 0 ? (
                  <p className="text-xs text-brand-muted italic">No upcoming blood donation camps scheduled.</p>
                ) : (
                  bloodCamps.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                          {camp.status}
                        </span>
                        <h4 className="font-bold text-sm text-brand-text">{camp.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-red-600" />
                            {camp.date} at {camp.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-600" />
                            {camp.venue}, {camp.city}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Link
                          href="/login"
                          className="inline-block bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                        >
                          Volunteer for Camp
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY BLOOD REQUEST MODAL */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Emergency Blood Request (SOS)"
      >
        {createdRequestId ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-brand-text">Blood Request Submitted Successfully</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Your emergency request has been broadcast to our coordinating team and matched standby donors.
            </p>
            <div className="p-4 bg-brand-bgLight rounded-2xl border border-brand-border max-w-sm mx-auto">
              <span className="text-[11px] text-brand-muted block">Your Emergency Tracking ID</span>
              <span className="font-mono text-base font-bold text-brand-primary block mt-1">
                {createdRequestId}
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              Save this ID to track request status anytime on this page.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="bg-brand-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close & View Registry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateBloodRequest} className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Please ensure patient hospital details are accurate. Our volunteer coordinators verify all requests with hospital blood banks immediately.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Blood Group Required *</label>
                <select
                  value={reqBloodGroup}
                  onChange={(e) => setReqBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Units Required *</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={unitsRequired}
                  onChange={(e) => setUnitsRequired(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Urgency Level *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as BloodRequestPriority)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden font-bold"
                >
                  <option value="CRITICAL">Critical (Within 2-4 hrs)</option>
                  <option value="URGENT">Urgent (Within 24 hrs)</option>
                  <option value="NORMAL">Normal (Within 2-3 days)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Required By Date *</label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Hospital / Apollo"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">City / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru"
                  value={reqCity}
                  onChange={(e) => setReqCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Attendant / Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Reddy (Relative)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Emergency Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 12345"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">
                Additional Notes / Case Details (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Surgery scheduled, Ward 4B, Doctor Dr. Anand"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-bgLight cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Emergency Request</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
