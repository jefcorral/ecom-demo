import { AlertTriangle, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function StaffSkeleton() {
  return <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10" aria-label="Loading staff directory" aria-busy="true">
    <div className="flex justify-between"><div className="space-y-3"><Skeleton className="h-10 w-56" /><Skeleton className="h-5 w-80" /></div><Skeleton className="hidden h-12 w-36 rounded-full sm:block" /></div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)}</div>
    <div className="flex justify-between"><Skeleton className="h-12 w-80 rounded-full" /><Skeleton className="h-12 w-64 rounded-full" /></div>
    <div className="overflow-hidden rounded-2xl bg-surface-container-lowest">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="flex items-center gap-5 border-b border-outline-variant/30 p-5"><Skeleton className="h-11 w-11 rounded-full" /><Skeleton className="h-5 w-44" /><Skeleton className="h-5 w-48" /><Skeleton className="ml-auto h-8 w-28 rounded-full" /></div>)}</div>
  </div>;
}

export function StaffError({ onRetry }: { onRetry: () => void }) {
  return <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center"><div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-error-container text-error"><AlertTriangle className="h-9 w-9" /></div><h1 className="font-serif text-3xl">Could not load staff directory</h1><p className="mt-2 text-on-surface-variant">A network issue prevented us from retrieving staff members and permission records. Existing access rights remain active.</p><Button onClick={onRetry} className="mt-6 min-h-11 rounded-full px-6">Retry connection</Button></div>;
}

export function StaffEmpty({ onInvite }: { onInvite: () => void }) {
  return <div className="rounded-2xl bg-surface-container-lowest px-5 py-16 text-center shadow-sm"><div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-secondary-container text-secondary"><UsersRound className="h-10 w-10" /></div><p className="text-xs font-medium uppercase tracking-widest text-secondary">Seats: 0/12</p><h2 className="mt-3 font-serif text-3xl">No staff yet</h2><p className="mx-auto mt-2 max-w-xl text-on-surface-variant">Invite florists, fulfillment artisans, and support specialists to curate and manage your botanical boutique together.</p><Button onClick={onInvite} className="mt-6 min-h-12 rounded-full px-8">Invite First Staff Member</Button></div>;
}
