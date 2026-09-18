import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sacrament Meeting Planner',
  description: 'Plan and review sacrament meeting agendas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} min-h-screen`}>
        <Header />

        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}