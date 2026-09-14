import { Droplets, Leaf, Recycle, ShieldCheck, Truck } from "lucide-react";
import { SUSTAINABILITY_PILLARS } from "@/lib/about-data";

export function SustainabilityCommitments() {
  const icons = [Leaf, Droplets, Recycle, Truck];

  return (
    <section id="sustainability" aria-labelledby="sustainability-heading" className="py-12 md:py-16 border-t border-outline-variant/30 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5 mb-1.5">
            <ShieldCheck className="size-3.5" /> Ecological Stewardship
          </span>
          <h2 id="sustainability-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
            Our Sustainability Commitments
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant max-w-xl">
            Floristry should nourish the earth, not pollute it. We hold ourselves to the highest environmental standards in the industry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUSTAINABILITY_PILLARS.map((pillar, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={pillar.id}
              className="flex flex-col justify-between p-6 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs space-y-4 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-serif text-lg font-bold text-primary">
                    {pillar.metric}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-semibold text-on-surface">
                  {pillar.title}
                </h3>
                <p className="text-xs font-medium text-on-surface">
                  {pillar.description}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {pillar.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sustainable Pledge Banner */}
      <div className="rounded-3xl bg-[#2c3e2a] text-[#fbf9f4] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-[#f9bd14] font-semibold">
            The Bloom &amp; Stem Eco-Pledge
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold">
            Zero Floral Foam. Zero Toxic Dyes. 100% Compostable.
          </h3>
          <p className="text-xs sm:text-sm text-white/75 max-w-xl">
            Every bouquet you order can be returned entirely to the earth without introducing synthetic microplastics or chemical preservatives into municipal waterways.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
            Certified Slow Flowers Member
          </span>
        </div>
      </div>
    </section>
  );
}
