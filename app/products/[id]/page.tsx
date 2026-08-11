import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";
import { fetchProduct } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  unstable_noStore();
  const { id } = await params;
  try {
    const product = await fetchProduct(id);
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
      </div>
    );
  } catch {
    notFound();
  }
}
