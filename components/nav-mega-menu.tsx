import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const occasions = ["Birthday", "Romance", "Sympathy", "Just Because", "Plants", "Luxury", "Same-Day", "New Arrivals"];

export function NavMegaMenu() {
  return (
    <div className="absolute left-1/2 top-[calc(100%+1rem)] w-[680px] -translate-x-1/2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-6 opacity-0 invisible translate-y-2 shadow-lg transition-all duration-200 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
      <div className="grid grid-cols-[1fr_1.2fr] gap-6">
        <div className="border-r border-outline-variant/50 pr-6">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-on-surface-variant">Shop by occasion</p>
          <div className="grid grid-cols-2 gap-1">
            {occasions.map((occasion) => <Link key={occasion} href={`/products?search=${encodeURIComponent(occasion)}`} className="rounded-md px-3 py-2.5 text-base text-on-surface transition-colors hover:bg-surface-container-low hover:text-primary">{occasion}</Link>)}
          </div>
        </div>
        <Link href="/products?search=Mother%27s%20Day" className="group/card relative min-h-52 overflow-hidden rounded-lg">
          <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTzcf4ikKWHoS6H1hC56Ygiv_8vsEBnJgN3630wOHVVyjbivyQsS_wNiu95eRgdf4b-cb0QrlnbTUZYphrPf4xXuYs2wnitVdFQKuF0JOB9QO2IeNbiaX3HBdXALFbfCvX8JUpopxQW64-WkyJ7QpfbKDPTZH0AGxTImeS2SywB2Vvg2CkcwGwttVTK5RWGfxWzP58dCmJ4mJh9pP9JtXyN9Ph5YQH6S8M5NQNo44CIgTYWQ55xbtx" alt="Mother's Day seasonal bouquet" fill unoptimized className="object-cover transition-transform duration-500 group-hover/card:scale-105" />
          <div className="absolute inset-x-5 bottom-5 rounded-md bg-surface/90 p-4 backdrop-blur-md">
            <span className="text-xs font-medium text-on-surface-variant">Spring Collection</span>
            <p className="font-serif text-2xl font-semibold text-on-surface">Mother&apos;s Day Specials</p>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">Shop the Collection <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-1" /></span>
          </div>
        </Link>
      </div>
    </div>
  );
}
