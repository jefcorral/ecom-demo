"use client";

import { useEffect, useState } from "react";
import { ProductsContent } from "@/components/admin/products/content";
import { ProductsError, ProductsSkeleton } from "@/components/admin/products/states";
import { fetchAdminProducts } from "@/lib/admin-products";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const load = () => {
    setError(false);
    setProducts(null);
    fetchAdminProducts().then(setProducts).catch(() => setError(true));
  };
  useEffect(() => {
    fetchAdminProducts().then(setProducts).catch(() => setError(true));
  }, []);
  if (error) return <ProductsError onRetry={load} />;
  if (!products) return <ProductsSkeleton />;
  return <ProductsContent initialProducts={products} />;
}
