import type { Customer, Country } from '@/generated/prisma/client';

export interface CustomerWithCountry extends Customer {
  country: Country | null;
}

export interface CustomerFilters {
  search?: string;
  countryId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
