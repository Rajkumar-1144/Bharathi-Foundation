'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import { jsPDF } from 'jspdf';
import {
  Award,
  Clock,
  Download,
  CheckCircle2,
  QrCode,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function VolunteerServicesPage() {
  const { currentUser } = useAuth();
  const { volunteers, camps, attendance, markAttendance } = useAppData();

  const currentVol =
    volunteers.find(
      (v) =>
        v.userId === currentUser?.id ||
        (currentUser?.email && v.email.toLowerCase() === currentUser.email.toLowerCase())
    ) || volunteers[0];

  const [selectedCampId, setSelectedCampId] = useState(camps[0]?.id || '');
  const [qrInput, setQrInput] = useState('');
  const [attendanceSuccess, setAttendanceSuccess] = useState('');
  const [attendanceError, setAttendanceError] = useState('');

  // Filter attendance records for current volunteer
  const myAttendance = attendance.filter(
    (a) => a.volunteerId === currentVol?.id || a.volunteerId === currentVol?.userId
  );

  const handleScanAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    setAttendanceSuccess('');
    setAttendanceError('');

    if (!currentVol) {
      setAttendanceError('Volunteer profile not found.');
      return;
    }

    const camp = camps.find((c) => c.id === selectedCampId);
    if (!camp) {
      setAttendanceError('Please select a valid camp meeting.');
      return;
    }

    const success = markAttendance({
      campId: camp.id,
      volunteerId: currentVol.id,
      volunteerName: currentVol.name,
      status: 'PRESENT',
      notes: qrInput ? `Scanned token: ${qrInput}` : 'On-site check-in verified',
    });

    if (success) {
      setAttendanceSuccess(
        `✓ Attendance confirmed for "${camp.title}"! 6 service hours have been credited to your profile.`
      );
      setQrInput('');
    } else {
      setAttendanceError('Attendance has already been logged for this camp.');
    }
  };

  const handleDownloadCertificate = (campTitle?: string) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Decorative Borders
    doc.setDrawColor(81, 36, 122); // Deep Purple
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(167, 139, 250); // Lavender
    doc.setLineWidth(1);
    doc.rect(13, 13, 271, 184);

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(81, 36, 122);
    doc.text('BHARATHI FOUNDATION', 148, 38, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('PUBLIC CHARITABLE TRUST  |  WE LOVE TO SERVE', 148, 46, { align: 'center' });

    // Certificate Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(37, 32, 51);
    doc.text('CERTIFICATE OF APPRECIATION', 148, 70, { align: 'center' });

    // Presentation text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('THIS IS PROUDLY PRESENTED TO', 148, 84, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(81, 36, 122);
    doc.text(currentVol?.name || 'Devoted Volunteer', 148, 98, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(37, 32, 51);
    const eventMention = campTitle ? `for meritorious service in the "${campTitle}" camp` : 'for distinguished humanitarian volunteerism';
    const bodyText = `In grateful recognition of outstanding selfless dedication, humanitarian service, and active participation ${eventMention} with Bharathi Foundation. Total Service Hours Logged: ${currentVol?.hoursServed || 48} Hours. ID: ${currentVol?.volunteerIdNumber || 'BF-VOL-2026-0128'}.`;
    doc.text(bodyText, 148, 114, { align: 'center', maxWidth: 200 });

    // Date and Signatures
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    doc.setFontSize(10);
    doc.text(`Issued on: ${today} | Bengaluru, India`, 148, 142, { align: 'center' });

    doc.setDrawColor(120, 120, 120);
    doc.line(40, 170, 95, 170);
    doc.line(200, 170, 255, 170);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(81, 36, 122);
    doc.text('DR. SRINIVAS RAO', 67, 176, { align: 'center' });
    doc.text('FOUNDATION TRUSTEE', 227, 176, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Director of Field Operations', 67, 181, { align: 'center' });
    doc.text('Authorised Signatory', 227, 181, { align: 'center' });

    doc.save(`Bharathi_Foundation_Certificate_${currentVol?.name || 'Volunteer'}.pdf`);
  };

  return (
    <DashboardLayout
      allowedRole="VOLUNTEER"
      title="Service History & QR Event Attendance"
      subtitle="Track your logged community hours, check in to camps, and download accredited certificates"
    >
      <div className="space-y-8 max-w-5xl">
        {/* Certificate Callout Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-text">Accredited Volunteer Certificate</h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Eligible upon reaching milestone hours or completing certified medical & blood drives.
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs font-bold text-brand-primary">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentVol?.hoursServed || 0} Hours Completed</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentVol?.certificatesCount || 0} Camp Certificates</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownloadCertificate()}
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Master Certificate</span>
          </button>
        </div>

        {/* QR-BASED EVENT ATTENDANCE CHECK-IN */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-primary flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-primaryDark">
                QR Event Attendance & 6-Hour Auto Credit
              </h3>
              <p className="text-xs text-brand-muted">
                Scan on-site camp QR code or select registered camp to mark your presence
              </p>
            </div>
          </div>

          {attendanceSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{attendanceSuccess}</span>
            </div>
          )}

          {attendanceError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{attendanceError}</span>
            </div>
          )}

          <form onSubmit={handleScanAttendance} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  Select Camp / Drive to Check In *
                </label>
                <select
                  value={selectedCampId}
                  onChange={(e) => setSelectedCampId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                >
                  {camps.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.city} - {c.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  Event QR Token / Security Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BF-CAMP-2026-QR91"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-brand-muted">
                ℹ Marking attendance automatically registers <strong>+6 Service Hours</strong> to your official volunteer record.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Check-in & Credit 6 Hours</span>
              </button>
            </div>
          </form>
        </div>

        {/* ATTENDANCE HISTORY TABLE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-text">Verified Attendance Records</h3>
              <p className="text-xs text-brand-muted">Field drives where your presence was recorded</p>
            </div>
            <span className="text-xs font-bold text-brand-primary bg-brand-bgLight px-3 py-1 rounded-full">
              {myAttendance.length} Records Logged
            </span>
          </div>

          {myAttendance.length === 0 ? (
            <p className="text-xs text-brand-muted italic py-6 text-center">
              No attendance records logged yet. Check in to your first camp drive above!
            </p>
          ) : (
            <div className="divide-y divide-brand-border/60">
              {myAttendance.map((rec) => {
                const camp = camps.find((c) => c.id === rec.campId);
                return (
                  <div key={rec.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-brand-text">
                        {camp?.title || 'Bharathi Foundation Camp Meeting'}
                      </h4>
                      <p className="text-xs text-brand-muted flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-muted" />
                          {new Date(rec.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          +6 Hours Credited
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownloadCertificate(camp?.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline cursor-pointer self-start sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Event Certificate</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
