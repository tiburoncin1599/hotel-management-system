'use server';

import { customerService } from '../services/customers';
import { requireAuth } from '@/lib/auth/helpers';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { CustomerFilters, PaginatedResult, CustomerWithCountry } from '../types';
import type { Country } from '@/generated/prisma/client';

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getCustomersAction(
  filters: CustomerFilters,
): Promise<PaginatedResult<CustomerWithCountry>> {
  await requireAuth();
  return customerService.getCustomers(filters);
}

export async function getCustomerByIdAction(id: string): Promise<CustomerWithCountry | null> {
  await requireAuth();
  return customerService.getCustomerById(id);
}

export async function getCountriesAction(): Promise<Country[]> {
  await requireAuth();
  return customerService.getCountries();
}

export async function createCustomerAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  try {
    const raw = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      documentType: formData.get('documentType'),
      documentNumber: formData.get('documentNumber'),
      countryId: formData.get('countryId'),
      address: formData.get('address'),
    };
    await customerService.createCustomer(raw, user.id!);
    revalidatePath('/dashboard/clientes');
    redirect('/dashboard/clientes');
    return { success: true, message: 'Cliente creado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al crear cliente', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al crear el cliente',
    };
  }
}

export async function updateCustomerAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    const raw = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      documentType: formData.get('documentType'),
      documentNumber: formData.get('documentNumber'),
      countryId: formData.get('countryId'),
      address: formData.get('address'),
    };
    await customerService.updateCustomer(id, raw, user.id!);
    revalidatePath('/dashboard/clientes');
    redirect('/dashboard/clientes');
    return { success: true, message: 'Cliente actualizado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al actualizar cliente', {
      customerId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar el cliente',
    };
  }
}

export async function deleteCustomerAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    await customerService.deleteCustomer(id, user.id!);
    revalidatePath('/dashboard/clientes');
    return { success: true, message: 'Cliente eliminado exitosamente' };
  } catch (e) {
    logger.error('Error al eliminar cliente', {
      customerId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al eliminar el cliente',
    };
  }
}
