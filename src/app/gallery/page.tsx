'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { Eye, X } from 'lucide-react';

export default function GalleryPage() {
  const { gallery } = useAppData();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const approvedPhotos = gallery.filter((item) => item.isApproved);
  const filteredPhotos =
    activeCategory === 'ALL'
      ? approvedPhotos
      : approvedPhotos.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      <section className="bg-brand-bgLight py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border">
            Visual Transparency
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">Photo & Video Archive</h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            High-resolution documentation of our blood donation camps, diagnostic check-ups, and rural relief
            activities.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'All Photos', value: 'ALL' },
              { label: 'Blood Camps', value: 'BLOOD_CAMP' },
              { label: 'Medical Outreach', value: 'MEDICAL_OUTREACH' },
              { label: 'Child Welfare', value: 'CHILD_WELFARE' },
              { label: 'Disaster Relief', value: 'DISASTER_RELIEF' },
              { label: 'Community Service', value: 'COMMUNITY' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeCategory === cat.value
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-brand-bgLight text-brand-text border border-brand-border hover:bg-brand-secondary/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Photo Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-brand-border bg-white"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary/90 px-2.5 py-0.5 rounded-md">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-base text-white mt-1.5 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">{item.location} • {item.date}</p>
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-brand-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[480px] w-full bg-black">
              <Image src={selectedImage.imageUrl} alt={selectedImage.title} fill className="object-contain" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between text-xs text-brand-muted mb-2">
                <span className="font-bold text-brand-primary">{selectedImage.category.replace('_', ' ')}</span>
                <span>{selectedImage.date} • {selectedImage.location}</span>
              </div>
              <h3 className="text-xl font-bold text-brand-text">{selectedImage.title}</h3>
              <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">{selectedImage.description}</p>
              <p className="text-[11px] text-brand-muted mt-4">
                Contributed by: <strong className="text-brand-text">{selectedImage.uploadedByName}</strong> ({selectedImage.uploadedByRole})
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

