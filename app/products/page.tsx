import { Suspense } from "react";
import { unstable_noStore } from "next/cache";
import { fetchProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our wide selection of products and find exactly what you need at the best prices.",
};

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; categoryId?: string }>;
}

async function ProductList({ search, categoryId }: { search?: string; categoryId?: string }) {
  unstable_noStore();
  const products = await fetchProducts({ search, categoryId, limit: 24 })
    .then((res) => res.data)
    .catch(() => null);

  if (products === null) {
    return (
      <p className="text-center text-muted-foreground">
        Could not load products. Make sure the API is running.
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground">No products found.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search, categoryId } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>
      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        }
      >
        <ProductList search={search} categoryId={categoryId} />
      </Suspense>
    </div>
  );
}
