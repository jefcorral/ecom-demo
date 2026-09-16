import { fetchApi } from "@/lib/api";

export interface SubscribeInput {
  email: string;
  name?: string;
  source?: string;
}

export async function subscribeToNewsletter(input: SubscribeInput): Promise<{ message?: string }> {
  const res = await fetchApi("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to subscribe");
  }
  return (await res.json()) as { message?: string };
}

export async function unsubscribeFromNewsletter(email: string): Promise<{ message?: string }> {
  const res = await fetchApi("/newsletter/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "Failed to unsubscribe");
  }
  return (await res.json()) as { message?: string };
}
