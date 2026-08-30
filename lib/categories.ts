import { API_URL } from "@/lib/env";
import { mockCategories } from "@/lib/mock-data";
import { Category } from "@/types";

export async function fetchCategories(): Promise<{ data: Category[] }> {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load categories");
    return (await res.json()) as { data: Category[] };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[fetchCategories] API unavailable, falling back to mock data:", error);
      return { data: mockCategories };
    }
    throw error;
  }
}
