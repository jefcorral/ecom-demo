import { AlertTriangle, PackageOpen, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsSkeleton() {
  return <div className="mx-auto max-w-[1440px] space-y-8 px-5 py-6 lg:px-16 lg:py-10" aria-label="Loading products" aria-busy="true"><div className="flex justify-between"><div className="space-y-3"><Skeleton className="h-10 w-56"/><Skeleton className="h-5 w-80"/></div><Skeleton className="h-12 w-36 rounded-full"/></div><Skeleton className="h-16 w-full rounded-2xl"/><div className="overflow-hidden rounded-2xl bg-surface-container-lowest">{Array.from({length:6}).map((_,i)=><div key={i} className="flex items-center gap-5 border-b border-outline-variant/30 p-4"><Skeleton className="h-5 w-5"/><Skeleton className="h-16 w-12 rounded-lg"/><Skeleton className="h-5 w-52"/><Skeleton className="ml-auto h-5 w-24"/></div>)}</div></div>;
}

function State({kind,onAction}:{kind:"empty"|"no-results";onAction:()=>void}) {
  const empty=kind==="empty";
  const Icon=empty?PackageOpen:SearchX;
  return <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center"><div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container"><Icon className="h-9 w-9 text-primary"/></div><h1 className="font-serif text-3xl text-on-surface">{empty?"Your product garden is ready":"No products found"}</h1><p className="mt-2 text-on-surface-variant">{empty?"Add your first product to begin managing inventory, pricing, and availability.":"Try another search or clear your filters to see the full catalog."}</p><Button onClick={onAction} className="mt-6 min-h-11 rounded-full px-6">{empty?"Add Product":"Clear search and filters"}</Button></div>;
}
export function ProductsEmpty({onAction}:{onAction:()=>void}) {return <State kind="empty" onAction={onAction}/>}
export function ProductsNoResults({onAction}:{onAction:()=>void}) {return <State kind="no-results" onAction={onAction}/>}

export function ProductsError({onRetry}:{onRetry:()=>void}) {return <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center"><AlertTriangle className="mb-5 h-12 w-12 text-error"/><h1 className="font-serif text-3xl">We couldn’t load products</h1><p className="mt-2 text-on-surface-variant">The inventory service is unavailable. Please try again.</p><Button onClick={onRetry} className="mt-6 min-h-11 rounded-full px-6">Try again</Button></div>}
