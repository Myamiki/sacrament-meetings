import 'server-only';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface User {
  id: number;
  email: string;
  password_hash: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await sql`
    SELECT id, email, password_hash
    FROM users
    WHERE lower(email) = ${normalizedEmail}
  ` as User[];

  return result[0] ?? null;
}
