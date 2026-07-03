import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ScrollDetector from '@/components/ScrollDetector';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JobSeeker - Cari Kerja Mudah',
  description: 'Platform pencarian kerja terbaik di Indonesia',
};

const themeScript = `
  (function() {
    try {
      var raw = window.localStorage.getItem('jobseeker-theme');
      if (raw) {
        var theme = raw;
        try { theme = JSON.parse(raw); } catch(e) {}
        document.documentElement.setAttribute('data-theme', theme);
        if (['dark', 'darkblue', 'charcoal', 'teal', 'emerald', 'burgundy'].indexOf(theme) !== -1) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="white" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${jakartaSans.className} tracking-[0.3px]`}>
        <ScrollDetector />
        <Navbar />
        {children}
        <AuthModal />
        <Footer />
      </body>
    </html>
  );
}