import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppDataProvider } from '@/context/AppDataContext';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bharathifoundation.org'),
  title: {
    default: 'Bharathi Foundation – WE LOVE TO SERVE',
    template: '%s | Bharathi Foundation',
  },
  description:
    'Fulfilling a mother’s cherished dream through selfless service: Old Age Havens, Child Care Sanctuary, Emergency Blood Donation Camps, Healthcare, and Satvik Food Relief.',
  keywords: [
    'Bharathi Foundation',
    'WE LOVE TO SERVE',
    'Old Age Home Bangalore',
    'Child Care Home Bangalore',
    'Blood Donation Camps India',
    '80G Tax Exemption Donation',
    'Charitable Trust Karnataka',
    'Free Medical Camps',
    'NGO Collaboration',
  ],
  authors: [{ name: 'Bharathi Foundation Trust' }],
  creator: 'Bharathi Foundation',
  publisher: 'Bharathi Foundation Public Charitable Trust',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://bharathifoundation.org',
    siteName: 'Bharathi Foundation',
    title: 'Bharathi Foundation – WE LOVE TO SERVE',
    description:
      'Fulfilling a mother’s cherished dream through selfless service: Old Age Havens, Child Care Sanctuary, Emergency Blood Donation Camps, Healthcare, and Food Relief.',
    images: [
      {
        url: '/bharathi_logo.png',
        width: 800,
        height: 600,
        alt: 'Bharathi Foundation Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bharathi Foundation – WE LOVE TO SERVE',
    description:
      'Fulfilling a mother’s cherished dream through selfless service: Old Age Havens, Child Care Sanctuary, Emergency Blood Donation Camps, Healthcare, and Food Relief.',
    images: ['/bharathi_logo.png'],
  },
  icons: {
    icon: '/bharathi_logo.png',
    shortcut: '/bharathi_logo.png',
    apple: '/bharathi_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-brand-secondary/30 selection:text-brand-primaryDark" suppressHydrationWarning>
        <AuthProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

