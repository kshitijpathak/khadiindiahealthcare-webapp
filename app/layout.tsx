import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Khadi India Healthcare — Certified Refurbished Medical Equipment',
  description: 'New Delhi-based trusted dealer of diagnostic imaging equipment across India. CT, MRI, Cath Lab, X-Ray and Ultrasound systems. AERB compliant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
