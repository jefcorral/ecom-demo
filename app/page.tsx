"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Camera, Check, Flower2, Leaf, Palette, Star, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RatingStars } from "@/components/ui/rating-stars";
import { mockProducts } from "@/lib/mock-data";

const occasions = ["Birthday", "Romance", "Sympathy", "Anniversary", "Just Because", "New Baby", "Weddings", "Same-Day"];
const featured = mockProducts.slice(0, 8);
const trust = [
  { icon: Truck, title: "Next-Day Delivery", text: "Order by 2 PM for next-day arrival." },
  { icon: Flower2, title: "Farm Fresh", text: "Flowers selected by expert florists." },
  { icon: Leaf, title: "Satisfaction Guarantee", text: "Every bouquet arrives fresh and beautiful." },
  { icon: Palette, title: "Artisan Crafted", text: "Hand-arranged for every occasion." },
];
const testimonials = [
  { quote: "The bouquet was even more beautiful than the photos. Every detail felt thoughtful.", name: "Amelia R.", location: "Brooklyn, NY" },
  { quote: "Fresh, elegant, and delivered exactly when promised. My new favorite florist.", name: "Sofia M.", location: "Austin, TX" },
  { quote: "Bloom & Stem made our anniversary unforgettable. The presentation was exquisite.", name: "Daniel K.", location: "Portland, OR" },
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
      <section className="relative flex min-h-[620px] w-full items-center bg-surface-container md:min-h-[700px]">
        <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTzcf4ikKWHoS6H1hC56Ygiv_8vsEBnJgN3630wOHVVyjbivyQsS_wNiu95eRgdf4b-cb0QrlnbTUZYphrPf4xXuYs2wnitVdFQKuF0JOB9QO2IeNbiaX3HBdXALFbfCvX8JUpopxQW64-WkyJ7QpfbKDPTZH0AGxTImeS2SywB2Vvg2CkcwGwttVTK5RWGfxWzP58dCmJ4mJh9pP9JtXyN9Ph5YQH6S8M5NQNo44CIgTYWQ55xbtx" alt="Pastel seasonal bouquet arranged on a sunlit table" fill priority unoptimized sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/55 to-transparent md:from-surface/80 md:via-surface/25" />
        <div className="relative mx-auto flex w-full max-w-[1140px] items-end px-4 pb-12 pt-32 md:items-center md:px-6 md:py-24">
          <div className="w-full rounded-xl bg-surface-container-lowest/92 p-6 shadow-lg backdrop-blur-md md:max-w-md md:p-xl">
            <span className="mb-sm inline-flex rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold uppercase tracking-widest text-on-primary-fixed">Mother&apos;s Day Collection</span>
            <h1 className="mb-md font-serif text-4xl font-bold leading-[1.08] tracking-tight text-on-surface md:text-display-lg">Artisan Bouquets,<br />Delivered Fresh.</h1>
            <p className="mb-lg text-base leading-7 text-on-surface-variant md:text-lg">Express your deepest sentiments with hand-tied, ethically sourced seasonal arrangements.</p>
            <Button render={<Link href="/products" />} className="w-full md:w-auto">Shop Best Sellers <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      <section aria-label="Shop by occasion" className="border-b border-surface-variant bg-surface-container-low py-6 md:py-xl">
        <div className="mx-auto max-w-[1140px] overflow-x-auto px-4 md:px-6"><div className="flex min-w-max items-center gap-3 md:gap-md">{occasions.map((occasion) => <Link key={occasion} href={`/products?search=${encodeURIComponent(occasion)}`} className="flex h-11 items-center rounded-full border border-outline-variant/40 bg-surface-container px-5 text-sm font-medium text-on-surface shadow-sm transition hover:bg-primary hover:text-on-primary hover:shadow-md active:scale-95">{occasion}</Link>)}</div></div>
      </section>

      <section className="mx-auto w-full max-w-[1140px] px-4 py-16 md:px-6 md:py-24" aria-labelledby="favorites-title">
        <div className="mb-8 flex items-end justify-between md:mb-xl"><div><h2 id="favorites-title" className="font-serif text-3xl font-semibold text-on-surface">Seasonal Favorites</h2><p className="mt-1 text-on-surface-variant">Curated blooms reflecting the current season&apos;s best.</p></div><Link href="/products" className="hidden text-sm font-medium text-primary underline underline-offset-4 md:block">View All Favorites</Link></div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <Button render={<Link href="/products" />} variant="secondary" className="mt-6 w-full md:hidden">View All Arrangements</Button>
      </section>

      <section className="mx-auto grid max-w-[1140px] gap-5 px-4 pb-16 md:grid-cols-2 md:px-6 md:pb-24">
        <CollectionCard image="/product-detail/lifestyle.png" title="Weddings & Events" text="Bespoke floral designs for celebrations large and small." />
        <CollectionCard image="/product-detail/packaging.png" title="Corporate Gifting" text="Elevate your workplace and client relationships." />
      </section>

      <section className="bg-surface-container-low py-14 md:py-20">
        <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-6">{trust.map(({ icon: Icon, title, text }) => <div key={title} className="text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-on-primary transition hover:scale-110"><Icon className="h-5 w-5" /></span><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-on-surface-variant">{text}</p></div>)}</div>
      </section>

      <section className="mx-auto max-w-[980px] px-4 py-16 md:px-6 md:py-24" aria-labelledby="how-title">
        <div className="text-center"><h2 id="how-title" className="font-serif text-3xl font-semibold">How It Works</h2><p className="mt-2 text-on-surface-variant">Sending joy is simple.</p></div>
        <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-12 before:absolute before:left-[16.66%] before:right-[16.66%] before:top-6 before:hidden before:h-px before:bg-outline-variant md:before:block">{[["Choose Your Blooms", "Select from seasonal arrangements curated by our floral designers."], ["Add a Personal Touch", "Write a custom note and choose a delivery date."], ["We Hand-Deliver", "Your flowers arrive fresh, beautiful, and on time."]].map(([title, text], index) => <li key={title} className="relative flex gap-4 md:flex-col md:items-center md:text-center"><span className="z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-on-primary">{index + 1}</span><div><h3 className="font-serif text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p></div></li>)}</ol>
      </section>

      <section className="bg-surface-container-low py-16 md:py-24" aria-labelledby="testimonials-title">
        <div className="mx-auto max-w-[1140px] px-4 md:px-6"><h2 id="testimonials-title" className="text-center font-serif text-3xl font-semibold">What Our Customers Say</h2><div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:gap-6">{testimonials.map((testimonial) => <blockquote key={testimonial.name} className="w-[85%] shrink-0 snap-center rounded-lg bg-surface-container-lowest p-6 shadow-sm md:w-auto"><RatingStars value={5} /><p className="mt-4 font-serif text-lg leading-7">“{testimonial.quote}”</p><footer className="mt-5 text-sm"><strong>{testimonial.name}</strong><span className="ml-2 text-on-surface-variant">{testimonial.location}</span></footer></blockquote>)}</div></div>
      </section>

      <section className="bg-secondary-container py-16 md:py-20">
        <div className="mx-auto grid max-w-[1140px] gap-8 px-4 md:grid-cols-2 md:items-center md:px-6"><div><h2 className="font-serif text-3xl font-semibold text-on-secondary-container">Join the Bloom Club</h2><p className="mt-3 max-w-lg leading-7 text-on-secondary-container/80">Subscribe for 10% off your first order, seasonal flower care tips, and early access to new collections.</p></div>{subscribed ? <div role="status" className="flex items-center gap-3 rounded-full bg-surface-container-lowest px-6 py-4 text-on-surface"><Check className="h-5 w-5 text-primary" />You&apos;re on the list. Welcome to the club.</div> : <form onSubmit={subscribe}><label htmlFor="newsletter-email" className="sr-only">Email address</label><div className="flex flex-col gap-3 sm:flex-row"><Input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" /><Button type="submit" className="sm:min-w-36">Subscribe</Button></div></form>}</div>
      </section>

      <section className="mx-auto max-w-[1140px] px-4 py-16 md:px-6 md:py-24"><div className="mb-7 flex items-center justify-between"><h2 className="font-serif text-3xl font-semibold">@bloomandstem</h2><Camera className="h-6 w-6 text-primary" /></div><div className="grid grid-cols-3 gap-2 md:grid-cols-6">{mockProducts.slice(8, 14).map((product) => <Link key={product.id} href={`/products/${product.id}`} className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container-high">{product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill unoptimized sizes="(max-width: 768px) 33vw, 16vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}</Link>)}</div></section>
    </div>
  );
}

function CollectionCard({ image, title, text }: { image: string; title: string; text: string }) {
  return <Link href="/products" className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md"><Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white transition-transform group-hover:-translate-y-1"><h2 className="font-serif text-2xl font-semibold">{title}</h2><p className="mt-2 text-sm text-white/85">{text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">Explore Services <ArrowRight className="h-4 w-4" /></span></div></Link>;
}
