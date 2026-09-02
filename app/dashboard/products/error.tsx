"use client";

import { ProductsError } from "@/components/admin/products/states";

export default function Error({ reset }: { reset: () => void }) {
  return <ProductsError onRetry={reset} />;
}
