import { API_URL } from "@/lib/env";
import { mockProducts } from "@/lib/mock-data";
import { Product, ProductsResponse } from "@/types";

function filterAndPaginateProducts(
  products: Product[],
  params?: { page?: number; limit?: number; categoryId?: string; search?: string }
): ProductsResponse {
  let data = products.filter((p) => p.isActive);

  if (params?.categoryId) {
    data = data.filter((p) => p.categoryId === params.categoryId);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.category?.name ?? "").toLowerCase().includes(q)
    );
  }

  const limit = Math.max(1, params?.limit ?? 20);
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const page = Math.max(1, Math.min(params?.page ?? 1, totalPages || 1));
  const start = (page - 1) * limit;
  const paginated = data.slice(start, start + limit);

  return {
    data: paginated,
    pagination: { page, limit, total, totalPages },
  };
}

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

  try {
    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load products");
    return (await res.json()) as ProductsResponse;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[fetchProducts] API unavailable, falling back to mock data:", error);
      return filterAndPaginateProducts(mockProducts, params);
    }
    throw error;
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load product");
    return (await res.json()) as Product;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const product = mockProducts.find((p) => p.id === id);
      if (product) return product;
    }
    throw error;
  }
}
