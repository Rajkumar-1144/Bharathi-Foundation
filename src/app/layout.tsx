import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppDataProvider } from '@/context/AppDataContext';
import { FloatingWhatsAppSOS } from '@/components/common/FloatingWhatsAppSOS';

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Bharathi Foundation',
    alternateName: 'Bharathi Public Charitable Trust',
    url: 'https://bharathifoundation.org',
    logo: 'https://bharathifoundation.org/bharathi_logo.png',
    description:
      'Fulfilling a mother’s cherished dream through selfless service: Old Age Havens, Child Care Sanctuary, Emergency Blood Donation Camps, Healthcare, and Satvik Food Relief.',
    slogan: 'WE LOVE TO SERVE',
    taxID: '80G & 12A Certified Public Charitable Trust',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No. 42, 3rd Cross, Rajajinagar',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560010',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-98765-43210',
        contactType: 'emergency',
        areaServed: 'IN',
        availableLanguage: ['English', 'Kannada', 'Telugu', 'Hindi'],
      },
      {
        '@type': 'ContactPoint',
        email: 'contact@bharathifoundation.org',
        contactType: 'customer support',
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-brand-secondary/30 selection:text-brand-primaryDark" suppressHydrationWarning>
        <AuthProvider>
          <AppDataProvider>
            {children}
            <FloatingWhatsAppSOS />
          </AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

