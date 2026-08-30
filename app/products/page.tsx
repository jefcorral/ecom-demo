import { fetchCategories } from "@/lib/categories";
import { ProductCatalog } from "@/components/product-catalog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Flowers",
  description: "Browse our curated collection of artisanal floral arrangements, plants, and gifts.",
};

export default async function ProductsPage() {
  const categories = await fetchCategories().then((res) => res.data).catch(() => []);

  return <ProductCatalog categories={categories} />;
}
