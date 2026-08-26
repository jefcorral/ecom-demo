import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";
import { fetchProduct } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id).catch(() => null);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} on Ecom Store. Price: $${product.price}`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} on Ecom Store. Price: $${product.price}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  unstable_noStore();
  const { id } = await params;
  const product = await fetchProduct(id).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
    </div>
  );
}
