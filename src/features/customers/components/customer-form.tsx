'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCustomerAction, updateCustomerAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { CustomerWithCountry } from '../types';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
    >
      <Save className="h-4 w-4" />
      {pending ? 'Guardando...' : label}
    </button>
  );
}

interface CustomerFormProps {
  countries: { id: string; code: string; name: string }[];
  customer?: CustomerWithCountry;
}

export function CustomerForm({ countries, customer }: CustomerFormProps) {
  const isEditing = !!customer;
  const action = isEditing ? updateCustomerAction : createCustomerAction;
  const [state, formAction] = useActionState(action, { success: false, message: '' });

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/clientes"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditing
              ? `Editando a ${customer.firstName} ${customer.lastName}`
              : 'Registrar un nuevo cliente en el sistema'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form action={formAction} className="space-y-5">
          {isEditing && <input type="hidden" name="id" value={customer.id} />}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                defaultValue={customer?.firstName ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                defaultValue={customer?.lastName ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={customer?.email ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                defaultValue={customer?.phone ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                Tipo de documento
              </label>
              <select
                id="documentType"
                name="documentType"
                defaultValue={customer?.documentType ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Seleccionar</option>
                <option value="INE">INE</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="DNI">DNI</option>
                <option value="Cédula">Cédula</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">
                Número de documento
              </label>
              <input
                id="documentNumber"
                name="documentNumber"
                type="text"
                defaultValue={customer?.documentNumber ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="countryId" className="block text-sm font-medium text-gray-700">
                País
              </label>
              <select
                id="countryId"
                name="countryId"
                defaultValue={customer?.countryId ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Seleccionar país</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={customer?.address ?? ''}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {state.message && (
            <p
              className={`rounded-lg p-3 text-sm ${
                state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {state.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/dashboard/clientes"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <SubmitButton label={isEditing ? 'Actualizar' : 'Crear cliente'} />
          </div>
        </form>
      </div>
    </div>
  );
}
