'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './sidebar-context';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  LogIn,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Hotel,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Habitaciones', href: '/dashboard/habitaciones', icon: BedDouble },
  { label: 'Clientes', href: '/dashboard/clientes', icon: Users },
  { label: 'Reservas', href: '/dashboard/reservas', icon: CalendarCheck },
  { label: 'Check-in / Check-out', href: '/dashboard/check', icon: LogIn },
  { label: 'Pagos', href: '/dashboard/pagos', icon: CreditCard },
  { label: 'Facturas', href: '/dashboard/facturas', icon: FileText },
  { label: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'w-64' : 'w-64'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={close}>
            <Hotel className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">Hotel MS</span>
          </Link>
          <button
            onClick={close}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Navegación principal">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-400">Hotel Management System</p>
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
