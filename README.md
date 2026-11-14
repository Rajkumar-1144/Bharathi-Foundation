# BHARATHI FOUNDATION – WE LOVE TO SERVE
### Responsive Non-Profit & Multi-Role Foundation Management Web Application

![Bharathi Foundation Logo](./bharathi_logo.png)

A modern, responsive, and fully functional web application built with **Next.js (App Router)**, **React.js**, **TypeScript**, and **Tailwind CSS**. 

**Architectural Feature**: Built entirely without any external databases (No PostgreSQL, MySQL, MongoDB, or Firebase). Employs **LocalStorage**, **SessionStorage**, **React State/Context**, and **Browser File API** with full client-side reactivity and persistence.

---

## 1. Quick Start & Execution

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Pre-Seeded Demonstration Accounts

The platform includes 4 dedicated, role-segregated demo accounts that are pre-configured:

| User Role | Registered Email | Password | Assigned Dashboard |
| :--- | :--- | :--- | :--- |
| **Foundation Admin** | `admin@bharathifoundation.org` | `Admin@123` | `/admin` |
| **NGO Partner** | `ngo@bharathifoundation.org` | `Ngo@123` | `/ngo` |
| **Volunteer** | `volunteer@bharathifoundation.org` | `Volunteer@123` | `/volunteer` |
| **Donor** | `donor@bharathifoundation.org` | `Donor@123` | `/donor` |

*Note: You can also register custom accounts under any role using the `/register` portal.*

---

## 3. Brand Identity & Design System

- **Foundation Name**: Bharathi Foundation
- **Motto / Tagline**: *WE LOVE TO SERVE*
- **Primary Color**: Deep Purple (`#51247A`)
- **Secondary Color**: Lavender (`#A78BFA`)
- **Background**: White (`#FFFFFF`) & Light Lavender Tint (`#F8F5FC`)
- **Text Color**: Dark Slate (`#252033`)
- **Logo**: Official Bharathi Foundation Logo embedded across Navbar, Footer, Login Views, and all 4 Dashboards.

---

## 4. Application Architecture & Entry Flow

```
PUBLIC HOMEPAGE (User View - "/")
        │
        ├── Explore Programs, Blood Camps, Health Outreach, Gallery
        ├── Public UPI QR Code & Direct UTR Contribution Submission
        │
        ▼
ROLE SELECTION & LOGIN ("/login" / "/register")
        │
        ├── Admin Credentials ──────► Admin Dashboard ("/admin")
        ├── NGO Credentials   ──────► NGO Dashboard ("/ngo")
        ├── Volunteer Creds   ──────► Volunteer Dashboard ("/volunteer")
        └── Donor Credentials ──────► Donor Dashboard ("/donor")
```

---

## 5. Core Feature Matrix

### A. Public Website
- **Hero & Live Counters**: Real-time stats dynamically computed from LocalStorage (Lives Impacted, Volunteers, Camps, Donations).
- **Our Services**: Blood camps, rural medical checkups, child nutrition, elder care, and digital literacy.
- **NGO Collaborative Activities**: Dynamic directory of welfare initiatives.
- **Blood Donation Portal**: Live urgent requirement ticker + ABO/Rh group search + instant donor sign-up.
- **Camp Meetings**: Calendar with date, time, venue, and 1-click volunteer RSVP.
- **Photo Gallery**: Masonry grid with category filtering and interactive lightbox modal.
- **Direct UPI Giving**: High-resolution UPI QR code, official UPI ID copy button, suggested amounts, and UTR claim submission.

### B. Admin Dashboard (`/admin`)
- **Master Analytics**: Recharts BarChart & PieChart for fund utilization and volunteer growth.
- **Immediate Action Queues**: 1-click approval or rejection for pending NGOs, donation UTRs, and volunteer photos.
- **NGO Governance**: Inspect Darpan IDs, 12A/80G documents, approve/reject with mandatory reason dialog.
- **Volunteer Management**: Search, filter, approve, and export directory to PDF.
- **Blood Donation Registry**: Filter donors by blood group, toggle on-call availability, export registry to PDF.
- **Camp Management**: Full CRUD planner for medical checkups and blood drives.
- **Donation Reconciliation**: Cross-check UTR numbers, verify donations, and generate automated Section 80G tax receipts.
- **Gallery CMS**: Upload high-res photos via File API, assign categories, and publish to website.
- **Website CMS**: Real-time text editor for homepage hero headlines, mission, vision, and contact details.
- **Reports & Audits**: 1-click export of PDF dossiers and CSV/Excel spreadsheets.

### C. NGO Dashboard (`/ngo`)
- **Compliance & Profile**: Darpan ID, Trust Registration, and verification document inspection.
- **Initiatives Manager**: Propose and track community welfare programs.
- **Camp Planner**: Schedule diagnostic camps, set beneficiary targets, and venues.
- **Volunteer Requisitions**: Post manpower requests with required skills and dates.
- **Media Upload**: Submit event photos to the admin queue.
- **Reports**: Export activity summaries.

### D. Volunteer Dashboard (`/volunteer`)
- **Profile & Skills Matrix**: Emergency blood group, availability schedule, and key skills.
- **Opportunity Discovery**: Browse NGO activities and 1-click RSVP for field camps.
- **My Registrations**: Digital event QR check-in pass for supervisor validation.
- **Service History**: Logged hours ledger + download official Certificate of Appreciation PDF.
- **Photo Submissions**: Upload field photography for admin approval.

### E. Donor Dashboard (`/donor`)
- **Direct UPI Donate**: Dynamic QR code, pre-filled amounts, and instant UTR claim submission.
- **Donation Ledger**: Real-time status tracker (Pending vs. Verified).
- **Official 80G Tax Receipts**: Download digitally verified PDF receipts generated via `jsPDF`.
- **Campaign Portfolio**: Visual progress of funded healthcare and nutrition drives.
- **Tax Profile**: PAN number management and public anonymity toggle.

---

## 6. Technology Specifications

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18 + Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF & jsPDF-AutoTable
- **Spreadsheets**: UTF-8 BOM CSV / Excel Export Utility
- **State & Storage**: React Context + LocalStorage Event Pipeline (Zero External Databases)

---

## 7. License & Rights

© 2026 Bharathi Foundation. All Rights Reserved.  
*Tagline: WE LOVE TO SERVE*

