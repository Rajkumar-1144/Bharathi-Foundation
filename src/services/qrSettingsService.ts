import fs from 'fs';
import path from 'path';

export interface QrSettingsRecord {
  id?: string;
  qrCodeUrl: string;
  upiId: string;
  accountHolderName: string;
  paymentInstructions: string;
  isPublished: boolean;
  updatedAt: string;
  updatedBy?: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id') &&
    SUPABASE_URL.startsWith('http')
);

// File-based server persistence directory and path
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE_PATH = path.join(DATA_DIR, 'qrSettings.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'qr');

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export const qrSettingsService = {
  /**
   * Retrieves the current QR settings from Supabase or server file storage.
   */
  async getSettings(): Promise<QrSettingsRecord | null> {
    ensureDirectories();

    // 1. Try Supabase cloud database if configured
    if (isSupabaseConfigured) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/qr_settings?id=eq.default&select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            cache: 'no-store',
          }
        );

        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const row = rows[0];
            const mapped: QrSettingsRecord = {
              id: row.id,
              qrCodeUrl: row.qr_image_url || '',
              upiId: row.upi_id || '',
              accountHolderName: row.account_holder_name || '',
              paymentInstructions: row.payment_instructions || '',
              isPublished: row.is_published !== false,
              updatedAt: row.updated_at || new Date().toISOString(),
              updatedBy: row.updated_by,
            };
            // Cache locally for offline resilience
            try {
              fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(mapped, null, 2), 'utf-8');
            } catch {}
            return mapped;
          }
        }
      } catch (err) {
        console.warn('[QR Service] Remote Supabase query failed, falling back to persistent server storage:', err);
      }
    }

    // 2. Read from persistent server file storage
    try {
      if (fs.existsSync(SETTINGS_FILE_PATH)) {
        const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
        return JSON.parse(content) as QrSettingsRecord;
      }
    } catch (err) {
      console.error('[QR Service] Failed reading persistent settings file:', err);
    }

    return null;
  },

  /**
   * Saves and publishes QR settings to Supabase and server file storage.
   */
  async saveSettings(settings: QrSettingsRecord): Promise<{ success: boolean; data?: QrSettingsRecord; error?: string }> {
    ensureDirectories();

    const recordToSave: QrSettingsRecord = {
      id: 'default',
      qrCodeUrl: settings.qrCodeUrl || '',
      upiId: settings.upiId.trim(),
      accountHolderName: settings.accountHolderName.trim(),
      paymentInstructions: settings.paymentInstructions.trim(),
      isPublished: Boolean(settings.isPublished),
      updatedAt: new Date().toISOString(),
      updatedBy: settings.updatedBy,
    };

    let supabaseSaved = false;

    // 1. Try persisting to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/qr_settings`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=representation',
          },
          body: JSON.stringify({
            id: 'default',
            qr_image_url: recordToSave.qrCodeUrl,
            upi_id: recordToSave.upiId,
            account_holder_name: recordToSave.accountHolderName,
            payment_instructions: recordToSave.paymentInstructions,
            is_published: recordToSave.isPublished,
            updated_at: recordToSave.updatedAt,
          }),
        });

        if (response.ok) {
          supabaseSaved = true;
          console.log('[QR Service] Successfully synced to Supabase qr_settings table.');
        } else {
          const errText = await response.text();
          console.warn('[QR Service] Supabase save returned error status:', response.status, errText);
        }
      } catch (err) {
        console.warn('[QR Service] Supabase save network error:', err);
      }
    }

    // 2. Always persist to server-side filesystem storage
    try {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(recordToSave, null, 2), 'utf-8');
      return { success: true, data: recordToSave };
    } catch (err: any) {
      console.error('[QR Service] Failed writing to local server storage:', err);
      if (supabaseSaved) {
        return { success: true, data: recordToSave };
      }
      return { success: false, error: err?.message || 'Failed to persist QR settings to server storage.' };
    }
  },

  /**
   * Persists an uploaded image buffer to Supabase Storage or server static directory.
   */
  async saveUploadedImage(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    ensureDirectories();

    let remoteUrl: string | null = null;

    // 1. If Supabase is configured, attempt upload to Supabase Storage bucket 'qr-codes'
    if (isSupabaseConfigured) {
      try {
        const uploadRes = await fetch(
          `${SUPABASE_URL}/storage/v1/object/qr-codes/${encodeURIComponent(filename)}`,
          {
            method: 'POST',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': mimeType,
              'x-upsert': 'true',
            },
            body: new Uint8Array(fileBuffer),
          }
        );

        if (uploadRes.ok) {
          remoteUrl = `${SUPABASE_URL}/storage/v1/object/public/qr-codes/${encodeURIComponent(filename)}`;
          console.log('[QR Service] Uploaded to Supabase Storage:', remoteUrl);
        } else {
          console.warn('[QR Service] Supabase Storage upload skipped/failed with status:', uploadRes.status);
        }
      } catch (err) {
        console.warn('[QR Service] Supabase Storage upload error:', err);
      }
    }

    // 2. Write to persistent local public directory: /public/uploads/qr/[filename]
    try {
      const localFilePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(localFilePath, fileBuffer);
      const localPublicUrl = `/uploads/qr/${filename}`;

      // Return remote Supabase URL if successful, otherwise local public URL
      const finalUrl = remoteUrl || localPublicUrl;
      return { success: true, url: finalUrl };
    } catch (err: any) {
      console.error('[QR Service] Failed saving uploaded file to server disk:', err);
      if (remoteUrl) {
        return { success: true, url: remoteUrl };
      }
      return { success: false, error: err?.message || 'Failed to save uploaded QR file.' };
    }
  },
};
