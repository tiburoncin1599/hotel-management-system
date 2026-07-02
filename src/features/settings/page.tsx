import {
  getHotelInfoAction,
  getGeneralConfigAction,
  getUsersAction,
  getRolesAction,
  getPermissionsAction,
  getNotificationsAction,
  getAuditLogsAction,
  getSystemInfoAction,
} from './actions';
import { HotelInfoForm } from './components/hotel-info-form';
import { GeneralConfigForm } from './components/general-config-form';
import { UsersSection } from './components/users-section';
import { RolesSection } from './components/roles-section';
import { PermissionsSection } from './components/permissions-section';
import { NotificationsSection } from './components/notifications-section';
import { SecuritySection } from './components/security-section';
import { SystemSection } from './components/system-section';
import { Building2, Sliders, Users, Shield, KeyRound, Bell, Lock, Server } from 'lucide-react';

const TABS = [
  { id: 'hotel', label: 'Hotel', icon: Building2 },
  { id: 'general', label: 'General', icon: Sliders },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'roles', label: 'Roles', icon: Shield },
  { id: 'permissions', label: 'Permisos', icon: KeyRound },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'security', label: 'Seguridad', icon: Lock },
  { id: 'system', label: 'Sistema', icon: Server },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SettingsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const activeTab = (typeof params.tab === 'string' ? params.tab : 'hotel') as TabId;

  const [
    hotelInfo,
    generalConfig,
    users,
    roles,
    permissions,
    notifications,
    auditLogs,
    systemInfo,
  ] = await Promise.all([
    getHotelInfoAction(),
    getGeneralConfigAction(),
    getUsersAction(),
    getRolesAction(),
    getPermissionsAction(),
    getNotificationsAction(),
    getAuditLogsAction(),
    getSystemInfoAction(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">Administra la configuración del sistema</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`/dashboard/configuracion?tab=${id}`}
              className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="animate-slide-up">
        {activeTab === 'hotel' && <HotelInfoForm hotelInfo={hotelInfo} />}
        {activeTab === 'general' && <GeneralConfigForm config={generalConfig} />}
        {activeTab === 'users' && <UsersSection users={users} roles={roles} />}
        {activeTab === 'roles' && <RolesSection roles={roles} />}
        {activeTab === 'permissions' && (
          <PermissionsSection roles={roles} permissions={permissions} />
        )}
        {activeTab === 'notifications' && <NotificationsSection notifications={notifications} />}
        {activeTab === 'security' && <SecuritySection />}
        {activeTab === 'system' && <SystemSection systemInfo={systemInfo} auditLogs={auditLogs} />}
      </div>
    </div>
  );
}
