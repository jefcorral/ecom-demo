import { fetchApi, setTokens, clearTokens } from "@/lib/api";
import { API_URL } from "@/lib/env";
import { AuthResponse, UpdateProfileInput, User } from "@/types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Login failed");
  }
  const data = (await res.json()) as AuthResponse;
  setTokens(data.tokens);
  return data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Registration failed");
  }
  const data = (await res.json()) as AuthResponse;
  setTokens(data.tokens);
  return data;
}

export async function fetchMe(): Promise<User> {
  const res = await fetchApi("/auth/me");
  if (!res.ok) throw new Error("Failed to load user");
  return (await res.json()) as User;
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const res = await fetchApi("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to update profile");
  }
  return (await res.json()) as User;
}

export async function logout(): Promise<void> {
  try {
    await fetchApi("/auth/logout", { method: "POST" });
  } finally {
    clearTokens();
  }
}
// Note: ecom-api has no self-service account deletion endpoint yet;
// this attempts deletion via /users/:id (requires admin) and will fail for normal users until DELETE /auth/me is added.
export async function deleteAccount(): Promise<void> {
  const res = await fetchApi("/auth/me", { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Failed to delete account (status ${res.status})`);
  }
}

