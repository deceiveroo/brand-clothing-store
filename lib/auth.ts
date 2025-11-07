// lib/auth.ts
import { getServerSession } from "next-auth/next";

// Для клиентских компонентов
export { useSession, signIn, signOut } from "next-auth/react";

// Для серверных компонентов и API routes
export const auth = getServerSession;