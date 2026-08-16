import { Suspense } from "react";
import { unstable_noStore } from "next/cache";
import { fetchProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

async function ProductGrid() {
  unstable_noStore();
  const products = await fetchProducts({ limit: 12 })
    .then((res) => res.data)
    .catch(() => null);

  if (products === null) {
    return (
      <p className="text-center text-muted-foreground">
        Could not load products. Make sure the API is running.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10 rounded-2xl bg-muted px-6 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Welcome to Ecom Store</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A modern storefront built with Next.js and shadcn/ui.
        </p>
      </section>
      <h2 className="mb-6 text-2xl font-semibold">Featured Products</h2>
      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        }
      >
        <ProductGrid />
      </Suspense>
    </div>
  );
}
