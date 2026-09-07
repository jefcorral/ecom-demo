import { AlertTriangle, FileUp, PackageOpen, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function InventorySkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10" aria-label="Loading inventory" aria-busy="true">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-36 rounded-full" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <div className="flex gap-3 overflow-hidden rounded-2xl bg-surface-container-lowest p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-28 rounded-full" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-5 border-b border-outline-variant/30 p-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-5 w-52" />
              <Skeleton className="ml-auto h-5 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="hidden h-96 rounded-2xl lg:block" />
      </div>
    </div>
  );
}

function State({
  kind,
  onAdd,
  onImport,
}: {
  kind: "empty" | "no-results";
  onAdd: () => void;
  onImport: () => void;
}) {
  const empty = kind === "empty";
  const Icon = empty ? PackageOpen : SearchX;
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <Icon className="h-9 w-9 text-primary" />
      </div>
      <h1 className="font-serif text-3xl text-on-surface">{empty ? "No inventory data found" : "No inventory matches"}</h1>
      <p className="mt-2 text-on-surface-variant">
        {empty
          ? "Import your initial stock list or add your first product to begin tracking."
          : "Try another search or clear your filters to see the full inventory."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onImport} variant="outline" className="min-h-11 rounded-full px-6">
          <FileUp className="h-4 w-4" />
          Import CSV
        </Button>
        <Button onClick={onAdd} className="min-h-11 rounded-full px-6">
          Add Product
        </Button>
      </div>
    </div>
  );
}

export function InventoryEmpty({ onAdd, onImport }: { onAdd: () => void; onImport: () => void }) {
  return <State kind="empty" onAdd={onAdd} onImport={onImport} />;
}

export function InventoryNoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <SearchX className="h-9 w-9 text-primary" />
      </div>
      <h1 className="font-serif text-3xl text-on-surface">No inventory matches</h1>
      <p className="mt-2 text-on-surface-variant">Try another search or clear your filters to see the full inventory.</p>
      <Button onClick={onClear} className="mt-6 min-h-11 rounded-full px-6">
        Clear search and filters
      </Button>
    </div>
  );
}

export function InventoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <AlertTriangle className="mb-5 h-12 w-12 text-error" />
      <h1 className="font-serif text-3xl">We couldn’t load inventory</h1>
      <p className="mt-2 text-on-surface-variant">The inventory service is unavailable. Please try again.</p>
      <Button onClick={onRetry} className="mt-6 min-h-11 rounded-full px-6">
        Try again
      </Button>
    </div>
  );
}
