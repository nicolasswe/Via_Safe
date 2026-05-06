import { Platform } from "react-native";

function getApiBase(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;
  }
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const h = window.location.hostname;
    const proto = window.location.protocol;
    const apiHost = h.replace(".expo.riker", ".riker");
    return `${proto}//${apiHost}/api`;
  }
  return "http://localhost:3000/api";
}

export const API_BASE = getApiBase();

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Erro desconhecido");
  }
  return data as T;
}
