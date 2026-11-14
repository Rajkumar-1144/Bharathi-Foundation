# BHARATHI FOUNDATION – PRODUCTION DEPLOYMENT & AUDIT GUIDE

This repository has completed a comprehensive production audit across all 10 evaluation domains.

---

## 1. Quick Verification Commands

In your terminal (`powershell` or `cmd`), run:

```bash
# 1. Typecheck the entire application
npx tsc --noEmit

# 2. Start local development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 2. Production Build & Deployment to Vercel

```bash
# Build for production
npm run build

# Start production server locally
npm run start
```

### Vercel Deployment Steps
1. Push this project to GitHub.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and select this repository.
3. Configure Environment Variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`
   - `NEXT_PUBLIC_SUPABASE_URL` = (Optional Supabase project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Optional Supabase public anon key)
4. Click **Deploy**.

---

## 3. Real Data Integrity Guarantees

All hardcoded demonstration numbers have been purged:
- **Lives Directly Impacted**: Derived solely from verified completed camps, completed activities, and care home residents.
- **Active Ground Volunteers**: Strictly APPROVED and active volunteers.
- **Medical & Blood Camps Conducted**: Strictly COMPLETED and verified camps.
- **Direct Welfare Raised**: Calculated solely from VERIFIED donations.
- **Registered Community Members**: Deduplicated unique registered stakeholders.
- **People Connected**: Normalized unique individuals across Admin, NGO, Volunteer, and Donor accounts using shared email/phone identities to prevent duplicate counting.
