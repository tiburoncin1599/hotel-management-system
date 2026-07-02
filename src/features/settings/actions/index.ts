'use server';

import { settingsService } from '../services/settings';
import { requireAuth, requireRole } from '@/lib/auth/helpers';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import type { UserWithRole, RoleWithPermissions, SystemInfo } from '../types';

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export async function getHotelInfoAction() {
  await requireAuth();
  return settingsService.getHotelInfo();
}

export async function updateHotelInfoAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('admin');

  try {
    const raw = {
      name: formData.get('name'),
      logo: formData.get('logo'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      website: formData.get('website'),
      currency: formData.get('currency'),
      timezone: formData.get('timezone'),
    };
    const data = await settingsService.updateHotelInfo(raw);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Información del hotel actualizada', data };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al actualizar info del hotel', {
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar la información',
    };
  }
}

export async function getGeneralConfigAction() {
  await requireAuth();
  return settingsService.getGeneralConfig();
}

export async function updateGeneralConfigAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('admin');

  try {
    const raw = {
      taxRate: formData.get('taxRate'),
      defaultCurrency: formData.get('defaultCurrency'),
      dateFormat: formData.get('dateFormat'),
      timeFormat: formData.get('timeFormat'),
    };
    const data = await settingsService.updateGeneralConfig(raw);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Configuración general actualizada', data };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al actualizar configuración general', {
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar la configuración',
    };
  }
}

export async function getUsersAction(): Promise<UserWithRole[]> {
  await requireAuth();
  return settingsService.getUsers();
}

export async function createUserAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole('admin');

  try {
    const raw = {
      email: formData.get('email'),
      password: formData.get('password'),
      roleId: formData.get('roleId'),
    };
    await settingsService.createUser(raw, user.id!);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Usuario creado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al crear usuario', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al crear el usuario',
    };
  }
}

export async function updateUserAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole('admin');

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    const raw = {
      email: formData.get('email'),
      roleId: formData.get('roleId'),
      isActive: formData.get('isActive'),
    };
    await settingsService.updateUser(id, raw, user.id!);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Usuario actualizado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al actualizar usuario', {
      userId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar el usuario',
    };
  }
}

export async function deleteUserAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole('admin');

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    await settingsService.deleteUser(id, user.id!);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Usuario eliminado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al eliminar usuario', {
      userId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al eliminar el usuario',
    };
  }
}

export async function getRolesAction(): Promise<RoleWithPermissions[]> {
  await requireAuth();
  return settingsService.getRoles();
}

export async function createRoleAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('admin');

  try {
    const raw = {
      name: formData.get('name'),
      description: formData.get('description'),
    };
    await settingsService.createRole(raw);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Rol creado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al crear rol', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al crear el rol',
    };
  }
}

export async function updateRoleAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('admin');

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    const raw = {
      name: formData.get('name'),
      description: formData.get('description'),
    };
    await settingsService.updateRole(id, raw);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Rol actualizado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al actualizar rol', {
      roleId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al actualizar el rol',
    };
  }
}

export async function deleteRoleAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('admin');

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: 'ID no proporcionado' };

  try {
    await settingsService.deleteRole(id);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Rol eliminado exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al eliminar rol', {
      roleId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al eliminar el rol',
    };
  }
}

export async function getPermissionsAction() {
  await requireAuth();
  return settingsService.getPermissions();
}

export async function assignPermissionAction(
  roleId: string,
  permissionId: string,
): Promise<ActionState> {
  await requireRole('admin');

  try {
    await settingsService.assignPermission(roleId, permissionId);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Permiso asignado exitosamente' };
  } catch (e) {
    logger.error('Error al asignar permiso', {
      roleId,
      permissionId,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al asignar el permiso',
    };
  }
}

export async function removePermissionAction(
  roleId: string,
  permissionId: string,
): Promise<ActionState> {
  await requireRole('admin');

  try {
    await settingsService.removePermission(roleId, permissionId);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Permiso removido exitosamente' };
  } catch (e) {
    logger.error('Error al remover permiso', {
      roleId,
      permissionId,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al remover el permiso',
    };
  }
}

export async function changePasswordAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAuth();

  try {
    const raw = {
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    };
    await settingsService.changePassword(user.id!, raw);
    return { success: true, message: 'Contraseña cambiada exitosamente' };
  } catch (e) {
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    logger.error('Error al cambiar contraseña', { error: e instanceof Error ? e.message : e });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al cambiar la contraseña',
    };
  }
}

export async function getNotificationsAction() {
  const user = await requireAuth();
  return settingsService.getNotifications(user.id!);
}

export async function markNotificationReadAction(id: string): Promise<ActionState> {
  await requireAuth();

  try {
    await settingsService.markNotificationRead(id);
    revalidatePath('/dashboard/configuracion');
    return { success: true, message: 'Notificación marcada como leída' };
  } catch (e) {
    logger.error('Error al marcar notificación', {
      notificationId: id,
      error: e instanceof Error ? e.message : e,
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Error al marcar la notificación',
    };
  }
}

export async function getAuditLogsAction() {
  await requireRole('admin');
  return settingsService.getAuditLogs();
}

export async function getSystemInfoAction(): Promise<SystemInfo> {
  await requireRole('admin');
  return settingsService.getSystemInfo();
}
