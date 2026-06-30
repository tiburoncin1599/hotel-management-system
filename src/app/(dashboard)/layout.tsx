import { SidebarProvider } from '@/components/layout/sidebar-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { requireAuth } from '@/lib/auth/helpers';
import type { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:ml-0">
          <Navbar user={{ email: user.email, role: user.role ?? 'user' }} />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
