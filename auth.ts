import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"

async function getUser(email: string): Promise<User | undefined> {
    try {
        const response = await fetch(`${URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email})
        })
        const user = await response.json() as unknown as User;
        return user

    } catch(error) {
        console.error('User not found');
        throw new Error('User not found');
    }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6)}).safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(password, user.hashed_password);

                if (passwordsMatch) {
                    console.log(`found user: ${user}`)
                    return user;
                }
            }

            return null;
        }
    })
    ],
});