"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ChevronDown, ChevronRight, CircleHelp, Flower2, Heart, Mail, MapPin, Package, Phone, Search, ShoppingBag, Sparkles, Store, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { RecentSearchChips } from "@/components/recent-search-chips";
import { saveRecentSearch } from "@/lib/search";
const occasions = ["Birthday", "Romance", "Sympathy", "Plants", "Gifts", "Just Because", "Weddings & Events"];
const children = ["Classic Bouquets", "Luxury Arrangements", "Same-Day Ready", "Best Sellers"];
const quickLinks = [
  { label: "Shop All", href: "/products", icon: Store },
  { label: "New Arrivals", href: "/products?sort=newest", icon: Sparkles },
  { label: "Best Sellers", href: "/products?sort=featured", icon: Flower2 },
  { label: "Plants", href: "/products?categoryId=plants", icon: Flower2 },
  { label: "Gifts", href: "/products?categoryId=gifts", icon: ShoppingBag },
];

export function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string>();
  const [zip, setZip] = useState("");
  const [zipMessage, setZipMessage] = useState("");

  function search(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <SheetContent side="left" showCloseButton={false} className="w-[85vw] max-w-[360px] gap-0 border-0 bg-surface-container-low p-0 shadow-lg">
      <SheetHeader className="border-b border-outline-variant/50 px-4 pb-4 pt-3">
        <div className="flex items-center justify-between">
          <SheetClose render={<Button variant="ghost" size="icon" aria-label="Close navigation menu" />}><X className="h-5 w-5" /></SheetClose>
          <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-on-surface"><Flower2 className="h-5 w-5 text-primary" />Bloom &amp; Stem</Link>
        </div>
        <SheetTitle className="mt-4 font-serif text-2xl font-semibold leading-8 text-on-surface">Hi there, what are you shopping for today?</SheetTitle>
        <SheetDescription className="sr-only">Browse products, occasions, account actions, and store utilities.</SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <form onSubmit={search} className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bouquets, plants..." className="h-12 w-full rounded-full border border-transparent bg-surface-container-high pl-12 pr-11 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25" />
          {query && <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full" aria-label="Clear search"><X className="h-4 w-4" /></button>}
        </form>
        <div className="mt-6"><RecentSearchChips onSelect={(term) => { saveRecentSearch(term); router.push(`/search?q=${encodeURIComponent(term)}`); }} showClear={false} /></div>
        <Link href="/products?search=Mother%27s%20Day" className="mt-6 flex overflow-hidden rounded-lg bg-secondary-container shadow-sm">
          <div className="relative w-24 shrink-0"><Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTzcf4ikKWHoS6H1hC56Ygiv_8vsEBnJgN3630wOHVVyjbivyQsS_wNiu95eRgdf4b-cb0QrlnbTUZYphrPf4xXuYs2wnitVdFQKuF0JOB9QO2IeNbiaX3HBdXALFbfCvX8JUpopxQW64-WkyJ7QpfbKDPTZH0AGxTImeS2SywB2Vvg2CkcwGwttVTK5RWGfxWzP58dCmJ4mJh9pP9JtXyN9Ph5YQH6S8M5NQNo44CIgTYWQ55xbtx" alt="Seasonal bouquet" fill unoptimized className="object-cover" /></div>
          <div className="p-4"><p className="font-serif text-lg font-semibold">Mother&apos;s Day Collection</p><p className="mt-1 text-xs text-on-surface-variant">Hand-tied bouquets delivered fresh.</p><span className="mt-2 inline-block text-xs font-semibold text-primary">Shop Now</span></div>
        </Link>
        <MenuLabel>Shop by occasion</MenuLabel>
        <div className="divide-y divide-outline-variant/50">{occasions.map((occasion) => <div key={occasion}><button onClick={() => setExpanded(expanded === occasion ? undefined : occasion)} className="flex min-h-12 w-full items-center justify-between py-3 text-left text-base"><span>{occasion}</span><ChevronDown className={cn("h-4 w-4 text-primary transition-transform", expanded === occasion && "rotate-180")} /></button>{expanded === occasion && <div className="space-y-1 pb-3 pl-6">{children.map((child) => <Link key={child} href={`/products?search=${encodeURIComponent(`${occasion} ${child}`)}`} className="block rounded-md px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container">{child}</Link>)}</div>}</div>)}</div>
        <MenuLabel>Quick links</MenuLabel>
        <div>{quickLinks.map(({ label, href, icon: Icon }) => <Link key={label} href={href} className="flex min-h-12 items-center gap-3 rounded-md px-2 text-sm font-medium hover:bg-surface-container"><Icon className="h-5 w-5 text-primary" /><span className="flex-1">{label}</span><ChevronRight className="h-4 w-4 text-on-surface-variant" /></Link>)}</div>
        <MenuLabel>Check delivery</MenuLabel>
        <p className="mb-3 text-sm text-on-surface-variant">Enter your ZIP code to see same-day availability.</p>
        <form onSubmit={(event) => { event.preventDefault(); if (zip.trim()) setZipMessage("Great! Same-day delivery is available in your area."); }} className="flex gap-2"><input value={zip} onChange={(event) => setZip(event.target.value)} inputMode="numeric" placeholder="ZIP code" className="h-11 min-w-0 flex-1 rounded-full bg-surface-container-high px-4 outline-none focus:ring-2 focus:ring-primary/30" /><Button type="submit" size="sm">Check</Button></form>
        {zipMessage && <p role="status" className="mt-2 text-xs font-medium text-primary">{zipMessage}</p>}
        <MenuLabel>Your favorites</MenuLabel>
        <div className="rounded-lg bg-surface-container-lowest p-4 text-sm text-on-surface-variant"><Heart className="mb-2 h-5 w-5 text-primary" />Save bouquets you love for quick access later. <Link href="/products?sort=featured" className="mt-2 block font-semibold text-primary">Browse Best Sellers</Link></div>
        <Link href={isLoggedIn ? "/account" : "/login"} className={cn(buttonVariants({ className: "mt-6 w-full" }))}>{isLoggedIn ? "My Account" : "Sign In / Register"}</Link>
      </div>
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 border-t border-outline-variant bg-surface-container-low px-1 pb-safe">
        <UtilityLink href="/track-order" icon={Package} label="Track" /><UtilityLink href="/help" icon={CircleHelp} label="Help" /><UtilityLink href="/contact" icon={Mail} label="Contact" /><UtilityLink href="tel:+18005550199" icon={Phone} label="Call" />
      </div>
    </SheetContent>
  );
}

function MenuLabel({ children }: { children: React.ReactNode }) { return <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">{children}</p>; }
function UtilityLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) { return <Link href={href} className="flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-medium text-on-surface-variant active:scale-95"><Icon className="h-4 w-4 text-primary" />{label}</Link>; }
