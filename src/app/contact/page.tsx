'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { websiteContent } = useAppData();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      <section className="bg-brand-bgLight py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border">
            24/7 Citizen Helpdesk
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">Contact Bharathi Foundation</h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            Connect with our core team for emergency blood donor matching, health camp requisitions, or trust inquiries.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-2xl font-black text-brand-primaryDark">Headquarters & Helplines</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                We are open 7 days a week for emergency medical and blood donor coordination.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-2xl bg-brand-bgLight border border-brand-border flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">Registered Office Address</h4>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">{websiteContent.contactAddress}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-bgLight border border-brand-border flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">Helpline & Blood Coordination</h4>
                    <p className="text-xs text-brand-muted mt-1">{websiteContent.contactPhone}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-bgLight border border-brand-border flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">Email Inquiries</h4>
                    <p className="text-xs text-brand-muted mt-1">{websiteContent.contactEmail}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-bgLight border border-brand-border flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-text">Operating Hours</h4>
                    <p className="text-xs text-brand-muted mt-1">Monday – Saturday: 08:30 AM – 07:00 PM</p>
                    <p className="text-[11px] text-red-600 font-bold mt-0.5">Emergency Blood Line: 24/7 Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xl">
              <h3 className="text-2xl font-bold text-brand-primaryDark mb-2">Send an Inquiry</h3>
              <p className="text-xs text-brand-muted mb-6">Our volunteer coordinators will review your message promptly.</p>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your message has been routed to the appropriate foundation coordinator.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. anand@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Inquiry Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Organising a Free Eye Checkup Camp in our Taluk"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Detailed Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details about your query or proposal..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry to Bharathi Foundation</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

