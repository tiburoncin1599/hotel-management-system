import { auth } from './config';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

export async function getCurrentUser(): Promise<Session['user'] | null> {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth(): Promise<Session['user']> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(...roles: string[]): Promise<Session['user']> {
  const user = await requireAuth();
  if (!user.role || !roles.includes(user.role)) {
    redirect('/login');
  }
  return user;
}
