import type { Metadata } from "next";
import { ProductEditor } from "@/components/admin/products/editor";

export const metadata: Metadata = {
  title: "New Product",
};

export default function NewProductPage() {
  return <ProductEditor mode="create" />;
}
