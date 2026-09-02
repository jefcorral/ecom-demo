import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types";

export type ProductMutation = "update" | "duplicate" | "archive" | "availability";

export async function fetchAdminProducts(): Promise<Product[]> {
  return mockProducts.slice(0, 24);
}

export async function mutateAdminProducts(_action: ProductMutation): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
}
