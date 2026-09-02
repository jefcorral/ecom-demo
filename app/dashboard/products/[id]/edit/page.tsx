import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAdminProductById } from "@/lib/admin-products";
import { ProductEditor } from "@/components/admin/products/editor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchAdminProductById(id);
  return {
    title: product ? `Edit ${product.name}` : "Edit Product",
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchAdminProductById(id);
  if (!product) notFound();
  return <ProductEditor product={product} mode="edit" />;
}
