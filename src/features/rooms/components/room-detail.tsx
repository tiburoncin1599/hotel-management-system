import Link from 'next/link';
import {
  ArrowLeft,
  BedDouble,
  Building,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Pencil,
  Users,
  Wifi,
  Tv,
  Wind,
  Wine,
  Shield,
  Eye,
  Table,
} from 'lucide-react';
import type { RoomWithRelations } from '../types';
import { DeleteRoomButton } from './delete-button';

const iconMap: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,
  ac: <Wind className="h-4 w-4" />,
  minibar: <Wine className="h-4 w-4" />,
  safe: <Shield className="h-4 w-4" />,
  balcony: <Eye className="h-4 w-4" />,
  desk: <Table className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  occupied: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-orange-100 text-orange-700',
  cleaning: 'bg-yellow-100 text-yellow-700',
  out_of_order: 'bg-red-100 text-red-700',
};

interface RoomDetailProps {
  room: RoomWithRelations;
}

export function RoomDetail({ room }: RoomDetailProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/habitaciones"
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            aria-label="Volver a habitaciones"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Habitación #{room.roomNumber}</h1>
            <p className="text-sm text-gray-500">
              {room.roomType.name} - Piso {room.floor ?? '—'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/habitaciones/${room.id}?edit=1`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
          <DeleteRoomButton roomId={room.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Información general</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Número</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{room.roomNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Piso</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{room.floor ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Tipo</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{room.roomType.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Estado</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[room.status.code] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {room.status.name}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Precio por noche</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  ${Number(room.roomType.basePricePerNight).toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Capacidad máxima</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {room.roomType.maxOccupancy} personas
                </dd>
              </div>
              {room.roomType.maxAdults && (
                <div>
                  <dt className="text-sm text-gray-500">Adultos</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {room.roomType.maxAdults}
                  </dd>
                </div>
              )}
              {room.roomType.maxChildren !== null && room.roomType.maxChildren !== undefined && (
                <div>
                  <dt className="text-sm text-gray-500">Niños</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {room.roomType.maxChildren}
                  </dd>
                </div>
              )}
              {room.roomType.size && (
                <div>
                  <dt className="text-sm text-gray-500">Tamaño</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {room.roomType.size} m²
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {room.roomType.roomTypeAmenities && room.roomType.roomTypeAmenities.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Amenidades</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {room.roomType.roomTypeAmenities.map((rta) => (
                  <div
                    key={rta.amenity.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 transition-all duration-200 hover:shadow-md"
                  >
                    <span className="text-gray-500">
                      {iconMap[rta.amenity.icon ?? ''] ?? <BedDouble className="h-4 w-4" />}
                    </span>
                    <span className="text-sm text-gray-700">{rta.amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {room.images.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Imágenes</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {room.images.map((img) => (
                  <div key={img.id} className="overflow-hidden rounded-lg bg-gray-100">
                    <div className="flex aspect-video items-center justify-center text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-500">{img.alt ?? 'Sin descripción'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Resumen</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <BedDouble className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tipo</p>
                  <p className="text-sm font-medium text-gray-900">{room.roomType.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Precio/noche</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${Number(room.roomType.basePricePerNight).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Capacidad</p>
                  <p className="text-sm font-medium text-gray-900">
                    {room.roomType.maxOccupancy} personas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Piso</p>
                  <p className="text-sm font-medium text-gray-900">{room.floor ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Creada</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
