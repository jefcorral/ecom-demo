"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function OrderDetailError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Order detail error:", error);
  }, [error]);

  return <ErrorState onRetry={reset} />;
}
