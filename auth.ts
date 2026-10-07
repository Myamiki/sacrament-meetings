import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/lib/users-db';

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
});
