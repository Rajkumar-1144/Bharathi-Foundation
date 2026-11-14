'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { imageService } from '@/services/imageService';
import { Upload, CheckCircle2 } from 'lucide-react';

export default function VolunteerUploadPhotosPage() {
  const { currentUser } = useAuth();
  const { volunteers, uploadPhoto } = useAppData();
  const currentVol = volunteers.find((v) => v.userId === currentUser?.id) || volunteers[0];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>('COMMUNITY');
  const [location, setLocation] = useState(currentVol?.city || 'Bengaluru');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await imageService.processImageUpload(e.target.files[0], 900, 700, 0.75);
        setImagePreview(compressed);
      } catch (err) {
        alert('Could not process image');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imagePreview) return;

    uploadPhoto({
      title,
      description,
      category,
      imageUrl: imagePreview,
      uploadedByRole: 'VOLUNTEER',
      uploadedByName: currentVol?.name || 'Volunteer',
      isApproved: false, // Requires admin review
      location,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setDescription('');
      setImagePreview(null);
    }, 4000);
  };

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="Upload Ground Activity Photographs"
      subtitle="Contribute photos taken during camps and drives for inclusion in the official Bharathi Foundation gallery"
    >
      <div className="max-w-2xl bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-xs space-y-6">
        {submitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Photograph submitted! It has been placed in the Admin queue for verification before appearing in the public gallery.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Select Photo from Device *</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full text-xs text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-bgLight file:text-brand-primary"
            />
            {imagePreview && (
              <div className="mt-3 relative w-full h-44 rounded-xl border border-brand-border overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Photo Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Assisting elderly beneficiaries at eye camp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
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
                <option value="COMMUNITY">Community Service</option>
                <option value="BLOOD_CAMP">Blood Camp</option>
                <option value="MEDICAL_OUTREACH">Medical Outreach</option>
                <option value="CHILD_WELFARE">Child Welfare</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Location / Venue</label>
              <input
                type="text"
                placeholder="e.g. Town Hall, Bengaluru"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1">Brief Description</label>
            <textarea
              rows={3}
              placeholder="What was happening in this moment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs"
          >
            Submit Ground Photo for Admin Review
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

