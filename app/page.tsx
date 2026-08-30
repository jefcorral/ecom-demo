"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Flower2, Leaf, Palette, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/lib/mock-data";

const occasions = ["Mother's Day", "Birthday", "Anniversary", "Sympathy", "Just Because", "Romance", "New Baby", "Weddings", "Same-Day"];
const featured = mockProducts.slice(0, 8);
const trust = [
  { icon: Truck, title: "Next-Day Delivery", text: "Order by 2 PM for next-day arrival." },
  { icon: Flower2, title: "Farm Fresh", text: "Flowers selected by expert florists." },
  { icon: Leaf, title: "Satisfaction Guarantee", text: "Every bouquet arrives fresh and beautiful." },
  { icon: Palette, title: "Artisan Crafted", text: "Hand-arranged for every occasion." },
];
export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function subscribe(event: React.FormEvent) {
    event.preventDefault();
    setSubscribed(true);
    setEmail("");
  }

  return (
    <div className="overflow-hidden">
      <section className="relative flex h-[90vh] min-h-[600px] w-full flex-col justify-end bg-surface-container pb-2xl md:h-[700px] md:items-center md:justify-center md:pb-0">
        <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTzcf4ikKWHoS6H1hC56Ygiv_8vsEBnJgN3630wOHVVyjbivyQsS_wNiu95eRgdf4b-cb0QrlnbTUZYphrPf4xXuYs2wnitVdFQKuF0JOB9QO2IeNbiaX3HBdXALFbfCvX8JUpopxQW64-WkyJ7QpfbKDPTZH0AGxTImeS2SywB2Vvg2CkcwGwttVTK5RWGfxWzP58dCmJ4mJh9pP9JtXyN9Ph5YQH6S8M5NQNo44CIgTYWQ55xbtx" alt="Pastel seasonal bouquet arranged on a sunlit table" fill priority unoptimized sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent md:bg-gradient-to-r md:from-surface/90 md:via-surface/50" />
        <div className="relative z-10 mx-auto w-full max-w-[1140px] px-md md:px-gutter">
          <div className="flex w-full flex-col gap-md md:max-w-md md:rounded-xl md:bg-surface-container-lowest/95 md:p-xl md:shadow-lg md:backdrop-blur-md">
            <span className="inline-flex w-fit items-center gap-xs rounded-full bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-semibold text-on-surface shadow-sm backdrop-blur-md md:mb-sm md:bg-transparent md:p-0 md:uppercase md:tracking-widest md:text-primary md:shadow-none"><Flower2 className="h-4 w-4 text-primary md:hidden" /><span className="md:hidden">Spring Collection 2024</span><span className="hidden md:inline">Mother&apos;s Day Collection</span></span>
            <h1 className="font-serif text-display-lg font-bold leading-[1.08] tracking-tight text-on-surface">Artisan Bouquets,<br className="hidden md:block" /> Delivered Fresh.</h1>
            <p className="max-w-[90%] text-lg leading-7 text-on-surface-variant md:mb-lg md:max-w-none">Curated arrangements crafted with care, bringing the beauty of the season into your home.</p>
            <Button render={<Link href="/products" />} className="mt-sm w-full md:mt-0 md:w-auto md:self-start"><span className="md:hidden">Shop Now</span><span className="hidden md:inline">Shop Best Sellers</span><ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      <section aria-label="Shop by occasion" className="border-b border-surface-variant bg-surface-container-low py-6 md:py-xl">
        <div className="mx-auto max-w-[1140px] overflow-x-auto px-4 md:px-6"><div className="flex min-w-max items-center gap-3 md:gap-md">{occasions.map((occasion, index) => <Link key={occasion} href={`/products?search=${encodeURIComponent(occasion)}`} className={`flex h-11 shrink-0 snap-start items-center rounded-full border px-5 text-sm font-medium shadow-sm transition active:scale-95 ${index === 0 ? "border-transparent bg-primary-container text-on-primary-container" : "border-outline-variant bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container"}`}>{occasion}</Link>)}</div></div>
      </section>

      <section className="mx-auto w-full max-w-[1140px] px-4 py-16 md:px-6 md:py-24" aria-labelledby="favorites-title">
        <div className="mb-8 flex items-end justify-between md:mb-xl"><div><h2 id="favorites-title" className="font-serif text-3xl font-semibold text-on-surface">Seasonal Favorites</h2><p className="mt-1 text-on-surface-variant">Curated blooms reflecting the current season&apos;s best.</p></div><Link href="/products" className="hidden text-sm font-medium text-primary underline underline-offset-4 md:block">View All Favorites</Link></div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">{featured.map((product, index) => <HomeProductCard key={product.id} product={product} className={index >= 4 ? "lg:hidden" : ""} />)}</div>
        <Button render={<Link href="/products" />} variant="secondary" className="mt-6 w-full md:hidden">View All Arrangements</Button>
      </section>

      <section className="mx-auto grid max-w-[1140px] gap-5 px-4 pb-16 md:hidden">
        <CollectionCard image="/product-detail/lifestyle.png" title="Weddings & Events" text="Bespoke floral designs for celebrations large and small." />
        <CollectionCard image="/product-detail/packaging.png" title="Corporate Gifting" text="Elevate your workplace and client relationships." />
      </section>

      <section className="bg-surface-container-low py-14 md:hidden">
        <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-6">{trust.map(({ icon: Icon, title, text }) => <div key={title} className="text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-on-primary transition hover:scale-110"><Icon className="h-5 w-5" /></span><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-on-surface-variant">{text}</p></div>)}</div>
      </section>

      <section className="mx-auto max-w-[980px] px-4 py-16 md:hidden" aria-labelledby="how-title">
        <div className="text-center"><h2 id="how-title" className="font-serif text-3xl font-semibold">How It Works</h2><p className="mt-2 text-on-surface-variant">Sending joy is simple.</p></div>
        <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-12 before:absolute before:left-[16.66%] before:right-[16.66%] before:top-6 before:hidden before:h-px before:bg-outline-variant md:before:block">{[["Choose Your Blooms", "Select from seasonal arrangements curated by our floral designers."], ["Add a Personal Touch", "Write a custom note and choose a delivery date."], ["We Hand-Deliver", "Your flowers arrive fresh, beautiful, and on time."]].map(([title, text], index) => <li key={title} className="relative flex gap-4 md:flex-col md:items-center md:text-center"><span className="z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-on-primary">{index + 1}</span><div><h3 className="font-serif text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p></div></li>)}</ol>
      </section>

      <section className="bg-secondary-container py-16 md:hidden">
        <div className="mx-auto grid max-w-[1140px] gap-8 px-4 md:grid-cols-2 md:items-center md:px-6"><div><h2 className="font-serif text-3xl font-semibold text-on-secondary-container">Join the Bloom Club</h2><p className="mt-3 max-w-lg leading-7 text-on-secondary-container/80">Subscribe for 10% off your first order, seasonal flower care tips, and early access to new collections.</p></div>{subscribed ? <div role="status" className="flex items-center gap-3 rounded-full bg-surface-container-lowest px-6 py-4 text-on-surface"><Check className="h-5 w-5 text-primary" />You&apos;re on the list. Welcome to the club.</div> : <form onSubmit={subscribe}><label htmlFor="newsletter-email" className="sr-only">Email address</label><div className="flex flex-col gap-3 sm:flex-row"><Input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" /><Button type="submit" className="sm:min-w-36">Subscribe</Button></div></form>}</div>
      </section>

    </div>
  );
}

