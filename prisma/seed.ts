import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  // --- Roles ---
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrador del sistema',
      isSystem: true,
    },
  });

  await prisma.role.upsert({
    where: { name: 'recepcionista' },
    update: {},
    create: {
      name: 'recepcionista',
      description: 'Recepcionista del hotel',
      isSystem: true,
    },
  });

  // --- Admin User ---
  await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: { passwordHash: adminPassword },
    create: {
      email: 'admin@hotel.com',
      passwordHash: adminPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  // --- Currency ---
  await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      decimalPlaces: 2,
    },
  });

  // --- Countries ---
  const countries = [
    { code: 'MX', name: 'México', phoneCode: '+52' },
    { code: 'US', name: 'Estados Unidos', phoneCode: '+1' },
    { code: 'ES', name: 'España', phoneCode: '+34' },
    { code: 'FR', name: 'Francia', phoneCode: '+33' },
    { code: 'DE', name: 'Alemania', phoneCode: '+49' },
    { code: 'AR', name: 'Argentina', phoneCode: '+54' },
    { code: 'CO', name: 'Colombia', phoneCode: '+57' },
    { code: 'CL', name: 'Chile', phoneCode: '+56' },
    { code: 'PE', name: 'Perú', phoneCode: '+51' },
    { code: 'BR', name: 'Brasil', phoneCode: '+55' },
  ];
  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // --- Room Statuses ---
  const roomStatuses = [
    { code: 'available', name: 'Disponible', description: 'Habitación disponible para reserva' },
    { code: 'occupied', name: 'Ocupada', description: 'Habitación ocupada por huéspedes' },
    { code: 'maintenance', name: 'Mantenimiento', description: 'Habitación en mantenimiento' },
    { code: 'cleaning', name: 'Limpieza', description: 'Habitación en proceso de limpieza' },
    {
      code: 'out_of_order',
      name: 'Fuera de servicio',
      description: 'Habitación fuera de servicio temporalmente',
    },
  ];
  const statusMap: Record<string, string> = {};
  for (const s of roomStatuses) {
    const created = await prisma.roomStatus.upsert({
      where: { code: s.code },
      update: { name: s.name, description: s.description },
      create: s,
    });
    statusMap[s.code] = created.id;
  }
  // --- Booking Statuses ---
  const bookingStatuses = [
    {
      code: 'pending',
      name: 'Pendiente',
      description: 'Reserva pendiente de confirmación',
      color: '#f59e0b',
    },
    {
      code: 'confirmed',
      name: 'Confirmada',
      description: 'Reserva confirmada',
      color: '#10b981',
    },
    {
      code: 'checked_in',
      name: 'Check In',
      description: 'Huésped registrado',
      color: '#3b82f6',
    },
    {
      code: 'checked_out',
      name: 'Check Out',
      description: 'Estadía finalizada',
      color: '#6b7280',
    },
    {
      code: 'cancelled',
      name: 'Cancelada',
      description: 'Reserva cancelada',
      color: '#ef4444',
    },
  ];

  for (const status of bookingStatuses) {
    await prisma.bookingStatus.upsert({
      where: {
        code: status.code,
      },
      update: {
        name: status.name,
        description: status.description,
        color: status.color,
      },
      create: status,
    });
  }

  // --- Payment Methods ---
  const paymentMethods = [
    { code: 'CASH', name: 'Efectivo', description: 'Pago en efectivo' },
    { code: 'CREDIT_CARD', name: 'Tarjeta de crédito', description: 'Pago con tarjeta de crédito' },
    { code: 'DEBIT_CARD', name: 'Tarjeta de débito', description: 'Pago con tarjeta de débito' },
    {
      code: 'TRANSFER',
      name: 'Transferencia bancaria',
      description: 'Pago por transferencia bancaria',
    },
    { code: 'CHECK', name: 'Cheque', description: 'Pago con cheque' },
  ];
  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { code: pm.code },
      update: { name: pm.name, description: pm.description },
      create: pm,
    });
  }

  // --- Amenities ---
  const amenityData = [
    { name: 'WiFi', icon: 'wifi', category: 'general' },
    { name: 'Aire acondicionado', icon: 'ac', category: 'general' },
    { name: 'TV Smart', icon: 'tv', category: 'entretenimiento' },
    { name: 'Minibar', icon: 'minibar', category: 'alimentos' },
    { name: 'Caja fuerte', icon: 'safe', category: 'seguridad' },
    { name: 'Balcón', icon: 'balcony', category: 'vistas' },
    { name: 'Vista al mar', icon: 'ocean', category: 'vistas' },
    { name: 'Jacuzzi', icon: 'jacuzzi', category: 'lujo' },
    { name: 'Escritorio', icon: 'desk', category: 'trabajo' },
    { name: 'Plancha', icon: 'iron', category: 'general' },
  ];
  for (const a of amenityData) {
    const existing = await prisma.amenity.findFirst({ where: { name: a.name } });
    if (!existing) {
      await prisma.amenity.create({ data: a });
    }
  }

  // --- Room Types ---
  const usd = await prisma.currency.findUnique({ where: { code: 'USD' } });
  const currencyId = usd?.id;

  const roomTypes = [
    {
      name: 'Individual',
      description: 'Habitación individual con cama sencilla',
      basePricePerNight: 80,
      maxOccupancy: 1,
      maxAdults: 1,
      maxChildren: 0,
      size: 20,
    },
    {
      name: 'Doble',
      description: 'Habitación doble con dos camas',
      basePricePerNight: 120,
      maxOccupancy: 2,
      maxAdults: 2,
      maxChildren: 1,
      size: 28,
    },
    {
      name: 'Suite',
      description: 'Suite con sala de estar y cama king',
      basePricePerNight: 200,
      maxOccupancy: 3,
      maxAdults: 2,
      maxChildren: 1,
      size: 45,
    },
    {
      name: 'Suite Presidencial',
      description: 'Suite de lujo con todas las comodidades',
      basePricePerNight: 350,
      maxOccupancy: 4,
      maxAdults: 2,
      maxChildren: 2,
      size: 80,
    },
  ];
  const typeMap: Record<string, string> = {};
  for (const rt of roomTypes) {
    const created = await prisma.roomType.upsert({
      where: { name: rt.name },
      update: {},
      create: { ...rt, currencyId },
    });
    typeMap[rt.name] = created.id;
  }

  // --- Room Type Amenities ---
  const allAmenities = await prisma.amenity.findMany();
  for (const [, typeId] of Object.entries(typeMap)) {
    for (const amenity of allAmenities.slice(0, 5)) {
      await prisma.roomTypeAmenity.upsert({
        where: { roomTypeId_amenityId: { roomTypeId: typeId, amenityId: amenity.id } },
        update: {},
        create: { roomTypeId: typeId, amenityId: amenity.id },
      });
    }
  }

  // --- Rooms ---
  const floorRooms: { floor: number; numbers: string[]; type: string }[] = [
    { floor: 1, numbers: ['101', '102', '103', '104', '105'], type: 'Individual' },
    { floor: 2, numbers: ['201', '202', '203', '204', '205'], type: 'Doble' },
    { floor: 3, numbers: ['301', '302', '303', '304', '305'], type: 'Suite' },
    { floor: 4, numbers: ['401'], type: 'Suite Presidencial' },
  ];
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@hotel.com' } });

  for (const floor of floorRooms) {
    for (const num of floor.numbers) {
      const statusCode = floor.floor === 1 && num === '101' ? 'occupied' : 'available';
      await prisma.room.upsert({
        where: { roomNumber: num },
        update: {},
        create: {
          roomNumber: num,
          floor: floor.floor,
          roomTypeId: typeMap[floor.type],
          statusId: statusMap[statusCode],
          isActive: true,
          createdById: adminUser?.id,
        },
      });
    }
  }

  // --- Sample Customers ---
  const mxCountry = await prisma.country.findUnique({ where: { code: 'MX' } });
  const usCountry = await prisma.country.findUnique({ where: { code: 'US' } });
  const esCountry = await prisma.country.findUnique({ where: { code: 'ES' } });
  const sampleCustomers = [
    {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '+52 555 1234',
      documentType: 'INE',
      documentNumber: 'PEGJ900101',
      countryId: mxCountry?.id,
      address: 'Calle Principal 123, CDMX',
    },
    {
      firstName: 'María',
      lastName: 'García',
      email: 'maria@example.com',
      phone: '+52 555 5678',
      documentType: 'INE',
      documentNumber: 'GAMM850203',
      countryId: mxCountry?.id,
      address: 'Av. Reforma 456, CDMX',
    },
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '+1 212 555 0198',
      documentType: 'Pasaporte',
      documentNumber: 'SM123456',
      countryId: usCountry?.id,
      address: '123 Broadway, NY',
    },
    {
      firstName: 'Ana',
      lastName: 'Martínez',
      email: 'ana@example.com',
      phone: '+34 91 123 45 67',
      documentType: 'DNI',
      documentNumber: '12345678A',
      countryId: esCountry?.id,
      address: 'Calle Mayor 78, Madrid',
    },
  ];
  for (const c of sampleCustomers) {
    const existing = await prisma.customer.findFirst({ where: { email: c.email } });
    if (!existing) {
      await prisma.customer.create({ data: c });
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
