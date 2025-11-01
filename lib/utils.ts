import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { authClient } from "./auth-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCurrentUser() {
  const session = await authClient.getSession();
  return session.data?.session ?? null;
}
