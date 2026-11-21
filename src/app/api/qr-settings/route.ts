import { NextResponse } from 'next/server';
import { qrSettingsService, QrSettingsRecord } from '@/services/qrSettingsService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await qrSettingsService.getSettings();
    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/qr-settings GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve QR settings',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.upiId || typeof body.upiId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Official UPI VPA ID is required.' },
        { status: 400 }
      );
    }

    const upiRegex = /^[a-zA-Z0-9.\-_]{2,100}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(body.upiId.trim())) {
      return NextResponse.json(
        { success: false, error: 'Invalid UPI VPA ID format (must be username@bank, e.g. bharathi@sbi).' },
        { status: 400 }
      );
    }

    if (!body.accountHolderName || typeof body.accountHolderName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Account holder / Trust name is required.' },
        { status: 400 }
      );
    }

    const payload: QrSettingsRecord = {
      id: 'default',
      qrCodeUrl: body.qrCodeUrl || '',
      upiId: body.upiId.trim(),
      accountHolderName: body.accountHolderName.trim(),
      paymentInstructions: (body.paymentInstructions || '').trim(),
      isPublished: body.isPublished !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy,
    };

    const result = await qrSettingsService.saveSettings(payload);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to save QR settings to database.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/qr-settings POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process QR settings request',
      },
      { status: 500 }
    );
  }
}
