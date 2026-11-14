'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { exportService } from '@/services/exportService';
import { FileText, Download, Building2, CheckCircle2 } from 'lucide-react';

export default function NGOReportsPage() {
  const { currentUser } = useAuth();
  const { ngos, ngoActivities, camps } = useAppData();
  const currentNGO = ngos.find((n) => n.userId === currentUser?.id) || ngos[0];

  const myActivities = ngoActivities.filter(
    (a) => a.ngoName === currentNGO?.name || a.ngoId === currentNGO?.id
  );
  const myCamps = camps.filter(
    (c) => c.organizerNgoId === currentNGO?.id || c.organizerName.includes(currentNGO?.name || '')
  );

  const handleExportActivities = () => {
    const headers = ['Activity Title', 'Category', 'Target Beneficiaries', 'Volunteers', 'Location', 'Status'];
    const rows = myActivities.map((a) => [
      a.title,
      a.category,
      a.targetBeneficiaries,
      a.volunteersRequired,
      a.location,
      a.status,
    ]);
    exportService.exportToCSV(`${currentNGO?.name || 'NGO'}_Activities_Report`, headers, rows);
  };

  const handleExportCamps = () => {
    exportService.exportCampsPDF(myCamps);
  };

  return (
    <DashboardLayout
      allowedRole="NGO"
      title="Impact Reports & Documentation"
      subtitle="Export official activity summaries and beneficiary attendance reports for grants and compliance"
    >
      <div className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-brand-primaryDark">Joint Welfare Activities Report</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Summary of all initiated welfare programs, targeted beneficiary counts, and volunteer allocations.
              </p>
            </div>

            <button
              onClick={handleExportActivities}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV / Excel</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-secondaryDark flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-brand-primaryDark">Field Camps Summary PDF</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Printable PDF dossier detailing scheduled and completed medical checkup drives and blood campaigns.
              </p>
            </div>

            <button
              onClick={handleExportCamps}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

