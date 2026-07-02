'use client';

import { useState } from 'react';
import { Server, Database, Clock, HardDrive, Activity, Download, Search } from 'lucide-react';
import type { SystemInfo } from '../types';

interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  timestamp: string;
  user: { email: string } | null;
}

interface SystemSectionProps {
  systemInfo: SystemInfo;
  auditLogs: AuditLogEntry[];
}

export function SystemSection({ systemInfo, auditLogs }: SystemSectionProps) {
  const [search, setSearch] = useState('');

  const infoCards = [
    {
      icon: Server,
      label: 'Versión',
      value: systemInfo.version,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Database,
      label: 'Base de datos',
      value: systemInfo.dbStatus === 'connected' ? 'Conectada' : 'Desconectada',
      color:
        systemInfo.dbStatus === 'connected'
          ? 'bg-green-100 text-green-600'
          : 'bg-red-100 text-red-600',
    },
    {
      icon: Activity,
      label: 'Usuarios',
      value: String(systemInfo.userCount),
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Activity,
      label: 'Roles',
      value: String(systemInfo.roleCount),
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: Clock,
      label: 'Tiempo activo',
      value: formatUptime(systemInfo.serverInfo.uptime),
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: HardDrive,
      label: 'Memoria',
      value: systemInfo.serverInfo.memoryUsage,
      color: 'bg-cyan-100 text-cyan-600',
    },
  ];

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Información del sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-4"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-sm font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Copia de seguridad</h3>
            <p className="text-sm text-gray-500">Respalda la base de datos del sistema</p>
          </div>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
            title="Próximamente"
          >
            <Download className="h-4 w-4" />
            Realizar backup
          </button>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          La funcionalidad de backup estará disponible próximamente. Se recomienda configurar
          respaldos automáticos a nivel de base de datos.
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Registro de auditoría</h3>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en auditoría..."
            className="w-full max-w-md rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acción
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Entidad
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center text-sm text-gray-500">
                    No se encontraron registros de auditoría
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLogEntry) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {log.user?.email ?? 'Sistema'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {log.entity}
                      {log.entityId && (
                        <span className="ml-1 text-xs text-gray-400">
                          ({log.entityId.slice(0, 8)}...)
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatUptime(uptime: number): string {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}
