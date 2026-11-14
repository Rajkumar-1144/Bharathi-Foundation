'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { imageService } from '@/services/imageService';
import { Heart, Copy, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DonorDonatePage() {
  const { currentUser } = useAuth();
  const { websiteContent, submitDonationClaim, donors } = useAppData();
  const currentDonor = donors.find((d) => d.userId === currentUser?.id) || donors[0];

  const [amount, setAmount] = useState<number | ''>(2000);
  const [utrReference, setUtrReference] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('Emergency Blood Drive & Mobile Dispensary');
  const [purpose, setPurpose] = useState('Food Donation');
  const [otherPurpose, setOtherPurpose] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState('');

  const qrSettings = websiteContent.qrSettings;
  const isQrPublished = qrSettings ? qrSettings.isPublished : true;
  const activeUpiId = qrSettings?.upiId || websiteContent.upiId;
  const activeQrCodeUrl = qrSettings?.qrCodeUrl || websiteContent.qrCodeUrl || '/bharathi_logo.png';
  const activeAccountHolder = qrSettings?.accountHolderName || websiteContent.upiName;
  const activeInstructions = qrSettings?.paymentInstructions || 'Scan with Google Pay, PhonePe, Paytm, or BHIM';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await imageService.processImageUpload(e.target.files[0], 800, 800, 0.7);
        setScreenshotPreview(compressed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !utrReference) return;

    if (purpose === 'Other' && !otherPurpose.trim()) {
      alert('Please specify your donation purpose.');
      return;
    }

    const finalPurpose = purpose === 'Other' ? otherPurpose.trim() : purpose;

    submitDonationClaim({
      donorId: currentDonor?.id,
      donorName: currentDonor?.name || currentUser?.name || 'Patron Donor',
      donorEmail: currentDonor?.email || currentUser?.email || 'donor@bharathifoundation.org',
      donorPhone: currentDonor?.phone || currentUser?.phone || '+91 98711 22334',
      donorPan: currentDonor?.panNumber,
      amount: Number(amount),
      utrReference: utrReference.trim(),
      paymentMethod: 'UPI',
      campaignTitle,
      purpose: finalPurpose,
      otherPurpose: purpose === 'Other' ? otherPurpose.trim() : undefined,
      screenshotUrl: screenshotPreview || undefined,
    });

    setSubmittedMsg(
      `Donation claim for ₹${Number(amount).toLocaleString(
        'en-IN'
      )} towards "${finalPurpose}" with UTR #${utrReference} submitted! Status: PENDING VERIFICATION. Once reconciled by our treasury team, your 80G receipt will be generated.`
    );
    setUtrReference('');
    setOtherPurpose('');
    setScreenshotPreview(null);
  };

  return (
    <DashboardLayout
      allowedRole="DONOR"
      title="Make a Direct Donation (UPI)"
      subtitle="Scan our verified UPI QR code, make the payment, and submit your 12-digit UTR reference"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left QR Display */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs text-center space-y-4">
          {!isQrPublished ? (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">UPI Payment Offline</h4>
              <p className="text-xs text-amber-700">UPI QR donations are temporarily offline for maintenance.</p>
            </div>
          ) : (
            <>
              <div className="inline-block p-4 bg-brand-bgLight rounded-2xl border border-brand-border">
                <div className="w-56 h-56 mx-auto relative flex flex-col items-center justify-center p-2 border-2 border-brand-primary/20 rounded-xl bg-white">
                  <div className="relative w-48 h-48">
                    <Image src={activeQrCodeUrl} alt="Bharathi Foundation UPI QR" fill className="object-contain" />
                  </div>
                  <div className="absolute inset-x-2 bottom-2 bg-brand-primary text-white py-1 rounded text-[10px] font-bold">
                    SCAN WITH GPAY / PHONEPE / PAYTM
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-brand-muted font-bold uppercase">Official UPI ID</p>
                <div className="mt-1 inline-flex items-center gap-2 bg-brand-bgLight px-4 py-2 rounded-xl border border-brand-border">
                  <span className="font-mono text-sm font-bold text-brand-primary">{activeUpiId}</span>
                  <button onClick={handleCopy} className="p-1 rounded-md text-brand-muted hover:text-brand-primary">
                    {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-brand-muted mt-2 font-medium">A/C: {activeAccountHolder}</p>
                {activeInstructions && (
                  <p className="text-[11px] text-brand-muted mt-1 italic">{activeInstructions}</p>
                )}
              </div>
            </>
          )}

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Eligible for 50% deduction under Section 80G of the Income Tax Act.</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <h3 className="font-bold text-lg text-brand-primaryDark">Submit UTR Reference</h3>

          {submittedMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{submittedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-2">Select Donation Amount</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      amount === amt
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white text-brand-text border-brand-border hover:bg-brand-bgLight'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                required
                placeholder="Or enter custom amount in INR"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">
                Purpose of Donation <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              >
                <option value="Food Donation">Food Donation</option>
                <option value="Old Age Home Support">Old Age Home Support</option>
                <option value="Child Care Home Support">Child Care Home Support</option>
                <option value="Blood Donation Camps">Blood Donation Camps</option>
                <option value="Medical Camps & Healthcare">Medical Camps & Healthcare</option>
                <option value="Education Support">Education Support</option>
                <option value="Emergency Relief">Emergency Relief</option>
                <option value="General Foundation Support">General Foundation Support</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {purpose === 'Other' && (
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  Please Specify Your Donation Purpose <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the reason for your donation"
                  value={otherPurpose}
                  onChange={(e) => setOtherPurpose(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border-2 border-brand-primary/40 focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Target Welfare Initiative</label>
              <select
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              >
                <option value="Emergency Blood Drive & Mobile Dispensary">Emergency Blood Drive & Mobile Dispensary</option>
                <option value="Rural Eye Checkup & Cataract Surgery Fund">Rural Eye Checkup & Cataract Surgery Fund</option>
                <option value="Food Donation & Community Hunger Relief">Food Donation & Community Hunger Relief</option>
                <option value="General Charitable Trust Corpus">General Charitable Trust Corpus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">
                12-Digit Bank UTR / Transaction Reference ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 420394857192"
                value={utrReference}
                onChange={(e) => setUtrReference(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border font-mono border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Upload Payment Screenshot (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-bgLight file:text-brand-primary"
              />
              {screenshotPreview && (
                <div className="mt-2 relative w-24 h-24 rounded-xl border border-brand-border overflow-hidden">
                  <Image src={screenshotPreview} alt="Screenshot Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Submit Donation Claim</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

