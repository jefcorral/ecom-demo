import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { mockProducts } from "@/lib/mock-data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = mockProducts.find((item) => item.id === id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  return {
    title: product.name,
    description: product.description || `Discover ${product.name} from Bloom & Stem.`,
    openGraph: {
      title: product.name,
      description: product.description || `Discover ${product.name} from Bloom & Stem.`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = mockProducts.find((item) => item.id === id);

  if (!product) notFound();

  const relatedProducts = mockProducts
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, 4);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
