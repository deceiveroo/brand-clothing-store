import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from '@/lib/prisma';

const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const }, // ← добавьте 'as const'
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        if (credentials.email === "admin" && credentials.password === "admin") {
          return {
            id: "admin",
            email: "admin@brand.com",
            name: "Admin",
            role: "admin"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async session(params: any) {
      const { token, session } = params;
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt(params: any) {
      const { token, user } = params;
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);