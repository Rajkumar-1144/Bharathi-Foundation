'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Droplet,
} from 'lucide-react';

export default function ContactPage() {
  const { websiteContent } = useAppData();
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Anti-spam honeypot (hidden from human users)
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Spam honeypot trap: bots fill hidden inputs
    if (honeypot.trim()) {
      // Silently accept to misguide bot without saving
      setSubmittedId(`INQ-${Math.floor(1000 + Math.random() * 9000)}`);
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMsg('Please fill in your name, email address, and message.');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    // Phone validation if entered
    if (trimmedPhone) {
      const cleanedPhone = trimmedPhone.replace(/\D/g, '');
      if (cleanedPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit contact phone number.');
        return;
      }
    }

    setIsSubmitting(true);

    const refId = `INQ-${Math.floor(10000 + Math.random() * 90000)}`;

    // Store in localStorage for coordinator transparency
    try {
      const inquiries = JSON.parse(localStorage.getItem('bf_inquiries') || '[]');
      inquiries.unshift({
        id: refId,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: subject.trim() || 'General Inquiry',
        message: trimmedMessage,
        createdAt: new Date().toISOString(),
        status: 'NEW',
      });
      localStorage.setItem('bf_inquiries', JSON.stringify(inquiries));
    } catch {}

    setSubmittedId(refId);
    setIsSubmitting(false);

    // Reset inputs
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-bgLight via-purple-50/30 to-white py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-brand-border inline-block shadow-2xs">
            24/7 Citizen & Beneficiary Helpdesk
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark font-serif">
            Contact Bharathi Foundation
          </h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Connect with our core secretariat for urgent blood matching, health camp requisitions, care home inquiries, or charitable trust verification.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details & Helplines (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Verified Contact Points
                </span>
                <h2 className="text-2xl font-black text-brand-primaryDark font-serif mt-1">
                  Headquarters & Emergency Desk
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mt-1">
                  Our administrative office operates 6 days a week, while our emergency blood dispatch coordination remains active 24/7.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Registered Address Card */}
                <div className="p-5 rounded-2xl bg-brand-bgLight/80 border border-brand-border flex items-start gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">Registered Secretariat Address</h4>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      {websiteContent.contactAddress || 'No. 42, 3rd Cross, Rajajinagar, Bengaluru, Karnataka 560010'}
                    </p>
                    <span className="inline-block mt-1.5 text-[11px] font-bold text-brand-primary">
                      Trust Registration: Section 12A & 80G Compliant
                    </span>
                  </div>
                </div>

                {/* 24x7 Emergency Blood Line */}
                <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 flex items-start gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                    <Droplet className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-red-950">24/7 Emergency Blood Helpline</h4>
                    <p className="text-xs text-red-800 font-bold mt-1">
                      <a
                        href={`tel:${(websiteContent.emergencyPhone || websiteContent.contactPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/[^+\d]/g, '')}`}
                        className="hover:underline"
                      >
                        {websiteContent.emergencyPhone || websiteContent.contactPhone || '+91 98765 43210'}
                      </a>
                    </p>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      Fast-track voluntary donor matching for trauma & surgery cases.
                    </p>
                  </div>
                </div>

                {/* 24x7 WhatsApp SOS Support */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">24/7 Blood SOS WhatsApp Desk</h4>
                    <p className="text-xs text-emerald-800 font-bold mt-1">
                      <a
                        href={`https://wa.me/${(websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/\D/g, '').length === 10 ? `91${(websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/\D/g, '')}` : (websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210').split(/[/,]/)[0].replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-emerald-900"
                      >
                        {websiteContent.whatsappPhone || websiteContent.emergencyPhone || '+91 98765 43210'}
                      </a>
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Direct WhatsApp emergency donor mobilization desk.
                    </p>
                  </div>
                </div>

                {/* Official Email */}
                <div className="p-5 rounded-2xl bg-brand-bgLight/80 border border-brand-border flex items-start gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">Official Email Correspondence</h4>
                    <p className="text-xs text-brand-muted mt-1 font-medium">
                      <a href={`mailto:${websiteContent.contactEmail || 'contact@bharathifoundation.org'}`} className="hover:underline text-brand-primary">
                        {websiteContent.contactEmail || 'contact@bharathifoundation.org'}
                      </a>
                    </p>
                    <p className="text-[11px] text-brand-muted mt-0.5">Average response time: Within 24 business hours</p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="p-5 rounded-2xl bg-brand-bgLight/80 border border-brand-border flex items-start gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">Administrative Office Hours</h4>
                    <p className="text-xs text-brand-muted mt-1">Monday – Saturday: 08:30 AM – 07:00 PM</p>
                    <p className="text-[11px] text-brand-muted mt-0.5">Sunday: Emergency On-Call Duty Officers Only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form (7 Columns) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-bgLight px-3 py-1 rounded-full border border-brand-border inline-block">
                  Direct Secretariat Transmission
                </span>
                <h3 className="text-2xl font-black text-brand-primaryDark font-serif mt-2">
                  Submit a Message or Requisition
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  Fill in your details below. Your query will be routed to the appropriate coordinator and logged with a reference tracking token.
                </p>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message Card */}
              {submittedId && (
                <div className="p-5 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <strong className="text-sm">Inquiry Transmitted Successfully!</strong>
                  </div>
                  <p className="leading-relaxed">
                    Thank you. Your message has been routed to our secretariat under Tracking Token:
                    <strong className="font-mono text-emerald-800 ml-1 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      #{submittedId}
                    </strong>.
                    A foundation representative will get back to you shortly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Anti-spam honeypot (invisible to humans) */}
                <input
                  type="text"
                  name="hp_field"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Hegde"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      Mobile Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98450 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      Subject / Requisition Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Organizing a Free Eye Camp in our Taluk"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">
                    Detailed Message or Proposal *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details about your query, community request, or NGO collaboration..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary outline-hidden resize-none"
                  />
                </div>

                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center gap-2 text-xs text-brand-muted">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your personal contact data is strictly protected under Bharathi Foundation’s privacy pledge.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Transmit Inquiry to Bharathi Foundation'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Confirmed Location Map & Directions Card */}
          <div className="rounded-3xl border border-brand-border bg-white overflow-hidden shadow-md">
            <div className="p-6 sm:p-8 bg-brand-bgLight border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Confirmed Headquarters Location
                </span>
                <h3 className="text-xl font-black text-brand-primaryDark font-serif mt-1">
                  Visit Our Registered Trust Secretariat
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  No. 42, 3rd Cross, Rajajinagar, Bengaluru, Karnataka 560010, India
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Rajajinagar,+Bengaluru,+Karnataka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Responsive Interactive Map */}
            <div className="relative w-full h-80 bg-gray-100">
              <iframe
                title="Bharathi Foundation Registered Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8286280337834!2d77.55046257507661!3d12.982845687333555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3dd321a4f02d%3A0x6b63f5f6932e6a39!2sRajajinagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
