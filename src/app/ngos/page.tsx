'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAppData } from '@/context/AppDataContext';
import { Building2, CheckCircle2, MapPin, Users, Globe, ExternalLink, ArrowRight } from 'lucide-react';

export default function NGOsPage() {
  const { ngos, ngoActivities } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');

  const approvedNGOs = ngos.filter((n) => n.status === 'APPROVED');
  const filteredNGOs = approvedNGOs.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-brand-text flex flex-col">
      <Navbar />

      <section className="bg-brand-bgLight py-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-brand-border">
            Collaborative Coalition
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-primaryDark">Partner NGOs & Activities</h1>
          <p className="text-base text-brand-muted max-w-2xl mx-auto">
            Discover verified charitable organizations working together under the Bharathi Foundation umbrella.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search NGO by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
              />
            </div>

            <Link
              href="/register"
              className="bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              + Partner as an NGO
            </Link>
          </div>

          {/* NGO Partner Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNGOs.map((ngo) => (
              <div
                key={ngo.id}
                className="p-6 rounded-2xl bg-white border border-brand-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Partner
                    </span>
                    <span className="text-xs text-brand-muted">Est. {ngo.foundedYear}</span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-primaryDark">{ngo.name}</h3>
                  <p className="text-xs text-brand-muted mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    <span>{ngo.city} • {ngo.address}</span>
                  </p>
                  <p className="text-xs text-brand-muted mt-3">
                    Darpan Portal ID: <strong className="font-mono text-brand-text">{ngo.darpanId}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border/60 mt-4 flex items-center justify-between text-xs">
                  <span className="text-brand-muted font-medium">Contact: {ngo.contactPerson}</span>
                  {ngo.website && (
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Active Collaborative Activities */}
          <div className="pt-10 border-t border-brand-border">
            <h2 className="text-2xl font-black text-brand-primaryDark mb-6">Current Joint Welfare Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ngoActivities.map((act) => (
                <div key={act.id} className="p-6 rounded-2xl bg-brand-bgLight border border-brand-border">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-brand-primary">{act.ngoName}</span>
                    <span className="bg-brand-secondary/20 text-brand-primaryDark font-bold px-2 py-0.5 rounded-md text-[10px]">
                      {act.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-brand-text">{act.title}</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{act.description}</p>
                  <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                    <span className="text-brand-muted">Beneficiaries: {act.targetBeneficiaries}</span>
                    <span className="font-bold text-brand-primary">{act.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

