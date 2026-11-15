'use client';

import React, { useState } from 'react';
import { imageService } from '@/services/imageService';
import { Upload, Link as LinkIcon, Trash2, RefreshCw, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';

interface CMSImageUploaderProps {
  label: string;
  currentImageUrl?: string;
  onImageChanged: (url: string) => void;
  helperText?: string;
}

export function CMSImageUploader({
  label,
  currentImageUrl = '',
  onImageChanged,
  helperText = 'PNG, JPG, or WebP up to 5MB',
}: CMSImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsUploading(true);

    try {
      const res = await imageService.uploadCmsImage(file);
      if (res.success && res.url) {
        setImageUrl(res.url);
        onImageChanged(res.url);
      } else {
        setErrorMessage(res.error || 'Failed to upload image. Please check file format.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error occurred while processing image upload.');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be reselected if needed
      e.target.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    setImageUrl(customUrl.trim());
    onImageChanged(customUrl.trim());
    setCustomUrl('');
    setUseUrlInput(false);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onImageChanged('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-brand-text">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseUrlInput(!useUrlInput)}
            className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{useUrlInput ? 'Upload File' : 'Image URL'}</span>
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Image Preview & Actions Area */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-brand-bgLight rounded-2xl border border-brand-border">
        {imageUrl ? (
          <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden border-2 border-brand-border shadow-xs bg-white shrink-0 group">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded">Preview</span>
            </div>
          </div>
        ) : (
          <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-xl bg-purple-100/70 border-2 border-dashed border-purple-300 flex flex-col items-center justify-center text-brand-primary shrink-0">
            <ImageIcon className="w-6 h-6 mb-1 opacity-70" />
            <span className="text-[10px] font-bold">No Image</span>
          </div>
        )}

        <div className="flex-1 w-full space-y-2">
          {useUrlInput ? (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-bgLight shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : imageUrl ? 'Replace Image' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {isUploading && (
                <span className="text-xs text-brand-muted flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                  <span>Processing...</span>
                </span>
              )}
            </div>
          )}

          <p className="text-[11px] text-brand-muted leading-tight truncate">
            {imageUrl ? imageUrl : helperText}
          </p>
        </div>
      </div>
    </div>
  );
}
