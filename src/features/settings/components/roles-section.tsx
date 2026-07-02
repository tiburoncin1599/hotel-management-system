'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { createRoleAction, updateRoleAction, deleteRoleAction } from '../actions';
import { Plus, Pencil, Trash2, X, AlertTriangle } from 'lucide-react';
import type { RoleWithPermissions } from '../types';

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

interface RolesSectionProps {
  roles: RoleWithPermissions[];
}

export function RolesSection({ roles }: RolesSectionProps) {
  const router = useRouter();
  const [editingRole, setEditingRole] = useState<RoleWithPermissions | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createMsg, setCreateMsg] = useState({ success: false, message: '' });
  const [updateMsg, setUpdateMsg] = useState({ success: false, message: '' });
  const [deleteMsg, setDeleteMsg] = useState({ success: false, message: '' });

  async function handleCreate(formData: FormData) {
    const result = await createRoleAction({ success: false, message: '' }, formData);
    setCreateMsg(result);
    if (result.success) {
      setShowCreate(false);
      router.refresh();
    }
  }

  async function handleUpdate(formData: FormData) {
    const result = await updateRoleAction({ success: false, message: '' }, formData);
    setUpdateMsg(result);
    if (result.success) {
      setEditingRole(null);
      router.refresh();
    }
  }

  async function handleDelete(formData: FormData) {
    const result = await deleteRoleAction({ success: false, message: '' }, formData);
    setDeleteMsg(result);
    if (result.success) {
      setDeleteId(null);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo rol
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Permisos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sistema
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-sm text-gray-500">
                  No se encontraron roles
                </td>
              </tr>
            ) : (
              roles.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {r.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {r.description ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {r.rolePermissions.length} permisos
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {r.isSystem ? (
                      <span className="text-xs font-medium text-amber-600">Sistema</span>
                    ) : (
                      <span className="text-xs text-gray-400">Personalizado</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingRole(r)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
                        aria-label="Editar rol"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {!r.isSystem && (
                        <button
                          onClick={() => setDeleteId(r.id)}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
                          aria-label="Eliminar rol"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(showCreate || editingRole) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowCreate(false);
            setEditingRole(null);
          }}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingRole ? 'Editar rol' : 'Nuevo rol'}
              </h2>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setEditingRole(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-all duration-200"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={editingRole ? handleUpdate : handleCreate} className="mt-5 space-y-4">
              {editingRole && <input type="hidden" name="id" value={editingRole.id} />}

              <div>
                <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="role-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingRole?.name ?? ''}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="role-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="role-description"
                  name="description"
                  rows={3}
                  defaultValue={editingRole?.description ?? ''}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {(editingRole ? updateMsg : createMsg).message && (
                <p
                  className={`text-sm ${(editingRole ? updateMsg : createMsg).success ? 'text-green-600' : 'text-red-600'}`}
                >
                  {(editingRole ? updateMsg : createMsg).message}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setEditingRole(null);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <SubmitButton label={editingRole ? 'Actualizar' : 'Crear rol'} />
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
              <h2 className="text-lg font-semibold text-gray-900">Eliminar rol</h2>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              ¿Estás seguro de eliminar este rol? Esta acción no se puede deshacer.
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
