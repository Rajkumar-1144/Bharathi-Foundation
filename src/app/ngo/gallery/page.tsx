'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { imageService } from '@/services/imageService';
import { Upload, Plus, CheckCircle2 } from 'lucide-react';

export default function NGOGalleryPage() {
  const { currentUser } = useAuth();
  const { ngos, gallery, uploadPhoto } = useAppData();
  const currentNGO = ngos.find((n) => n.userId === currentUser?.id) || ngos[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>('COMMUNITY');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const myPhotos = gallery.filter((g) => g.uploadedByName === currentNGO?.name);

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
      uploadedByRole: 'NGO',
      uploadedByName: currentNGO?.name || 'Partner NGO',
      isApproved: false, // Requires admin review
      location: currentNGO?.city || 'Bengaluru',
    });

    setModalOpen(false);
    setTitle('');
    setDescription('');
    setImagePreview(null);
  };

  return (
    <DashboardLayout
      allowedRole="NGO"
      title="Activity Media & Gallery Submissions"
      subtitle="Submit ground evidence from your health camps and relief programs for admin approval"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Submitted Media: <strong className="text-brand-text">{myPhotos.length}</strong>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Activity Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs">
              <div className="relative h-48 w-full bg-brand-bgLight">
                <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      photo.isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {photo.isApproved ? 'Approved & Live' : 'Under Review'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="font-bold text-sm text-brand-text">{photo.title}</h4>
                <p className="text-xs text-brand-muted line-clamp-2">{photo.description}</p>
                <p className="text-[11px] text-brand-muted pt-2 border-t border-brand-border/60">
                  Uploaded: {photo.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Submit Activity Photo"
          subtitle="Photos will be published to the public gallery once reviewed by Foundation Admin"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Select File from Computer *</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="w-full text-xs text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-bgLight file:text-brand-primary"
              />
              {imagePreview && (
                <div className="mt-3 relative w-full h-40 rounded-xl border border-brand-border overflow-hidden">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Photo Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Free Eye Checkup Camp Ground Photo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              >
                <option value="COMMUNITY">Community Initiative</option>
                <option value="MEDICAL_OUTREACH">Medical Outreach</option>
                <option value="BLOOD_CAMP">Blood Camp</option>
                <option value="CHILD_WELFARE">Child Welfare</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Beneficiaries served, event details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Submit Photo for Review
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

