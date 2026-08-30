import { API_URL } from "@/lib/env";
import { Category } from "@/types";

export async function fetchCategories(): Promise<{ data: Category[] }> {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load categories");
  return (await res.json()) as { data: Category[] };
}
