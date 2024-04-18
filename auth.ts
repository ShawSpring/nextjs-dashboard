import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from './app/lib/definitions';
import bcrypt from 'bcrypt';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // 先 validate
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);
        // 再 authenticate
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            return user;
          }
        }
        console.log('Failed to parse Credentials');
        return null;
      },
    }),
  ],
});
//!  返回值需要手动声明，因为sql查询结果可能为空
async function getUser(email: string): Promise<User | undefined> {
  try {
    const res = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return res.rows[0];
  } catch (error) {
    console.log('Failed to fetch user:', error);
    throw new Error('Failed to fetch user');
  }
}
