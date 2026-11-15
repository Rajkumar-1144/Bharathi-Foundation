import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const VALID_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id') &&
    SUPABASE_URL.startsWith('http')
);

const CMS_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'cms');

function ensureDirectory() {
  if (!fs.existsSync(CMS_UPLOADS_DIR)) {
    fs.mkdirSync(CMS_UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file was provided for upload.' },
        { status: 400 }
      );
    }

    // 1. Validate file format
    if (!VALID_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file format. Please upload a PNG, JPG, or WebP image.',
        },
        { status: 400 }
      );
    }

    // 2. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 5MB limit. Please upload an optimized image.',
        },
        { status: 400 }
      );
    }

    // 3. Determine file extension
    let extension = 'png';
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      extension = 'jpg';
    } else if (file.type === 'image/webp') {
      extension = 'webp';
    }

    const cleanBaseName = file.name
      ? file.name.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30)
      : 'img';
    const filename = `cms-${cleanBaseName}-${Date.now()}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Try Supabase storage upload if configured
    let uploadedUrl = '';
    if (isSupabaseConfigured) {
      try {
        const uploadRes = await fetch(
          `${SUPABASE_URL}/storage/v1/object/cms-images/${encodeURIComponent(filename)}`,
          {
            method: 'POST',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': file.type,
              'x-upsert': 'true',
            },
            body: buffer,
          }
        );

        if (uploadRes.ok) {
          uploadedUrl = `${SUPABASE_URL}/storage/v1/object/public/cms-images/${encodeURIComponent(filename)}`;
        }
      } catch (err) {
        console.warn('[CMS Upload] Supabase upload failed, falling back to local file storage:', err);
      }
    }

    // 5. Fallback or primary local filesystem storage
    if (!uploadedUrl) {
      ensureDirectory();
      const filePath = path.join(CMS_UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      uploadedUrl = `/uploads/cms/${filename}`;
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
      filename,
    });
  } catch (error: any) {
    console.error('[API /api/cms/upload] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Server error processing CMS image upload.',
      },
      { status: 500 }
    );
  }
}
