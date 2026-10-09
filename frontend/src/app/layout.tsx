import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GradeFlow — Student Management',
  description: 'Modern student management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={geist.className}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
