'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignPermissionAction, removePermissionAction } from '../actions';
import { Check } from 'lucide-react';
import type { RoleWithPermissions, Permission } from '../types';

interface PermissionsSectionProps {
  roles: RoleWithPermissions[];
  permissions: Permission[];
}

export function PermissionsSection({ roles, permissions }: PermissionsSectionProps) {
  const router = useRouter();
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? '');

  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const assignedIds = new Set(selectedRole?.rolePermissions.map((rp) => rp.permission.id) ?? []);

  const groupedPermissions = permissions.reduce(
    (acc, p) => {
      const mod = p.module ?? 'General';
      if (!acc[mod]) acc[mod] = [];
      acc[mod].push(p);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  async function handleToggle(permissionId: string, hasPermission: boolean) {
    if (hasPermission) {
      await removePermissionAction(selectedRoleId, permissionId);
    } else {
      await assignPermissionAction(selectedRoleId, permissionId);
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="role-select" className="text-sm font-medium text-gray-700">
          Rol:
        </label>
        <select
          id="role-select"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedPermissions).map(([module, perms]) => (
          <div key={module} className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {module}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {perms.map((p) => {
                const hasPermission = assignedIds.has(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(p.id, hasPermission)}
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200 ${
                        hasPermission
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                      role="checkbox"
                      aria-checked={hasPermission}
                    >
                      {hasPermission && <Check className="h-3 w-3" />}
                    </button>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                      {p.description && (
                        <span className="text-xs text-gray-500">{p.description}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs text-gray-400 font-mono">{p.code}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
