export const imageService = {
  /**
   * Reads a browser File and returns a compressed data URL string
   */
  async processImageUpload(file: File, maxWidth = 1000, maxHeight = 800, quality = 0.75): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Selected file is not an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize maintaining aspect ratio
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image into canvas'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Validates a candidate QR image file against allowed mime types and maximum 5MB size limit.
   */
  validateQrImage(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file format. Please upload a PNG, JPG, or WebP image.',
      };
    }
    if (file.size > 5 * 1024 * 1024) {
      return {
        valid: false,
        error: 'File size exceeds 5MB limit. Please upload an optimized scannable image.',
      };
    }
    return { valid: true };
  },

  /**
   * Uploads an image to permanent shared storage (Supabase Storage / persistent public server folder).
   * Never returns a temporary browser blob: URL.
   */
  async uploadPersistentQrImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const validation = this.validateQrImage(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/qr-settings/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || `Upload failed with status code ${res.status}`,
        };
      }

      return {
        success: true,
        url: data.url,
      };
    } catch (err: any) {
      console.error('[imageService] Upload exception:', err);
      return {
        success: false,
        error: err?.message || 'Network error occurred while uploading QR image to permanent storage.',
      };
    }
  },

  /**
   * Uploads any CMS image (services, stories, gallery, campaigns, hero) to persistent storage.
   * Never returns a temporary blob: URL.
   */
  async uploadCmsImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const validation = this.validateQrImage(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        return { success: true, url: data.url };
      }

      // Fallback: client-side compressed data URL
      const compressed = await this.processImageUpload(file);
      return { success: true, url: compressed };
    } catch (err: any) {
      console.warn('[imageService] Server upload error, using local processed fallback:', err);
      try {
        const compressed = await this.processImageUpload(file);
        return { success: true, url: compressed };
      } catch (innerErr: any) {
        return {
          success: false,
          error: innerErr?.message || 'Failed to process and store image.',
        };
      }
    }
  },
};

