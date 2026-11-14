'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { imageService } from '@/services/imageService';
import { Heart, Copy, Check, Upload, ShieldCheck, ArrowRight, AlertCircle, FileText } from 'lucide-react';

export default function DonatePage() {
  const { websiteContent, submitDonationClaim, donations, expenditures } = useAppData();

  const [amount, setAmount] = useState<number | ''>(1000);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [utrReference, setUtrReference] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('Emergency Blood Drive & Mobile Dispensary');
  const [purpose, setPurpose] = useState('Food Donation');
  const [otherPurpose, setOtherPurpose] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronized QR Settings from shared database
  const [dbQrSettings, setDbQrSettings] = useState<{
    qrCodeUrl: string;
    upiId: string;
    accountHolderName: string;
    paymentInstructions: string;
    isPublished: boolean;
    updatedAt?: string;
  } | null>(null);

  const fetchLatestQr = async () => {
    try {
      const res = await fetch('/api/qr-settings', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDbQrSettings(json.data);
        }
      }
    } catch (err) {
      console.warn('[Donate Page] Could not fetch remote QR settings:', err);
    }
  };

  useEffect(() => {
    fetchLatestQr();

    // Revalidate when user navigates back to tab
    const handleFocus = () => {
      fetchLatestQr();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Determine active QR settings strictly from the shared database record
  const effectiveQr = dbQrSettings !== null ? dbQrSettings : websiteContent.qrSettings;
  const isQrPublished = Boolean(
    effectiveQr &&
      effectiveQr.isPublished !== false &&
      effectiveQr.upiId?.trim() &&
      effectiveQr.qrCodeUrl?.trim()
  );

  const activeUpiId = isQrPublished ? (effectiveQr?.upiId || '') : '';
  const activeUpiName = isQrPublished ? (effectiveQr?.accountHolderName || '') : '';
  const activeQrCodeUrl = isQrPublished ? (effectiveQr?.qrCodeUrl || '') : '';
  const paymentInstructions = isQrPublished
    ? (effectiveQr?.paymentInstructions || 'Scan with Google Pay, PhonePe, Paytm or BHIM UPI')
    : '';

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
        console.error('File upload error:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !donorName || !donorEmail || !donorPhone || !utrReference) {
      alert('Please fill in all mandatory fields and provide your 12-digit UPI UTR number.');
      return;
    }

    if (purpose === 'Other' && !otherPurpose.trim()) {
      alert('Please specify your donation purpose.');
      return;
    }

    const finalPurpose = purpose === 'Other' ? otherPurpose.trim() : purpose;

    setIsSubmitting(true);
    const newId = submitDonationClaim({
      donorName,
      donorEmail,
      donorPhone,
      donorPan: donorPan || undefined,
      amount: Number(amount),
      utrReference: utrReference.trim(),
      paymentMethod: 'UPI',
      campaignTitle,
      purpose: finalPurpose,
      otherPurpose: purpose === 'Other' ? otherPurpose.trim() : undefined,
      screenshotUrl: screenshotPreview || undefined,
    });

    setSubmittedSuccess(
      `Your transaction reference #${utrReference} for INR ${Number(amount).toLocaleString(
        'en-IN'
      )} towards "${finalPurpose}" has been recorded successfully. Status: PENDING VERIFICATION. Once reconciled by our treasury administrator against banking statements, your official 80G tax receipt will be downloadable in your Donor Dashboard.`
    );
    setIsSubmitting(false);

    // Reset form
    setUtrReference('');
    setOtherPurpose('');
    setScreenshotPreview(null);
  };

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      <section className="bg-brand-bgLight py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border">
            100% Transparent Giving
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">Contribute via Direct UPI</h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            Zero intermediary commissions. Every rupee goes directly to healthcare camps, blood bags, and child nourishment.
          </p>
        </div>
      </section>

      {/* FINANCIAL TRANSPARENCY & UTILIZATION BREAKDOWN */}
      <section className="py-16 bg-brand-bgLight/60 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Full Transparency & Accountability
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-primaryDark">
              How Your Contributions Transform Lives
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Bharathi Foundation operates on 100% direct-allocation policy. Every rupee donated is deployed directly into field operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-brand-border shadow-xs text-center">
              <span className="text-xs font-bold text-brand-muted">Total Verified Donations</span>
              <p className="text-3xl font-black text-brand-primary mt-2">
                ₹{donations.filter((d) => d.status === 'VERIFIED').reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">100% Publicly Audited</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-brand-border shadow-xs text-center">
              <span className="text-xs font-bold text-brand-muted">Utilized in Grassroots Drives</span>
              <p className="text-3xl font-black text-emerald-600 mt-2">
                ₹{expenditures.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-brand-muted font-medium mt-1">Direct Field Expenditure</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-brand-border shadow-xs text-center">
              <span className="text-xs font-bold text-brand-muted">Emergency Reserve Balance</span>
              <p className="text-3xl font-black text-purple-600 mt-2">
                ₹{Math.max(
                  0,
                  donations.filter((d) => d.status === 'VERIFIED').reduce((sum, d) => sum + d.amount, 0) -
                  expenditures.reduce((sum, e) => sum + e.amount, 0)
                ).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-brand-muted font-medium mt-1">Standby for Immediate SOS Relief</p>
            </div>
          </div>

          {/* Program-wise Allocation Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xs space-y-4">
            <h3 className="text-base font-bold text-brand-text">Expenditure Breakdown by Program</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Food Donation & Warm Meals</span>
                  <span className="text-amber-700">35% • ₹2,52,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Blood Donation Camps & Cold-Chain Storage</span>
                  <span className="text-red-700">30% • ₹2,16,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Free Healthcare Checkups & Medicines</span>
                  <span className="text-brand-primary">20% • ₹1,44,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Emergency Disaster & Hospital SOS Support</span>
                  <span className="text-emerald-700">15% • ₹1,08,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left QR Section */}
            <div className="lg:col-span-5 bg-brand-bgLight rounded-3xl p-8 border border-brand-border text-center space-y-6">
              {!isQrPublished ? (
                <div className="p-8 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="font-bold text-amber-900 text-sm">UPI Payments Temporarily Offline</h4>
                  <p className="text-xs text-amber-700">
                    Online UPI QR code donations are temporarily paused for scheduled banking reconciliation. Please check back shortly or reach out to our treasury support.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-white rounded-2xl border border-brand-border shadow-md inline-block">
                    <div className="w-64 h-64 mx-auto relative flex flex-col items-center justify-center p-3 border-2 border-brand-primary/20 rounded-xl">
                      <div className="relative w-56 h-56">
                        <Image
                          src={activeQrCodeUrl}
                          alt="Bharathi Foundation UPI QR Code"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute inset-x-3 bottom-2 bg-brand-primary text-white py-1 rounded-md text-[10px] font-bold">
                        SCAN WITH ANY UPI APP
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-brand-muted font-bold uppercase tracking-wider">Official Foundation UPI ID</p>
                    <div className="mt-1.5 inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-brand-border shadow-xs">
                      <span className="font-mono text-base font-bold text-brand-primary">{activeUpiId}</span>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-bgLight transition-colors"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-brand-muted mt-2 font-medium">Account Name: {activeUpiName}</p>
                    {paymentInstructions && (
                      <p className="text-xs text-brand-muted mt-1 italic">{paymentInstructions}</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-3 text-left text-xs text-brand-muted border-t border-brand-border/60 pt-4">
                <p className="font-bold text-brand-text">Simple 3-Step Donation Process:</p>
                <ol className="space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Open Google Pay, PhonePe, Paytm, or BHIM and scan the QR code above or enter the UPI ID.</li>
                  <li>Complete the payment for your desired amount.</li>
                  <li>Copy the 12-digit UTR / UPI Transaction ID from your payment receipt and submit it here.</li>
                </ol>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>All donations are 50% tax exempt under Section 80G of the Indian Income Tax Act.</span>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xl">
              <h2 className="text-2xl font-black text-brand-primaryDark mb-2">Submit Payment Confirmation</h2>
              <p className="text-xs text-brand-muted mb-6">
                Please provide your transaction details so our finance team can verify and issue your Section 80G receipt.
              </p>

              {submittedSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl leading-relaxed flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Claim Recorded Successfully!</p>
                    <p className="mt-1">{submittedSuccess}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Selection */}
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-2">Contribution Amount (INR) *</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[100, 500, 1000, 5000].map((amt) => (
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
                    placeholder="Custom amount in INR"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    Purpose of Donation <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
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
                      className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-brand-primary/40 focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Earmark for Campaign</label>
                  <select
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  >
                    <option value="Emergency Blood Drive & Mobile Dispensary">Emergency Blood Drive & Mobile Dispensary</option>
                    <option value="Rural Eye Checkup & Cataract Surgery Fund">Rural Eye Checkup & Cataract Surgery Fund</option>
                    <option value="Food Donation & Community Hunger Relief">Food Donation & Community Hunger Relief</option>
                    <option value="General Charitable Trust Corpus">General Charitable Trust Corpus</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Donor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Savitri Sundaram"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Email (for 80G Tax Receipt) *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. savitri@gmail.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98400 00000"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      PAN Card Number <span className="text-brand-muted font-normal">(Required for 80G receipt)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FGHIJ5678K"
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border uppercase focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    12-Digit Bank UTR / UPI Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 422910293847"
                    value={utrReference}
                    onChange={(e) => setUtrReference(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-brand-border font-mono focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  />
                  <p className="text-[11px] text-brand-muted mt-1">
                    Found in your bank SMS or inside Google Pay / PhonePe transaction details.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    Upload Payment Screenshot <span className="text-brand-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-bgLight file:text-brand-primary hover:file:bg-brand-secondary/20"
                  />
                  {screenshotPreview && (
                    <div className="mt-2 relative w-32 h-32 rounded-xl border border-brand-border overflow-hidden">
                      <Image src={screenshotPreview} alt="Screenshot Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    <strong>Note:</strong> Submitting a UTR reference records the claim as &ldquo;Pending Verification&rdquo;.
                    Receipts are compiled once our auditors confirm receipt on the bank statement.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Submit Donation Reference</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FINANCIAL TRANSPARENCY & UTILIZATION BREAKDOWN */}
      <section className="py-16 bg-brand-bgLight/60 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Full Transparency & Accountability
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-primaryDark">
              How Your Contributions Transform Lives
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Bharathi Foundation operates on 100% direct-allocation policy. Every rupee donated is deployed directly into field operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-brand-border shadow-xs text-center">
              <span className="text-xs font-bold text-brand-muted">Total Verified Donations</span>
              <p className="text-3xl font-black text-brand-primary mt-2">
                ₹{donations.filter((d) => d.status === 'VERIFIED').reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">100% Publicly Audited</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-brand-border shadow-xs text-center">
              <span className="text-xs font-bold text-brand-muted">Utilized in Grassroots Drives</span>
              <p className="text-3xl font-black text-emerald-600 mt-2">
                ₹{expenditures.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-brand-muted font-medium mt-1">Direct Field Expenditure</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-brand-border shadow-xs text-center">
              <span className="text-xs font-bold text-brand-muted">Emergency Reserve Balance</span>
              <p className="text-3xl font-black text-purple-600 mt-2">
                ₹{Math.max(
                  0,
                  donations.filter((d) => d.status === 'VERIFIED').reduce((sum, d) => sum + d.amount, 0) -
                  expenditures.reduce((sum, e) => sum + e.amount, 0)
                ).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-brand-muted font-medium mt-1">Standby for Immediate SOS Relief</p>
            </div>
          </div>

          {/* Program-wise Allocation Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xs space-y-4">
            <h3 className="text-base font-bold text-brand-text">Expenditure Breakdown by Program</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Food Donation & Warm Meals</span>
                  <span className="text-amber-700">35% • ₹2,52,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Blood Donation Camps & Cold-Chain Storage</span>
                  <span className="text-red-700">30% • ₹2,16,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Free Healthcare Checkups & Medicines</span>
                  <span className="text-brand-primary">20% • ₹1,44,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-brand-text">Emergency Disaster & Hospital SOS Support</span>
                  <span className="text-emerald-700">15% • ₹1,08,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

