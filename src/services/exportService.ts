import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DonationRecord, Volunteer, NGO, CampMeeting, BloodDonor } from '@/types';

export const exportService = {
  /**
   * Generates and downloads an official 80G Tax-Deductible Donation Receipt PDF
   */
  generateDonationReceipt(donation: DonationRecord): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor: [number, number, number] = [81, 36, 122]; // Deep Purple #51247A
    const secondaryColor: [number, number, number] = [167, 139, 250]; // Lavender #A78BFA
    const darkGray: [number, number, number] = [37, 32, 51]; // #252033

    // Outer Decorative Border
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);

    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.3);
    doc.rect(12, 12, 186, 273);

    // Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(13, 13, 184, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('BHARATHI FOUNDATION', 105, 24, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('WE LOVE TO SERVE  |  PUBLIC CHARITABLE TRUST', 105, 32, { align: 'center' });
    doc.text('Reg No: TRUST-BLR-8921/2018 | 80G Approval: CIT(E)/BLR/80G/2019-20', 105, 37, { align: 'center' });

    // Receipt Title Badge
    doc.setFillColor(248, 245, 252);
    doc.rect(14, 46, 182, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('OFFICIAL DONATION RECEIPT (UNDER SECTION 80G OF INCOME TAX ACT)', 105, 54, { align: 'center' });

    // Receipt Metadata Table
    const receiptNo = donation.receiptNumber || `BF/2026-27/${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = new Date(donation.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const donationPurposeStr = donation.purpose
      ? donation.otherPurpose
        ? `${donation.purpose} (${donation.otherPurpose})`
        : donation.purpose
      : 'General Foundation Support';

    autoTable(doc, {
      startY: 63,
      theme: 'grid',
      headStyles: {
        fillColor: [81, 36, 122] as [number, number, number],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: darkGray,
      },
      body: [
        ['Receipt Number', receiptNo, 'Date of Issuance', formattedDate],
        ['Donor Name', donation.donorName, 'Contact Phone', donation.donorPhone],
        ['Donor Email', donation.donorEmail, 'Donor PAN', donation.donorPan || 'NOT PROVIDED / INDIVIDUAL'],
        ['Payment Method', donation.paymentMethod, 'Bank UTR / Ref No', donation.utrReference],
        ['Donation Purpose', donationPurposeStr, 'Target Campaign', donation.campaignTitle],
      ],
    });

    // Financial Amount Callout Box
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFillColor(248, 245, 252);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(15, finalY, 180, 24, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`TOTAL AMOUNT RECEIVED: INR ${donation.amount.toLocaleString('en-IN')}/-`, 105, finalY + 11, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(`(Rupees ${numberToWordsIndian(donation.amount)} Only)`, 105, finalY + 18, { align: 'center' });

    // Legal Declarations
    const legalY = finalY + 32;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Tax Exemption Certificate Terms & Conditions:', 15, legalY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const terms = [
      '1. All donations to Bharathi Foundation are eligible for 50% tax deduction under Section 80G of the Income Tax Act, 1961.',
      '2. This receipt has been electronically compiled and digitally verified against banking transaction records.',
      '3. Funds contributed are strictly utilized for charitable public health, blood donation drives, and community welfare programs.',
      '4. Please retain this receipt for filing your Annual Income Tax Returns (ITR).',
    ];
    let ty = legalY + 6;
    terms.forEach((line) => {
      doc.text(line, 15, ty);
      ty += 5;
    });

    // Signatures and Seal
    const sigY = ty + 15;
    doc.setDrawColor(180, 180, 180);
    doc.line(25, sigY + 20, 75, sigY + 20);
    doc.line(135, sigY + 20, 185, sigY + 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('DONOR SIGNATURE', 50, sigY + 25, { align: 'center' });
    doc.text('FOR BHARATHI FOUNDATION', 160, sigY + 25, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Managing Trustee / Authorised Signatory', 160, sigY + 29, { align: 'center' });

    // Footer contact
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'Bharathi Foundation Trust Bhavan, #108 Seva Marg, Bengaluru 560011 | contact@bharathifoundation.org',
      105,
      270,
      { align: 'center' }
    );

    // Save/Download PDF
    doc.save(`Bharathi_Foundation_80G_Receipt_${donation.utrReference}.pdf`);
  },

  /**
   * Export Volunteers Directory to PDF Report
   */
  exportVolunteersPDF(volunteers: Volunteer[]): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(81, 36, 122);
    doc.text('Bharathi Foundation - Volunteer Cadre Report', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} | Motto: WE LOVE TO SERVE`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [['Name', 'Phone', 'Blood Group', 'City', 'Skills', 'Hours', 'Status']],
      body: volunteers.map((v) => [
        v.name,
        v.phone,
        v.bloodGroup,
        v.city,
        v.skills.slice(0, 2).join(', '),
        `${v.hoursServed} hrs`,
        v.status,
      ]),
      headStyles: { fillColor: [81, 36, 122] as [number, number, number] },
    });

    doc.save('Bharathi_Foundation_Volunteers_Report.pdf');
  },

  /**
   * Export Donations Ledger to PDF Report
   */
  exportDonationsPDF(donations: DonationRecord[]): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(81, 36, 122);
    doc.text('Bharathi Foundation - Financial Donations Audit Report', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [['Date', 'Donor Name', 'Amount (INR)', 'Purpose', 'UTR / Ref No', 'Method', 'Status']],
      body: donations.map((d) => [
        new Date(d.createdAt).toLocaleDateString('en-IN'),
        d.donorName,
        `Rs. ${d.amount.toLocaleString('en-IN')}`,
        d.purpose ? (d.otherPurpose ? `${d.purpose} (${d.otherPurpose})` : d.purpose) : 'General Support',
        d.utrReference,
        d.paymentMethod,
        d.status,
      ]),
      headStyles: { fillColor: [81, 36, 122] as [number, number, number] },
    });

    doc.save('Bharathi_Foundation_Donations_Report.pdf');
  },

  /**
   * Export Camps & Blood Drives to PDF Report
   */
  exportCampsPDF(camps: CampMeeting[]): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(81, 36, 122);
    doc.text('Bharathi Foundation - Camp Meetings & Blood Drives Report', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [['Camp Title', 'Type', 'City', 'Date', 'Target Beneficiaries', 'Volunteers', 'Status']],
      body: camps.map((c) => [
        c.title,
        c.campType,
        c.city,
        c.date,
        c.targetBeneficiaries.toString(),
        `${c.volunteersRegistered}/${c.volunteersNeeded}`,
        c.status,
      ]),
      headStyles: { fillColor: [81, 36, 122] as [number, number, number] },
    });

    doc.save('Bharathi_Foundation_Camps_Report.pdf');
  },

  /**
   * Export Blood Donors Directory to PDF Report
   */
  exportBloodDonorsPDF(bloodDonors: BloodDonor[]): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(81, 36, 122);
    doc.text('Bharathi Foundation - Registered Blood Donors Registry', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Confidential Medical Contact Registry | Generated on ${new Date().toLocaleDateString('en-IN')}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [['Donor Name', 'Blood Group', 'Phone', 'City', 'Location', 'Last Donated', 'Available']],
      body: bloodDonors.map((b) => [
        b.name,
        b.bloodGroup,
        b.phone,
        b.city,
        b.location,
        b.lastDonationDate || 'First Time',
        b.isAvailable ? 'YES' : 'NO',
      ]),
      headStyles: { fillColor: [81, 36, 122] as [number, number, number] },
    });

    doc.save('Bharathi_Foundation_Blood_Donors_Report.pdf');
  },

  /**
   * Generic CSV / Excel Download utility
   */
  exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel compatibility
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\r\n'
      );

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

// Helper: Convert number to Indian currency words
function numberToWordsIndian(num: number): string {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function convertTwoDigits(n: number): string {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
  }

  function convertThreeDigits(n: number): string {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
    }
    if (n % 100 > 0) {
      str += convertTwoDigits(n % 100);
    }
    return str.trim();
  }

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  if (crore > 0) result += convertTwoDigits(crore) + ' Crore ';
  if (lakh > 0) result += convertTwoDigits(lakh) + ' Lakh ';
  if (thousand > 0) result += convertTwoDigits(thousand) + ' Thousand ';
  if (remainder > 0) result += convertThreeDigits(remainder);

  return result.trim();
}
