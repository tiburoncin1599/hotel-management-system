'use server';

import { signOut as authSignOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function logout() {
  await authSignOut();
  redirect('/login');
}
