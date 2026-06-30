import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  User,
  Calendar,
  Pencil,
  BookOpen,
} from 'lucide-react';
import type { CustomerWithCountry } from '../types';
import { DeleteCustomerButton } from './delete-button';

interface CustomerDetailProps {
  customer: CustomerWithCountry;
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/clientes"
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            aria-label="Volver a clientes"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              {customer.documentType && customer.documentNumber
                ? `${customer.documentType}: ${customer.documentNumber}`
                : 'Sin documento registrado'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/clientes/${customer.id}?edit=1`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
          <DeleteCustomerButton customerId={customer.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Información personal</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Nombre completo</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">
                    {customer.email ? (
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {customer.email}
                      </a>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Teléfono</dt>
                  <dd className="text-sm text-gray-900">{customer.phone ?? '—'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Documento</dt>
                  <dd className="text-sm text-gray-900">
                    {customer.documentType && customer.documentNumber
                      ? `${customer.documentType} ${customer.documentNumber}`
                      : '—'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">País</dt>
                  <dd className="text-sm text-gray-900">{customer.country?.name ?? '—'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <dt className="text-xs text-gray-500">Dirección</dt>
                  <dd className="text-sm text-gray-900">{customer.address ?? '—'}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Estado de la cuenta</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-gray-500">Estado</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {customer.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Cliente desde</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Resumen</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="text-sm font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{customer.email ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">País</p>
                  <p className="text-sm font-medium text-gray-900">
                    {customer.country?.name ?? '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Registrado</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Reservas</h2>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              El historial de reservas estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
