import { API_URL } from "@/lib/env";
import { Tokens } from "@/types";

const TOKEN_KEY = "ecom_tokens";
const SESSION_ID_KEY = "ecom_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

export function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_KEY);
  return raw ? (JSON.parse(raw) as Tokens) : null;
}

export function setTokens(tokens: Tokens): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getTokens()?.accessToken;
}

export async function refreshAccessToken(): Promise<Tokens | null> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = (await res.json()) as Tokens;
  setTokens(data);
  return data;
}

export async function fetchApi(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const tokens = getTokens();
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (tokens?.accessToken) {
    headers.set("Authorization", `Bearer ${tokens.accessToken}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && tokens?.refreshToken) {
    const newTokens = await refreshAccessToken();
    if (newTokens) {
      headers.set("Authorization", `Bearer ${newTokens.accessToken}`);
      return fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }

  return res;
}
