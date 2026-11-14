'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Layers, Heart, Droplet, Stethoscope, UtensilsCrossed } from 'lucide-react';

export default function DonorCampaignsPage() {
  const campaigns = [
    {
      title: 'Emergency Blood Drive & Mobile Refrigeration Unit',
      category: 'Blood Banking',
      icon: Droplet,
      color: 'text-red-600 bg-red-100',
      description: 'Funding medical blood bags, cold-chain transport boxes, and certified nurse stipends.',
      raised: '₹3,50,000',
      goal: '₹5,00,000',
      progress: 70,
    },
    {
      title: 'Rural Eye Checkup & Free Cataract Surgery Fund',
      category: 'Ophthalmology',
      icon: Stethoscope,
      color: 'text-brand-primary bg-purple-100',
      description: 'Covering intraocular lens surgeries and prescription spectacles for rural senior citizens.',
      raised: '₹2,80,000',
      goal: '₹4,00,000',
      progress: 70,
    },
    {
      title: 'Food Donation & Community Hunger Relief',
      category: 'Nutrition',
      icon: UtensilsCrossed,
      color: 'text-amber-600 bg-amber-100',
      description: 'Supporting underprivileged families and communities by providing nutritious food and essential food supplies to people in need.',
      raised: '₹4,20,000',
      goal: '₹6,00,000',
      progress: 70,
    },
  ];

  return (
    <DashboardLayout
      allowedRole="DONOR"
      title="Foundation Welfare Campaigns"
      subtitle="Select a humanitarian mission to support directly through UPI"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-brand-border shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-bgLight px-2.5 py-0.5 rounded-full">
                    {c.category}
                  </span>
                  <h3 className="font-bold text-base text-brand-text mt-2">{c.title}</h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{c.description}</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-brand-text">
                    <span>Raised: {c.raised}</span>
                    <span className="text-brand-muted">Target: {c.goal}</span>
                  </div>
                  <div className="w-full bg-brand-bgLight rounded-full h-2 overflow-hidden border border-brand-border">
                    <div className="bg-brand-primary h-full rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </div>

              <Link
                href="/donor/donate"
                className="mt-6 w-full text-center bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
              >
                Donate to this Initiative
              </Link>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

