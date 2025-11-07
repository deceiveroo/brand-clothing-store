// lib/auth.ts - для использования в компонентах
import { getServerSession } from "next-auth/next";

// Реэкспортируем функции из next-auth
export { signIn, signOut, useSession } from "next-auth/react";
export { getServerSession };

// Алиас для getServerSession для совместимости
export const auth = getServerSession;