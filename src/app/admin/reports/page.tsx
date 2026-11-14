'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { exportService } from '@/services/exportService';
import { FileText, Download, Users, Building2, Droplet, Tent, IndianRupee } from 'lucide-react';

export default function AdminReportsPage() {
  const { volunteers, ngos, camps, bloodDonors, donations } = useAppData();

  const reports = [
    {
      title: 'Financial Donations & Reconciliation Ledger',
      description: 'Complete chronological record of all UPI and online donations with UTR references, status, and receipts.',
      icon: IndianRupee,
      color: 'text-emerald-700 bg-emerald-100',
      totalCount: `${donations.length} Records`,
      onExportPDF: () => exportService.exportDonationsPDF(donations),
      onExportCSV: () => {
        const headers = ['Date', 'Donor Name', 'Email', 'Phone', 'PAN', 'Purpose', 'Other Purpose', 'Amount', 'UTR Reference', 'Status'];
        const rows = donations.map((d) => [
          d.createdAt,
          d.donorName,
          d.donorEmail,
          d.donorPhone,
          d.donorPan || '',
          d.purpose || 'General Foundation Support',
          d.otherPurpose || '',
          d.amount,
          d.utrReference,
          d.status,
        ]);
        exportService.exportToCSV('Bharathi_Donations_Report', headers, rows);
      },
    },
    {
      title: 'Purpose-Wise Financial Allocation & Impact Report',
      description: 'Audit breakdown of public contributions grouped by specific cause: Old Age Homes, Child Care, Food, Blood Camps, etc.',
      icon: IndianRupee,
      color: 'text-purple-700 bg-purple-100',
      totalCount: '9 Welfare Causes',
      onExportPDF: () => exportService.exportDonationsPDF(donations),
      onExportCSV: () => {
        const purposeStats: Record<string, { count: number; totalAmount: number }> = {};
        donations.forEach((d) => {
          const p = d.purpose || 'General Foundation Support';
          if (!purposeStats[p]) purposeStats[p] = { count: 0, totalAmount: 0 };
          purposeStats[p].count += 1;
          purposeStats[p].totalAmount += d.amount;
        });
        const headers = ['Donation Purpose', 'Total Donations Count', 'Total Raised (INR)'];
        const rows = Object.entries(purposeStats).map(([p, data]) => [p, data.count, data.totalAmount]);
        exportService.exportToCSV('Bharathi_Purpose_Wise_Financial_Report', headers, rows);
      },
    },
    {
      title: 'Volunteer Corps & Hours Served Audit',
      description: 'Directory of registered volunteers, blood groups, verified skills, and validated community service hours.',
      icon: Users,
      color: 'text-brand-primary bg-purple-100',
      totalCount: `${volunteers.length} Volunteers`,
      onExportPDF: () => exportService.exportVolunteersPDF(volunteers),
      onExportCSV: () => {
        const headers = ['Name', 'Email', 'Phone', 'Blood Group', 'City', 'Skills', 'Hours Served', 'Status'];
        const rows = volunteers.map((v) => [
          v.name,
          v.email,
          v.phone,
          v.bloodGroup,
          v.city,
          v.skills.join('; '),
          v.hoursServed,
          v.status,
        ]);
        exportService.exportToCSV('Bharathi_Volunteers_Report', headers, rows);
      },
    },
    {
      title: 'Camp Meetings & Field Outreach Report',
      description: 'Scheduled, ongoing, and completed diagnostic health camps, venues, beneficiary quotas, and attendance.',
      icon: Tent,
      color: 'text-amber-700 bg-amber-100',
      totalCount: `${camps.length} Camps`,
      onExportPDF: () => exportService.exportCampsPDF(camps),
      onExportCSV: () => {
        const headers = ['Title', 'Type', 'Organizer', 'Date', 'Time', 'Venue', 'City', 'Target Beneficiaries', 'Volunteers', 'Status'];
        const rows = camps.map((c) => [
          c.title,
          c.campType,
          c.organizerName,
          c.date,
          c.time,
          c.venue,
          c.city,
          c.targetBeneficiaries,
          `${c.volunteersRegistered}/${c.volunteersNeeded}`,
          c.status,
        ]);
        exportService.exportToCSV('Bharathi_Camps_Report', headers, rows);
      },
    },
    {
      title: 'Confidential Blood Donor Registry',
      description: 'Verified emergency blood donors categorized by ABO/Rh blood groups, contact numbers, and cities.',
      icon: Droplet,
      color: 'text-red-700 bg-red-100',
      totalCount: `${bloodDonors.length} Donors`,
      onExportPDF: () => exportService.exportBloodDonorsPDF(bloodDonors),
      onExportCSV: () => {
        const headers = ['Donor Name', 'Blood Group', 'Phone', 'Email', 'City', 'Location', 'Available'];
        const rows = bloodDonors.map((b) => [
          b.name,
          b.bloodGroup,
          b.phone,
          b.email,
          b.city,
          b.location,
          b.isAvailable ? 'YES' : 'NO',
        ]);
        exportService.exportToCSV('Bharathi_Blood_Donors_Report', headers, rows);
      },
    },
    {
      title: 'Partner NGOs Accreditation Register',
      description: 'Listing of affiliated non-profits, Darpan portal IDs, 12A/80G status, and legal contact persons.',
      icon: Building2,
      color: 'text-blue-700 bg-blue-100',
      totalCount: `${ngos.length} NGOs`,
      onExportPDF: () => {
        const headers = ['NGO Name', 'Darpan ID', 'Reg Number', 'City', 'Contact Person', 'Phone', 'Status'];
        const rows = ngos.map((n) => [n.name, n.darpanId, n.regNumber, n.city, n.contactPerson, n.phone, n.status]);
        exportService.exportToCSV('Bharathi_NGO_Partners_Report', headers, rows);
      },
      onExportCSV: () => {
        const headers = ['NGO Name', 'Darpan ID', 'Reg Number', 'City', 'Contact Person', 'Phone', 'Status'];
        const rows = ngos.map((n) => [n.name, n.darpanId, n.regNumber, n.city, n.contactPerson, n.phone, n.status]);
        exportService.exportToCSV('Bharathi_NGO_Partners_Report', headers, rows);
      },
    },
  ];

  return (
    <DashboardLayout
      allowedRole="ADMIN"
      title="Foundation Reports & Audit Exports"
      subtitle="Generate compliant PDF documentation and Microsoft Excel / CSV spreadsheets for auditing"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((rpt, idx) => {
            const Icon = rpt.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-brand-border shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${rpt.color} flex items-center justify-center font-bold`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-brand-muted bg-brand-bgLight px-3 py-1 rounded-full border border-brand-border">
                      {rpt.totalCount}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-brand-primaryDark">{rpt.title}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">{rpt.description}</p>
                </div>

                <div className="pt-6 border-t border-brand-border/60 mt-6 flex items-center gap-3">
                  <button
                    onClick={rpt.onExportPDF}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={rpt.onExportCSV}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-bgLight hover:bg-brand-secondary/20 text-brand-primary border border-brand-border py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Excel / CSV</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

