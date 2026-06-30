'use client';

import { useSidebar } from './sidebar-context';
import { Menu, LogOut, User } from 'lucide-react';
import { logout } from '@/lib/actions/auth';

interface NavbarProps {
  user: {
    email: string;
    role: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
      <button
        onClick={toggle}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-gray-500">Panel de administración</p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
            <p className="text-xs capitalize text-gray-500">
              <span className="inline-block rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                {user.role}
              </span>
            </p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </form>
      </div>
    </header>
  );
}
