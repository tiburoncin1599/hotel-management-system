'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { createUserAction, deleteUserAction } from '../actions';
import { Plus, Search, Trash2, X, AlertTriangle, UserCheck, UserX } from 'lucide-react';
import type { UserWithRole, RoleWithPermissions } from '../types';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
    >
      {pending ? 'Guardando...' : label}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
    >
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}

interface UsersSectionProps {
  users: UserWithRole[];
  roles: RoleWithPermissions[];
}

export function UsersSection({ users, roles }: UsersSectionProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createMsg, setCreateMsg] = useState({ success: false, message: '' });
  const [deleteMsg, setDeleteMsg] = useState({ success: false, message: '' });

  async function handleCreate(formData: FormData) {
    const result = await createUserAction({ success: false, message: '' }, formData);
    setCreateMsg(result);
    if (result.success) {
      setShowCreate(false);
      router.refresh();
    }
  }

  async function handleDelete(formData: FormData) {
    const result = await deleteUserAction({ success: false, message: '' }, formData);
    setDeleteMsg(result);
    if (result.success) {
      setDeleteId(null);
      router.refresh();
    }
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuarios..."
            className="w-72 rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Último acceso
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-sm text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {u.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {u.role.name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <UserCheck className="h-3.5 w-3.5" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <UserX className="h-3.5 w-3.5" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Nunca'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <button
                      onClick={() => setDeleteId(u.id)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
                      aria-label="Eliminar usuario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Nuevo usuario</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-200"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={handleCreate} className="mt-5 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {createMsg.message && (
                <p className={`text-sm ${createMsg.success ? 'text-green-600' : 'text-red-600'}`}>
                  {createMsg.message}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <SubmitButton label="Crear usuario" />
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Eliminar usuario</h2>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              ¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.
            </p>

            {deleteMsg.message && (
              <p
                className={`mt-3 text-sm ${deleteMsg.success ? 'text-green-600' : 'text-red-600'}`}
              >
                {deleteMsg.message}
              </p>
            )}

            <form action={handleDelete} className="mt-6 flex justify-end gap-3">
              <input type="hidden" name="id" value={deleteId} />
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <DeleteButton />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
