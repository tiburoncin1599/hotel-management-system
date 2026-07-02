import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hotel-management-system-ten-flax.vercel.app'),
  title: {
    template: '%s | Grand Hotel - Sistema de Gestión Hotelera',
    default: 'Grand Hotel - Sistema de Gestión Hotelera',
  },
  description:
    'Sistema de gestión hotelera profesional con módulos de reservas, check-in/out, pagos, facturación, reportes y configuración. Desarrollado con Next.js, Prisma y PostgreSQL.',
  keywords: [
    'hotel',
    'gestión hotelera',
    'reservas',
    'check-in',
    'facturación',
    'Next.js',
    'Prisma',
    'PostgreSQL',
    'sistema hotelero',
  ],
  authors: [{ name: 'Hotel Management System' }],
  creator: 'Hotel Management System',
  publisher: 'Hotel Management System',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'Grand Hotel',
    title: 'Grand Hotel - Sistema de Gestión Hotelera',
    description: 'Sistema profesional de gestión hotelera con módulos completos de administración.',
    url: 'https://hotel-management-system-ten-flax.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grand Hotel - Sistema de Gestión Hotelera',
    description: 'Sistema profesional de gestión hotelera.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
