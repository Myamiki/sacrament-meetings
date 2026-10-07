import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnMeetings =
        nextUrl.pathname === '/meetings' ||
        nextUrl.pathname.startsWith('/meetings/');
      const isOnLogin = nextUrl.pathname === '/login';

      if (isOnMeetings) {
        return isLoggedIn;
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