function HomeProductCard({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <Link href={`/products/${product.id}`} className={`group flex flex-col gap-sm transition-transform active:scale-[0.98] lg:overflow-hidden lg:rounded-xl lg:bg-surface-container-lowest lg:shadow-sm lg:hover:shadow-lg ${className}`}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-container shadow-sm lg:rounded-none">
        {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill unoptimized sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
        {product.sameDayDelivery && <span className="absolute left-2 top-2 rounded-full bg-secondary-container px-2 py-1 text-[10px] text-on-secondary-container">Same-Day Delivery</span>}
        <span className="absolute bottom-2 right-2 hidden size-10 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface-variant shadow-sm group-hover:flex"><ShoppingBag className="h-4 w-4" /></span>
      </div>
      <div className="flex flex-col gap-1 px-1 lg:flex-1 lg:p-md">
        <h3 className="truncate text-sm font-medium text-on-surface lg:font-serif lg:text-xl lg:font-semibold">{product.name}</h3>
        <p className="hidden text-sm text-on-surface-variant lg:mb-md lg:line-clamp-2">{product.description}</p>
        <span className="text-base text-on-surface-variant lg:mt-auto lg:font-semibold lg:text-on-surface">${Number(product.salePrice ?? product.price).toFixed(0)}</span>
      </div>
    </Link>
  );
}

function CollectionCard({ image, title, text }: { image: string; title: string; text: string }) {
  return <Link href="/products" className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md"><Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white transition-transform group-hover:-translate-y-1"><h2 className="font-serif text-2xl font-semibold">{title}</h2><p className="mt-2 text-sm text-white/85">{text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">Explore Services <ArrowRight className="h-4 w-4" /></span></div></Link>;
}
