import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JobSeeker - Cari Kerja Mudah',
  description: 'Platform pencarian kerja terbaik di Indonesia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="white">
      <body className={`${jakartaSans.className} tracking-[0.3px]`}>
        <Navbar />
        {children}
        <AuthModal />
        <Footer />
      </body>
    </html>
  );
}