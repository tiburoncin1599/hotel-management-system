import type {
  User,
  Role,
  Permission,
  RolePermission,
  Notification,
  AuditLog,
} from '@/generated/prisma/client';

export type { Permission, Notification, AuditLog };

export interface HotelInfo {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  timezone: string;
}

export interface GeneralConfig {
  taxRate: number;
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: string;
}

export interface UserWithRole extends User {
  role: Role;
}

export interface RoleWithPermissions extends Role {
  rolePermissions: (RolePermission & { permission: Permission })[];
}

export interface SystemInfo {
  version: string;
  dbStatus: string;
  serverInfo: {
    uptime: number;
    memoryUsage: string;
    nodeVersion: string;
  };
  userCount: number;
  roleCount: number;
  roomCount: number;
  bookingCount: number;
}

export interface BackupEntry {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
}
