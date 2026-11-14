'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Modal } from '@/components/dashboard/Modal';
import { useAppData } from '@/context/AppDataContext';
import { imageService } from '@/services/imageService';
import { GalleryItem } from '@/types';
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, Plus, Eye } from 'lucide-react';

export default function AdminGalleryPage() {
  const { gallery, uploadPhoto, approvePhoto, deletePhoto } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<GalleryItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('BLOOD_CAMP');
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await imageService.processImageUpload(e.target.files[0], 1000, 800, 0.75);
        setImagePreview(compressed);
      } catch (err) {
        alert('Failed to process image file');
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imagePreview) {
      alert('Please upload an image and add a title.');
      return;
    }

    uploadPhoto({
      title,
      description,
      category,
      imageUrl: imagePreview,
      uploadedByRole: 'ADMIN',
      uploadedByName: 'Executive Admin',
      isApproved: true,
      location,
    });

    setModalOpen(false);
    setTitle('');
    setDescription('');
    setLocation('');
    setImagePreview(null);
  };

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Photo Gallery Content Management (CMS)"
      subtitle="Upload, approve, categorize, and govern all visual evidence on the public website"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">
            Total Media Assets: <strong className="text-brand-text">{gallery.length}</strong> • Approved on Public Portal:{' '}
            <strong className="text-emerald-700">{gallery.filter((g) => g.isApproved).length}</strong>
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload High-Res Photo</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="relative h-52 w-full bg-brand-bgLight group">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-brand-primary/90 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.isApproved ? 'Live on Website' : 'Pending Approval'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-brand-text line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">{item.description}</p>
                  <p className="text-[11px] text-brand-muted mt-2">
                    By: <strong>{item.uploadedByName}</strong> ({item.uploadedByRole}) • {item.date}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                  {!item.isApproved && (
                    <button
                      onClick={() => approvePhoto(item.id)}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve to Public</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Delete photo "${item.title}"?`)) {
                        deletePhoto(item.id);
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Upload Photograph to Gallery"
          subtitle="Compress and publish field imagery to the Bharathi Foundation repository"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
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
                <div className="mt-3 relative w-full h-44 rounded-xl border border-brand-border overflow-hidden bg-brand-bgLight">
                  <Image src={imagePreview} alt="Upload Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Photo Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 500+ Donors at Bangalore Mega Blood Drive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  <option value="BLOOD_CAMP">Blood Camp</option>
                  <option value="MEDICAL_OUTREACH">Medical Outreach</option>
                  <option value="CHILD_WELFARE">Child Welfare</option>
                  <option value="DISASTER_RELIEF">Disaster Relief</option>
                  <option value="COMMUNITY">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Location</label>
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
              <label className="block text-xs font-bold text-brand-text mb-1">Caption / Description</label>
              <textarea
                rows={3}
                placeholder="Describe the occasion, beneficiaries served, and volunteers involved..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Upload and Publish to Website
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

