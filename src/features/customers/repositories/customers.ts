import { prisma } from '@/lib/prisma';
import type { CustomerFilters, PaginatedResult, CustomerWithCountry } from '../types';
import type { Prisma, Country } from '@/generated/prisma/client';

function buildWhere(filters: CustomerFilters): Prisma.CustomerWhereInput {
  const where: Prisma.CustomerWhereInput = { deletedAt: null };

  if (filters.countryId) {
    where.countryId = filters.countryId;
  }

  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { documentNumber: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

const customerInclude = {
  country: true,
} satisfies Prisma.CustomerInclude;

export const customerRepository = {
  async findAll(filters: CustomerFilters): Promise<PaginatedResult<CustomerWithCountry>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = buildWhere(filters);

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: customerInclude,
        skip,
        take: limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: data as unknown as CustomerWithCountry[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string): Promise<CustomerWithCountry | null> {
    const customer = await prisma.customer.findFirst({
      where: { id, deletedAt: null },
      include: customerInclude,
    });
    return customer as unknown as CustomerWithCountry | null;
  },

  async create(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    documentType?: string;
    documentNumber?: string;
    countryId?: string;
    address?: string;
    createdById: string;
  }) {
    const { createdById, ...rest } = data;
    return prisma.customer.create({
      data: {
        ...rest,
        email: rest.email || undefined,
        phone: rest.phone || undefined,
        documentType: rest.documentType || undefined,
        documentNumber: rest.documentNumber || undefined,
        countryId: rest.countryId || undefined,
        address: rest.address || undefined,
        createdById,
      },
      include: customerInclude,
    });
  },

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      documentType?: string;
      documentNumber?: string;
      countryId?: string;
      address?: string;
      updatedById: string;
    },
  ) {
    const { updatedById, ...rest } = data;
    return prisma.customer.update({
      where: { id },
      data: {
        ...rest,
        email: rest.email || undefined,
        phone: rest.phone || undefined,
        documentType: rest.documentType || undefined,
        documentNumber: rest.documentNumber || undefined,
        countryId: rest.countryId || undefined,
        address: rest.address || undefined,
        updatedById,
      },
      include: customerInclude,
    });
  },

  async softDelete(id: string, deletedById: string) {
    return prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date(), deletedById, isActive: false },
    });
  },

  async findCountries() {
    return prisma.country.findMany({
      where: { isActive: true },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' },
    }) as unknown as Country[];
  },

  async findByEmail(email: string, excludeId?: string) {
    return prisma.customer.findFirst({
      where: {
        email,
        deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  },

  async findByDocument(documentType: string, documentNumber: string, excludeId?: string) {
    return prisma.customer.findFirst({
      where: {
        documentType,
        documentNumber,
        deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  },
};
