// app/dashboard/layout.tsx
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext'; // Corrected path
import { NotificationProvider } from '@/components/NotificationSystem'; // Corrected path for consistency, assuming similar issue

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}
