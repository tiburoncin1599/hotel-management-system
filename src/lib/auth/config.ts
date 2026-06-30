import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { Provider } from 'next-auth/providers';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';

const credentialsSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Correo', type: 'email', placeholder: 'admin@hotel.com' },
      password: { label: 'Contraseña', type: 'password' },
    },
    authorize: async (credentials) => {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { email, password } = parsed.data;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!user || !user.isActive) return null;

      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) return null;

      await prisma.$executeRaw`UPDATE users SET "lastLoginAt" = NOW() WHERE id = ${user.id}`;

      return {
        id: user.id,
        email: user.email,
        name: user.email,
        role: user.role.name,
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? null;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname.startsWith('/login');

      if (isOnDashboard && !isLoggedIn) {
        return false;
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  session: { strategy: 'jwt' },
  trustHost: true,
});
