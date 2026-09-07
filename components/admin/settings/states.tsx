import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10" aria-label="Loading store settings" aria-busy="true"><div className="space-y-3"><Skeleton className="h-10 w-52" /><Skeleton className="h-5 w-96 max-w-full" /></div><div className="grid gap-6 lg:grid-cols-[220px_1fr]"><Skeleton className="hidden h-96 rounded-2xl lg:block" /><div className="space-y-6"><Skeleton className="h-80 rounded-2xl" /><Skeleton className="h-[520px] rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div></div>;
}

export function SettingsError({ onRetry }: { onRetry: () => void }) {
  return <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center"><div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-error-container text-error"><AlertTriangle className="h-9 w-9" /></div><h1 className="font-serif text-3xl">Could not load settings</h1><p className="mt-2 text-on-surface-variant">The studio configuration service is unavailable. Your currently published settings remain active.</p><Button onClick={onRetry} className="mt-6 min-h-11 rounded-full px-6">Retry connection</Button></div>;
}
