'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import {
  QrCode,
  CheckCircle2,
  Save,
  Upload,
  Trash2,
  RefreshCw,
  Eye,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function AdminQrManagementPage() {
  const { websiteContent, updateWebsiteContent, addAuditLog } = useAppData();

  const currentQr = websiteContent.qrSettings || {
    qrCodeUrl: websiteContent.qrCodeUrl || '/images/bharathi-logo.png',
    upiId: websiteContent.upiId || 'bharathifoundation@upi',
    accountHolderName: websiteContent.upiName || 'BHARATHI FOUNDATION TRUST',
    paymentInstructions:
      'Scan the official Bharathi Foundation QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM, or Banking UPI). Keep your 12-digit UTR reference number handy to claim your instant 80G Tax Exemption receipt.',
    isPublished: true,
    updatedAt: new Date().toISOString(),
  };

  const [qrCodeUrl, setQrCodeUrl] = useState(currentQr.qrCodeUrl);
  const [upiId, setUpiId] = useState(currentQr.upiId);
  const [accountHolderName, setAccountHolderName] = useState(currentQr.accountHolderName);
  const [paymentInstructions, setPaymentInstructions] = useState(currentQr.paymentInstructions);
  const [isPublished, setIsPublished] = useState(currentQr.isPublished !== false);

  const [notification, setNotification] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: PNG, JPG, WebP
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file format. Please upload a PNG, JPG, or WebP image.');
      return;
    }

    // Validate size: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit. Please upload an optimized image.');
      return;
    }

    // Convert to Object URL (non-base64 persistent URL simulation)
    const previewUrl = URL.createObjectURL(file);
    setQrCodeUrl(previewUrl);
    setNotification('New QR code image loaded! Click "Save & Publish QR Settings" to broadcast changes.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      qrCodeUrl,
      upiId: upiId.trim(),
      accountHolderName: accountHolderName.trim(),
      paymentInstructions: paymentInstructions.trim(),
      isPublished,
      updatedAt: new Date().toISOString(),
    };

    updateWebsiteContent({
      qrSettings: updatedSettings,
      upiId: upiId.trim(),
      upiName: accountHolderName.trim(),
      qrCodeUrl,
    });

    addAuditLog(
      'UPDATE_UPI_QR',
      `Admin updated official UPI QR configuration (UPI: ${upiId}, Status: ${isPublished ? 'Published' : 'Unpublished'})`
    );

    setNotification('UPI QR Settings saved and synchronized with public donation pages successfully!');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResetToDefault = () => {
    setQrCodeUrl('/images/bharathi-logo.png');
    setUpiId('bharathifoundation@upi');
    setAccountHolderName('BHARATHI FOUNDATION TRUST');
    setPaymentInstructions(
      'Scan the official Bharathi Foundation QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM, or Banking UPI). Keep your 12-digit UTR reference number handy to claim your instant 80G Tax Exemption receipt.'
    );
    setIsPublished(true);
    setNotification('Reset to Bharathi Foundation official defaults. Click Save to persist.');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="UPI QR Code & Gateway Management"
      subtitle="Configure trust bank UPI VPA, upload/replace scannable QR imagery, and control public donation visibility"
    >
      {/* Toast Notification */}
      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Synchronized Status Pill */}
      <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-brand-primary">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-primaryDark flex items-center gap-2">
              <span>Public Gateway Status:</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {isPublished ? 'Active & Published' : 'Offline / Unpublished'}
              </span>
            </h3>
            <p className="text-xs text-brand-muted">
              Last modified: {new Date(currentQr.updatedAt || new Date()).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/donate"
            target="_blank"
            className="px-4 py-2 text-xs font-bold text-brand-primary bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>View Public Donation Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2 text-xs font-bold text-brand-muted hover:text-brand-text bg-brand-bgLight hover:bg-white border border-brand-border rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live QR Preview Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xs space-y-6 text-center flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-bgLight px-3 py-1 rounded-full border border-brand-border inline-block">
              Live Scannable Preview
            </span>

            {/* Simulated QR Box */}
            <div className="p-6 bg-gradient-to-br from-brand-bgLight via-purple-50/50 to-white rounded-3xl border-2 border-brand-border/80 shadow-md relative group">
              <div className="relative w-56 h-56 mx-auto rounded-2xl overflow-hidden bg-white p-3 shadow-inner flex items-center justify-center">
                <Image
                  src={qrCodeUrl || '/images/bharathi-logo.png'}
                  alt="Scannable UPI QR"
                  fill
                  className="object-contain p-2"
                />
              </div>

              {!isPublished && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center text-white p-4 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-xs font-bold">QR Is Currently Unpublished</p>
                  <span className="text-[10px] text-gray-300">Public visitors will see offline notice</span>
                </div>
              )}
            </div>

            {/* UPI Details Pill */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-brand-bgLight px-4 py-2 rounded-xl border border-brand-border">
                <code className="text-xs font-mono font-bold text-brand-primary">{upiId}</code>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="text-brand-muted hover:text-brand-primary"
                  title="Copy UPI VPA"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs font-semibold text-brand-primaryDark">{accountHolderName}</p>
            </div>

            {/* Payment Instructions Preview */}
            <div className="p-3 bg-brand-bgLight rounded-2xl border border-brand-border text-left">
              <span className="text-[10px] font-bold text-brand-primary block uppercase">Instructions Displayed:</span>
              <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">{paymentInstructions}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/60">
            <label className="flex items-center justify-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-brand-primary cursor-pointer"
              />
              <span className="text-xs font-bold text-brand-primaryDark">
                Publish this UPI QR actively on Public Website
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Edit & Upload Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="border-b border-brand-border/60 pb-3">
              <h3 className="text-base font-bold text-brand-primaryDark">QR Code Image & Gateway Credentials</h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Upload official bank generated BharatQR, PhonePe, or GooglePay QR code asset.
              </p>
            </div>

            {fileError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* QR Image Source */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-text">1. Upload QR Image (PNG, JPG, WebP)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex-1 border-2 border-dashed border-brand-border hover:border-brand-primary rounded-2xl p-4 text-center cursor-pointer transition-colors bg-brand-bgLight/40 hover:bg-brand-bgLight">
                  <Upload className="w-6 h-6 text-brand-primary mx-auto mb-1" />
                  <span className="text-xs font-bold text-brand-primary block">Select File from Computer</span>
                  <span className="text-[10px] text-brand-muted">Max 5MB • High resolution scannable</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-brand-muted mb-1">
                  Or Direct Image URL (Cloud / Supabase CDN):
                </label>
                <input
                  type="url"
                  value={qrCodeUrl}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                />
              </div>
            </div>

            {/* Credentials Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Official UPI VPA ID *</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="bharathifoundation@upi"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Account Holder / Trust Name *</label>
                <input
                  type="text"
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="BHARATHI FOUNDATION TRUST"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Payment & 80G Claim Instructions *</label>
              <textarea
                rows={3}
                required
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden resize-none"
              />
            </div>

            <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setQrCodeUrl('')}
                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Image</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish QR Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
