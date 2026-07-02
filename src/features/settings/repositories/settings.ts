import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import type { UserWithRole, RoleWithPermissions } from '../types';

const userInclude = {
  role: true,
} satisfies Prisma.UserInclude;

const roleInclude = {
  rolePermissions: {
    include: { permission: true },
  },
} satisfies Prisma.RoleInclude;

export const settingsRepository = {
  async getHotelConfig(): Promise<Record<string, string>> {
    const configs = await prisma.hotelConfiguration.findMany();
    return configs.reduce(
      (acc, c) => {
        acc[c.configKey] = c.configValue;
        return acc;
      },
      {} as Record<string, string>,
    );
  },

  async updateHotelConfig(key: string, value: string) {
    return prisma.hotelConfiguration.upsert({
      where: { configKey: key },
      update: { configValue: value },
      create: {
        configKey: key,
        configValue: value,
      },
    });
  },

  async updateHotelConfigs(configs: { configKey: string; configValue: string }[]) {
    const operations = configs.map((c) =>
      prisma.hotelConfiguration.upsert({
        where: { configKey: c.configKey },
        update: { configValue: c.configValue },
        create: {
          configKey: c.configKey,
          configValue: c.configValue,
        },
      }),
    );
    return prisma.$transaction(operations);
  },

  async getUsers(): Promise<UserWithRole[]> {
    return prisma.user.findMany({
      where: { deletedAt: null },
      include: userInclude,
      orderBy: { createdAt: 'desc' },
    }) as unknown as UserWithRole[];
  },

  async getUserById(id: string): Promise<UserWithRole | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: userInclude,
    }) as unknown as UserWithRole | null;
  },

  async createUser(data: {
    email: string;
    passwordHash: string;
    roleId: string;
    createdById: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
        createdById: data.createdById,
      },
      include: userInclude,
    });
  },

  async updateUser(
    id: string,
    data: {
      email?: string;
      roleId?: string;
      isActive?: boolean;
      updatedById: string;
    },
  ) {
    const { updatedById, ...rest } = data;
    return prisma.user.update({
      where: { id },
      data: { ...rest, updatedById },
      include: userInclude,
    });
  },

  async deleteUser(id: string, deletedById: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, deletedById },
    });
  },

  async getRoles(): Promise<RoleWithPermissions[]> {
    return prisma.role.findMany({
      include: roleInclude,
      orderBy: { name: 'asc' },
    }) as unknown as RoleWithPermissions[];
  },

  async getRoleById(id: string): Promise<RoleWithPermissions | null> {
    return prisma.role.findFirst({
      where: { id },
      include: roleInclude,
    }) as unknown as RoleWithPermissions | null;
  },

  async createRole(data: { name: string; description?: string }) {
    return prisma.role.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
      include: roleInclude,
    });
  },

  async updateRole(id: string, data: { name?: string; description?: string }) {
    return prisma.role.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description || null } : {}),
      },
      include: roleInclude,
    });
  },

  async deleteRole(id: string) {
    return prisma.role.delete({ where: { id } });
  },

  async getPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { name: 'asc' }],
    });
  },

  async assignPermission(roleId: string, permissionId: string) {
    return prisma.rolePermission.create({
      data: { roleId, permissionId },
      include: { permission: true },
    });
  },

  async removePermission(roleId: string, permissionId: string) {
    return prisma.rolePermission.deleteMany({
      where: { roleId, permissionId },
    });
  },

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async markNotificationRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async getAuditLogs(limit = 50) {
    return prisma.auditLog.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  },

  async getSystemInfo() {
    const [userCount, roleCount, roomCount, bookingCount] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.role.count(),
      prisma.room.count({ where: { deletedAt: null } }),
      prisma.booking.count({ where: { deletedAt: null } }),
    ]);
    return { userCount, roleCount, roomCount, bookingCount };
  },

  async findByEmail(email: string, excludeId?: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  },

  async findRoleByName(name: string, excludeId?: string) {
    return prisma.role.findFirst({
      where: {
        name,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  },
};
