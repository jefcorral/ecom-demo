import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-title" className="relative overflow-hidden pt-4 pb-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" /> Est. 2018 • Portland, OR
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container border border-outline-variant/40 px-3 py-1 text-xs font-medium text-on-surface-variant">
              <Flower2 className="size-3.5 text-primary" /> Slow Flower Atelier
            </span>
          </div>

          <h1 id="about-hero-title" className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.15]">
            Artisanal Florals, Rooted in the Pacific Northwest.
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl font-sans">
            We believe flowers should evoke the untamed poetry of the seasons. From morning harvests in the Willamette Valley to hand-tied bouquets in our Portland studio, Bloom &amp; Stem crafts living art with zero floral foam and boundless care.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button render={<Link href="/products" />} size="lg" className="h-14 px-8 text-base">
              Explore Our Bouquets <ArrowRight className="size-4 ml-2" />
            </Button>
            <Button render={<Link href="#studio-hours" />} variant="outline" size="lg" className="h-14 px-7 text-base">
              <MapPin className="size-4 mr-2 text-primary" /> Visit The Studio
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/30 text-center sm:text-left">
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">100%</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">Foam-Free</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">85%+</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">PNW Sourced</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">Same-Day</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">Portland Delivery</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl border border-outline-variant/30">
            <Image
              src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1000&q=80"
              alt="Florist arranging a seasonal bouquet at the Bloom and Stem sunlit workbench"
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c19]/80 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 inset-x-6 text-white space-y-1 backdrop-blur-xs bg-black/25 p-4 rounded-2xl border border-white/15">
              <span className="text-[11px] uppercase tracking-widest text-[#f2b705] font-semibold block">
                Atelier No. 128
              </span>
              <p className="font-serif text-lg font-semibold text-white">
                Hand-conditioned every morning at dawn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
