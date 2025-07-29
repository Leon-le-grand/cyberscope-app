// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css'; // Keep your global CSS import

// CORRECTED IMPORT: Now importing NotificationProvider as it's named in your file
import { NotificationProvider } from '@/components/NotificationSystem';
import { AuthProvider } from '@/contexts/AuthContext'; // This path is correct as per your file

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CyberScope',
  description: 'Advanced Cybersecurity Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Using NotificationProvider as per your NotificationSystem.tsx */}
        <NotificationProvider>
          {/* AuthProvider must wrap components that use useAuth */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

