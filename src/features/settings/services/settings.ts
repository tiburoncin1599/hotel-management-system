import { prisma } from '@/lib/prisma';
import { settingsRepository } from '../repositories/settings';
import {
  hotelInfoSchema,
  generalConfigSchema,
  createUserSchema,
  updateUserSchema,
  createRoleSchema,
  updateRoleSchema,
  changePasswordSchema,
} from '../schemas';
import type { UserWithRole, RoleWithPermissions } from '../types';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

function parseConfigToInfo(config: Record<string, string>) {
  return {
    name: config.hotel_name ?? '',
    logo: config.hotel_logo ?? '',
    address: config.hotel_address ?? '',
    phone: config.hotel_phone ?? '',
    email: config.hotel_email ?? '',
    website: config.hotel_website ?? '',
    currency: config.hotel_currency ?? 'USD',
    timezone: config.hotel_timezone ?? 'UTC',
  };
}

function parseConfigToGeneral(config: Record<string, string>) {
  return {
    taxRate: parseFloat(config.config_tax_rate ?? '0'),
    defaultCurrency: config.config_default_currency ?? 'USD',
    dateFormat: config.config_date_format ?? 'DD/MM/YYYY',
    timeFormat: config.config_time_format ?? 'HH:mm',
  };
}

export const settingsService = {
  async getHotelInfo() {
    const config = await settingsRepository.getHotelConfig();
    return parseConfigToInfo(config);
  },

  async updateHotelInfo(data: unknown) {
    const parsed = hotelInfoSchema.parse(data);
    const configs = [
      { configKey: 'hotel_name', configValue: parsed.name },
      { configKey: 'hotel_logo', configValue: parsed.logo ?? '' },
      { configKey: 'hotel_address', configValue: parsed.address ?? '' },
      { configKey: 'hotel_phone', configValue: parsed.phone ?? '' },
      { configKey: 'hotel_email', configValue: parsed.email ?? '' },
      { configKey: 'hotel_website', configValue: parsed.website ?? '' },
      { configKey: 'hotel_currency', configValue: parsed.currency },
      { configKey: 'hotel_timezone', configValue: parsed.timezone },
    ];
    await settingsRepository.updateHotelConfigs(configs);
    return parseConfigToInfo(
      configs.reduce(
        (acc, c) => ({ ...acc, [c.configKey]: c.configValue }),
        {} as Record<string, string>,
      ),
    );
  },

  async getGeneralConfig() {
    const config = await settingsRepository.getHotelConfig();
    return parseConfigToGeneral(config);
  },

  async updateGeneralConfig(data: unknown) {
    const parsed = generalConfigSchema.parse(data);
    const configs = [
      { configKey: 'config_tax_rate', configValue: String(parsed.taxRate) },
      { configKey: 'config_default_currency', configValue: parsed.defaultCurrency },
      { configKey: 'config_date_format', configValue: parsed.dateFormat },
      { configKey: 'config_time_format', configValue: parsed.timeFormat },
    ];
    await settingsRepository.updateHotelConfigs(configs);
    return parseConfigToGeneral(
      configs.reduce(
        (acc, c) => ({ ...acc, [c.configKey]: c.configValue }),
        {} as Record<string, string>,
      ),
    );
  },

  async getUsers(): Promise<UserWithRole[]> {
    return settingsRepository.getUsers();
  },

  async getUserById(id: string): Promise<UserWithRole | null> {
    if (!id) return null;
    return settingsRepository.getUserById(id);
  },

  async createUser(data: unknown, userId: string) {
    const parsed = createUserSchema.parse(data);

    const existing = await settingsRepository.findByEmail(parsed.email);
    if (existing) {
      throw new Error('Ya existe un usuario con ese email');
    }

    const passwordHash = await bcrypt.hash(parsed.password, SALT_ROUNDS);

    return settingsRepository.createUser({
      email: parsed.email,
      passwordHash,
      roleId: parsed.roleId,
      createdById: userId,
    });
  },

  async updateUser(id: string, data: unknown, userId: string) {
    const parsed = updateUserSchema.parse({ id, ...(data as object) });

    if (parsed.email) {
      const existing = await settingsRepository.findByEmail(parsed.email, id);
      if (existing) {
        throw new Error('Ya existe otro usuario con ese email');
      }
    }

    return settingsRepository.updateUser(id, {
      email: parsed.email,
      roleId: parsed.roleId,
      isActive: parsed.isActive,
      updatedById: userId,
    });
  },

  async deleteUser(id: string, userId: string) {
    return settingsRepository.deleteUser(id, userId);
  },

  async getRoles(): Promise<RoleWithPermissions[]> {
    return settingsRepository.getRoles();
  },

  async getRoleById(id: string): Promise<RoleWithPermissions | null> {
    if (!id) return null;
    return settingsRepository.getRoleById(id);
  },

  async createRole(data: unknown) {
    const parsed = createRoleSchema.parse(data);

    const existing = await settingsRepository.findRoleByName(parsed.name);
    if (existing) {
      throw new Error('Ya existe un rol con ese nombre');
    }

    return settingsRepository.createRole({
      name: parsed.name,
      description: parsed.description || undefined,
    });
  },

  async updateRole(id: string, data: unknown) {
    const parsed = updateRoleSchema.parse({ id, ...(data as object) });

    const existing = await settingsRepository.findRoleByName(parsed.name, id);
    if (existing) {
      throw new Error('Ya existe otro rol con ese nombre');
    }

    return settingsRepository.updateRole(id, {
      name: parsed.name,
      description: parsed.description || undefined,
    });
  },

  async deleteRole(id: string) {
    return settingsRepository.deleteRole(id);
  },

  async getPermissions() {
    return settingsRepository.getPermissions();
  },

  async assignPermission(roleId: string, permissionId: string) {
    return settingsRepository.assignPermission(roleId, permissionId);
  },

  async removePermission(roleId: string, permissionId: string) {
    return settingsRepository.removePermission(roleId, permissionId);
  },

  async getNotifications(userId: string) {
    return settingsRepository.getNotifications(userId);
  },

  async markNotificationRead(id: string) {
    return settingsRepository.markNotificationRead(id);
  },

  async getAuditLogs() {
    const logs = await settingsRepository.getAuditLogs();
    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      timestamp: log.timestamp.toISOString(),
      user: log.user,
    }));
  },

  async getSystemInfo() {
    const info = await settingsRepository.getSystemInfo();
    return {
      version: '1.0.0',
      dbStatus: 'connected',
      serverInfo: {
        uptime: process.uptime(),
        memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`,
        nodeVersion: process.version,
      },
      ...info,
    };
  },

  async changePassword(userId: string, data: unknown) {
    const parsed = changePasswordSchema.parse(data);

    const user = await settingsRepository.getUserById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(parsed.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    const passwordHash = await bcrypt.hash(parsed.newPassword, SALT_ROUNDS);
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },
};
