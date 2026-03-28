import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowledgeForge | Enterprise AI Copilot',
  description: 'Enterprise-grade knowledge management and AI-powered collaboration.',
};

import { AuthProvider } from '@/lib/authContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} bg-[#0A0B10] text-[#E2E8F0] antialiased`}>
        <AuthProvider>
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: '#1A1B23',
              color: '#E2E8F0',
              border: '1px solid #2D2E3A',
            },
          }} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
