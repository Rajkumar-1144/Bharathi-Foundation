'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import { UserRole, VOLUNTEER_EXPERIENCE_OPTIONS } from '@/types';
import {
  Building2,
  Users,
  HeartHandshake,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Upload,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const VOLUNTEER_SKILL_OPTIONS = [
  'First Aid & Medical Support',
  'Teaching & Tutoring',
  'Event Logistics & Coordination',
  'Crowd & Camp Management',
  'Photography & Media',
  'Food Preparation & Distribution',
  'Blood Drive Mobilization',
  'IT & Graphic Design',
  'Others',
];

const VOLUNTEER_INTEREST_OPTIONS = [
  'Food Donation',
  'Blood Donation Camps',
  'Medical & Health Camps',
  'Elderly Care',
  'Child Education',
  'Emergency Disaster Relief',
];

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<'VOLUNTEER' | 'NGO' | 'DONOR'>('VOLUNTEER');
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Address Details
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');

  // Volunteer Specific
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'First Aid & Medical Support',
    'Food Preparation & Distribution',
  ]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Food Donation',
    'Blood Donation Camps',
  ]);
  const [availability, setAvailability] = useState('Weekends');
  const [experience, setExperience] = useState('Fresher (No Experience)');
  const [experienceOrg, setExperienceOrg] = useState('');
  const [otherSkills, setOtherSkills] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [profilePhotoName, setProfilePhotoName] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // NGO Specific
  const [darpanId, setDarpanId] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [foundedYear, setFoundedYear] = useState('2020');
  const [contactPerson, setContactPerson] = useState('');
  const [orgType, setOrgType] = useState('Public Charitable Trust');
  const [taxExempt80G, setTaxExempt80G] = useState(true);

  // Donor Specific
  const [panNumber, setPanNumber] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { registerUser } = useAuth();
  const router = useRouter();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please upload an image smaller than 2MB.');
        return;
      }
      setProfilePhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Phone validation
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile contact number.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password entries.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setErrorMsg('Password must contain at least one uppercase letter, one lowercase letter, and one number for account security.');
      return;
    }

    if (selectedRole === 'VOLUNTEER' && !termsAccepted) {
      setErrorMsg('You must agree to the Bharathi Foundation Volunteer Code of Conduct and Terms.');
      return;
    }

    setIsSubmitting(true);

    let extraData: any = {};
    if (selectedRole === 'NGO') {
      extraData = {
        darpanId,
        regNumber,
        foundedYear: parseInt(foundedYear) || 2020,
        contactPerson,
        city: city || 'Bengaluru',
        state: state || 'Karnataka',
        orgType,
        taxExempt80G,
      };
    } else if (selectedRole === 'VOLUNTEER') {
      if (!experience) {
        setErrorMsg('Please select your volunteer experience level.');
        setIsSubmitting(false);
        return;
      }
      if (experience !== 'Fresher (No Experience)' && !experienceOrg.trim()) {
        setErrorMsg('Please specify where you gained your volunteering experience (organization, company, NGO or institution name).');
        setIsSubmitting(false);
        return;
      }
      if (selectedSkills.includes('Others') && !otherSkills.trim()) {
        setErrorMsg('Please specify your other skills in the provided text field.');
        setIsSubmitting(false);
        return;
      }

      // Combine predefined skills with specified other skills
      const customSkillsList = otherSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const combinedSkills = Array.from(
        new Set([
          ...selectedSkills.filter((s) => s !== 'Others'),
          ...(customSkillsList.length > 0 ? customSkillsList : selectedSkills.includes('Others') ? ['Custom Skills'] : []),
        ])
      );

      extraData = {
        dob,
        gender,
        address,
        city: city || 'Bengaluru',
        state: state || 'Karnataka',
        pincode: pincode || '560001',
        bloodGroup,
        skills: combinedSkills.length > 0 ? combinedSkills : ['General Volunteer Support'],
        otherSkills: otherSkills.trim(),
        areasOfInterest: selectedInterests,
        availability,
        experience,
        experienceOrg: experience !== 'Fresher (No Experience)' ? experienceOrg.trim() : '',
        profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      };
    } else if (selectedRole === 'DONOR') {
      extraData = {
        panNumber: panNumber.toUpperCase(),
        isAnonymous,
        city: city || 'Bengaluru',
      };
    }

    try {
      const res = await registerUser({
        name,
        email,
        password,
        role: selectedRole,
        phone,
        extra: extraData,
      });

      if (res.success) {
        if (selectedRole === 'VOLUNTEER' || selectedRole === 'NGO') {
          setSuccessNotice(
            res.message ||
              'Your registration is submitted successfully. Please wait for Admin approval before logging in.'
          );
          setTimeout(() => {
            router.push(`/login?registered=pending&role=${selectedRole.toLowerCase()}`);
          }, 3500);
        } else {
          if (res.redirectUrl) {
            router.push(res.redirectUrl);
          }
        }
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" priority href="/" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-brand-primaryDark tracking-tight">
          Join Bharathi Foundation
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-brand-muted">
          Register to serve, collaborate, or empower communities with us.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-brand-border sm:px-10">
          {/* Account Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-brand-bgLight rounded-2xl border border-brand-border mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('VOLUNTEER');
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'VOLUNTEER'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('NGO');
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'NGO'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>NGO Partner</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('DONOR');
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedRole === 'DONOR'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Donor</span>
            </button>
          </div>

          {/* Success Banner */}
          {successNotice && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Application Received Successfully!</p>
                <p className="mt-1 leading-relaxed">{successNotice}</p>
                <p className="mt-2 text-xs text-emerald-700 italic">
                  Redirecting you to the portal login page in a moment...
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  {selectedRole === 'NGO' ? 'NGO / Organization Name *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'NGO' ? 'e.g. Karuna Seva Trust' : 'e.g. Sumanth Kumar'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* VOLUNTEER SPECIFIC SECTION */}
            {selectedRole === 'VOLUNTEER' && (
              <div className="space-y-4 pt-3 border-t border-brand-border/70">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Volunteer Profile Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Blood Group *</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
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
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-brand-text mb-1">Residential Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Street, Landmark, Apartment"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
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
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Availability Schedule *</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
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
                    <label className="block text-xs font-bold text-brand-text mb-1">Experience *</label>
                    <select
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    >
                      <option value="" disabled>Select volunteer experience...</option>
                      {VOLUNTEER_EXPERIENCE_OPTIONS.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Emergency Standby Contact *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Family or Friend Mobile (+91)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Where did you gain this experience? (Required when experience is not Fresher) */}
                {experience && experience !== 'Fresher (No Experience)' && (
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 animate-in fade-in slide-in-from-top-1">
                    <label className="block text-xs font-bold text-brand-primaryDark mb-1">
                      Where did you gain this experience? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter organization, company, NGO or institution name"
                      value={experienceOrg}
                      onChange={(e) => setExperienceOrg(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Profile Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    Profile Photo <span className="text-brand-muted font-normal">(Used for Digital Volunteer ID Card)</span>
                  </label>
                  <div className="flex items-center gap-4 p-3 bg-brand-bgLight rounded-2xl border border-brand-border">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile Preview"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-brand-primary shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-bgLight shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-brand-muted mt-1 truncate">
                        {profilePhotoName || 'JPG, PNG up to 2MB (passport or front face)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills Multi-Selection */}
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1.5">
                    Skills & Competencies <span className="text-brand-muted font-normal">(Select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VOLUNTEER_SKILL_OPTIONS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            isSelected
                              ? 'bg-brand-primary text-white border-brand-primary font-bold shadow-xs'
                              : 'bg-white text-brand-muted border-brand-border hover:border-brand-secondary'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  {/* Others custom skills input */}
                  {selectedSkills.includes('Others') && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 animate-in fade-in slide-in-from-top-1">
                      <label className="block text-xs font-bold text-brand-primaryDark mb-1">
                        Please specify your other skills <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your skills..."
                        value={otherSkills}
                        onChange={(e) => setOtherSkills(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Areas of Interest Multi-Selection */}
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1.5">
                    Areas of Interest <span className="text-brand-muted font-normal">(Select focus programs)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VOLUNTEER_INTEREST_OPTIONS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            isSelected
                              ? 'bg-brand-secondaryDark text-white border-brand-secondaryDark font-bold shadow-xs'
                              : 'bg-white text-brand-muted border-brand-border hover:border-brand-secondary'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-brand-primary border-brand-border focus:ring-brand-primary"
                    />
                    <span className="text-xs text-brand-muted leading-relaxed">
                      I agree to the{' '}
                      <strong className="text-brand-text">Bharathi Foundation Volunteer Code of Conduct</strong>,
                      confirm that my submitted details are accurate, and understand that my account requires
                      administrative review and approval prior to activation.
                    </span>
                  </label>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Verification Policy:</strong> Upon registration, your status is set to{' '}
                    <strong>PENDING</strong>. Our coordinator team verifies all volunteer applications before
                    issuing your Digital Volunteer ID and granting access to the Volunteer Portal.
                  </span>
                </div>
              </div>
            )}

            {/* NGO SPECIFIC SECTION */}
            {selectedRole === 'NGO' && (
              <div className="space-y-4 pt-3 border-t border-brand-border/70">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>NGO Legal & Registration Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      NGO Darpan Portal ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KA/2021/0284910"
                      value={darpanId}
                      onChange={(e) => setDarpanId(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      Registration / Trust Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TRUST-BLR-8921"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. S. K. Rao"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Founded Year</label>
                    <input
                      type="number"
                      placeholder="2018"
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="tax80g"
                    checked={taxExempt80G}
                    onChange={(e) => setTaxExempt80G(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary border-brand-border focus:ring-brand-primary"
                  />
                  <label htmlFor="tax80g" className="text-xs text-brand-text font-bold">
                    Organization holds valid 12A / 80G Tax Exemption certification
                  </label>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  ℹ NGO partner accounts are created in <strong>PENDING</strong> status. Foundation admins verify
                  Darpan and registration IDs before authorizing joint community camp drives.
                </div>
              </div>
            )}

            {/* DONOR SPECIFIC SECTION */}
            {selectedRole === 'DONOR' && (
              <div className="space-y-4 pt-3 border-t border-brand-border/70">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Donor Tax & Preference Details</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    Permanent Account Number (PAN){' '}
                    <span className="text-brand-muted font-normal">(Required for 80G tax benefit certificate)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border uppercase focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-brand-primary rounded border-brand-border focus:ring-brand-primary"
                  />
                  <label htmlFor="anonCheck" className="text-xs text-brand-muted">
                    Keep my contributions anonymous on public donor boards
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Registration...</span>
              ) : (
                <>
                  <span>Submit {selectedRole} Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border text-center">
            <p className="text-xs text-brand-muted">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-brand-primary hover:underline">
                Sign In to Your Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
