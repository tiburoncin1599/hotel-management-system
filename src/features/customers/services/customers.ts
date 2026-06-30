import { customerRepository } from '../repositories/customers';
import { createCustomerSchema, updateCustomerSchema, customerQuerySchema } from '../schemas';
import type { CustomerFilters, PaginatedResult, CustomerWithCountry } from '../types';
import type { Country } from '@/generated/prisma/client';

export const customerService = {
  async getCustomers(filters: CustomerFilters): Promise<PaginatedResult<CustomerWithCountry>> {
    const parsed = customerQuerySchema.parse({
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      search: filters.search,
      countryId: filters.countryId,
    });
    return customerRepository.findAll(parsed);
  },

  async getCustomerById(id: string): Promise<CustomerWithCountry | null> {
    if (!id) return null;
    return customerRepository.findById(id);
  },

  async createCustomer(data: unknown, userId: string) {
    const parsed = createCustomerSchema.parse(data);

    if (parsed.email) {
      const existing = await customerRepository.findByEmail(parsed.email);
      if (existing) {
        throw new Error('Ya existe un cliente con ese email');
      }
    }

    if (parsed.documentType && parsed.documentNumber) {
      const existing = await customerRepository.findByDocument(
        parsed.documentType,
        parsed.documentNumber,
      );
      if (existing) {
        throw new Error('Ya existe un cliente con ese documento');
      }
    }

    return customerRepository.create({
      ...parsed,
      countryId: parsed.countryId || undefined,
      createdById: userId,
    });
  },

  async updateCustomer(id: string, data: unknown, userId: string) {
    const parsed = updateCustomerSchema.parse({ id, ...(data as object) });

    if (parsed.email) {
      const existing = await customerRepository.findByEmail(parsed.email, id);
      if (existing) {
        throw new Error('Ya existe otro cliente con ese email');
      }
    }

    if (parsed.documentType && parsed.documentNumber) {
      const existing = await customerRepository.findByDocument(
        parsed.documentType,
        parsed.documentNumber,
        id,
      );
      if (existing) {
        throw new Error('Ya existe otro cliente con ese documento');
      }
    }

    return customerRepository.update(id, {
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      email: parsed.email || undefined,
      phone: parsed.phone || undefined,
      documentType: parsed.documentType || undefined,
      documentNumber: parsed.documentNumber || undefined,
      countryId: parsed.countryId || undefined,
      address: parsed.address || undefined,
      updatedById: userId,
    });
  },

  async deleteCustomer(id: string, userId: string) {
    return customerRepository.softDelete(id, userId);
  },

  async getCountries(): Promise<Country[]> {
    return customerRepository.findCountries();
  },
};
