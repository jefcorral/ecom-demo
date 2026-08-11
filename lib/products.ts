import { API_URL } from "@/lib/env";
import { Product, ProductsResponse } from "@/types";

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.search) searchParams.set("search", params.search);
  const res = await fetch(`${API_URL}/products?${searchParams.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load products");
  return (await res.json()) as ProductsResponse;
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load product");
  return (await res.json()) as Product;
}
