import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Correo', type: 'email' },
      password: { label: 'Contraseña', type: 'password' },
    },
    authorize: () => null,
  }),
];

export const { auth } = NextAuth({
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnApiAuth = nextUrl.pathname.startsWith('/api/auth');

      if (isOnApiAuth) return true;
      if (isOnDashboard && !isLoggedIn) return false;
      if (isOnLogin && isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));

      return true;
    },
  },
  session: { strategy: 'jwt' },
  trustHost: true,
});
