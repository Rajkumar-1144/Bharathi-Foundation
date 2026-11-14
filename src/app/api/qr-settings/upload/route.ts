import { NextResponse } from 'next/server';
import { qrSettingsService } from '@/services/qrSettingsService';

export const dynamic = 'force-dynamic';

const VALID_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
          error: 'File size exceeds 5MB limit. Please upload an optimized scannable image.',
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

    const filename = `upi-qr-${Date.now()}.${extension}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Save to persistent storage (Supabase Storage / public/uploads/qr)
    const result = await qrSettingsService.saveUploadedImage(buffer, filename, file.type);

    if (!result.success || !result.url) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to save QR image to persistent storage.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      filename,
    });
  } catch (error: any) {
    console.error('[API /api/qr-settings/upload] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Server error processing QR image upload.',
      },
      { status: 500 }
    );
  }
}
