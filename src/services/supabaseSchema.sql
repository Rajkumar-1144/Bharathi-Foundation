-- ================================================================
-- BHARATHI FOUNDATION - SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Full Row Level Security (RLS), Realtime Publications & Audit Triggers
-- ================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Roles and Statuses
CREATE TYPE user_role AS ENUM ('ADMIN', 'NGO', 'VOLUNTEER', 'DONOR');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE donation_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE blood_priority AS ENUM ('NORMAL', 'URGENT', 'CRITICAL');
CREATE TYPE blood_request_status AS ENUM ('PENDING', 'VERIFIED', 'DONOR_IDENTIFIED', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED');

-- 3. Users Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'DONOR',
    phone TEXT,
    avatar TEXT,
    status verification_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Volunteers Table
CREATE TABLE IF NOT EXISTS public.volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    volunteer_id_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    dob DATE,
    gender TEXT,
    address TEXT,
    state TEXT,
    city TEXT NOT NULL,
    pincode TEXT,
    skills TEXT[] DEFAULT '{}',
    areas_of_interest TEXT[] DEFAULT '{}',
    profile_photo TEXT,
    availability TEXT DEFAULT 'Weekends',
    experience TEXT DEFAULT 'Fresher (No Experience)',
    hours_served INT DEFAULT 0,
    status verification_status NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    certificates_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NGOs Table
CREATE TABLE IF NOT EXISTS public.ngos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    darpan_id TEXT,
    reg_number TEXT NOT NULL,
    founded_year INT,
    contact_person TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    website TEXT,
    logo TEXT,
    org_type TEXT,
    tax_exempt_12a BOOLEAN DEFAULT FALSE,
    tax_exempt_80g BOOLEAN DEFAULT FALSE,
    authorized_person TEXT,
    status verification_status NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT NOT NULL,
    donor_pan TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    utr_reference TEXT UNIQUE NOT NULL,
    payment_method TEXT DEFAULT 'UPI',
    campaign_title TEXT NOT NULL,
    purpose TEXT DEFAULT 'Food Donation',
    other_purpose TEXT,
    admin_notes TEXT,
    status donation_status NOT NULL DEFAULT 'PENDING',
    screenshot_url TEXT,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ,
    receipt_number TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Camp Meetings Table
CREATE TABLE IF NOT EXISTS public.camp_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    camp_type TEXT NOT NULL,
    organizer_name TEXT NOT NULL,
    organizer_ngo_id UUID REFERENCES public.ngos(id),
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    target_beneficiaries INT DEFAULT 100,
    volunteers_needed INT DEFAULT 10,
    volunteers_registered INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'UPCOMING',
    description TEXT,
    registered_volunteer_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Emergency Blood Requests Table
CREATE TABLE IF NOT EXISTS public.emergency_blood_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    units_required INT NOT NULL DEFAULT 1,
    hospital_name TEXT NOT NULL,
    hospital_location TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    required_date DATE NOT NULL,
    priority blood_priority NOT NULL DEFAULT 'URGENT',
    contact_person TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    additional_info TEXT,
    status blood_request_status NOT NULL DEFAULT 'PENDING',
    matched_donor_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Expenditures & Transparency Table
CREATE TABLE IF NOT EXISTS public.expenditures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    receipt_url TEXT,
    date DATE NOT NULL,
    invoice_number TEXT,
    verified_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Care Homes Table
CREATE TABLE IF NOT EXISTS public.care_homes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    established_year TEXT,
    inmates_count INT DEFAULT 0,
    capacity INT DEFAULT 50,
    description TEXT,
    facilities TEXT[] DEFAULT '{}',
    medical_support TEXT,
    images TEXT[] DEFAULT '{}',
    featured_image TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED',
    care_activities TEXT[] DEFAULT '{}',
    urgent_needs TEXT[] DEFAULT '{}',
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. UPI QR Code & Gateway Settings Table
CREATE TABLE IF NOT EXISTS public.qr_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    qr_image_url TEXT,
    upi_id TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    payment_instructions TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id)
);

-- Storage bucket for persistent QR codes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- 12. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenditures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_settings ENABLE ROW LEVEL SECURITY;

-- QR Settings RLS Policies
CREATE POLICY "Allow public read published QR settings"
    ON public.qr_settings
    FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to QR settings"
    ON public.qr_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'ADMIN'
        )
    );

-- 13. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ngos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.camp_meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.care_homes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.qr_settings;
