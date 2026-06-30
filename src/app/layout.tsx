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
  title: {
    template: '%s | Hotel Management System',
    default: 'Hotel Management System',
  },
  description:
    'Sistema de gestión hotelera completo con módulos de reservas, check-in/out, pagos y facturación. Desarrollado con Next.js, Prisma y PostgreSQL.',
  keywords: [
    'hotel',
    'gestión hotelera',
    'reservas',
    'check-in',
    'facturación',
    'Next.js',
    'Prisma',
  ],
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
