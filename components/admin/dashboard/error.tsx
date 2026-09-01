"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-16 lg:py-10">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-error/20 bg-error-container/30 p-4 sm:flex-row lg:mb-10 lg:p-6">
        <div className="flex items-center gap-3 text-error">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-base text-on-surface">
            Unable to refresh latest metrics. Please try again.
          </span>
        </div>
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2 rounded-full border-error/30 bg-surface-container text-error hover:bg-error-container hover:text-error"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Dashboard
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-lowest py-20 text-center">
        <p className="text-lg text-on-surface-variant">
          Something went wrong while loading your dashboard.
        </p>
        <Button
          onClick={onRetry}
          className="mt-6 gap-2 rounded-full bg-primary px-8 py-5 text-on-primary"
        >
          <RefreshCw className="h-5 w-5" />
          Try again
        </Button>
      </div>
    </div>
  );
}
