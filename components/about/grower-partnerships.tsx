import Image from "next/image";
import { CheckCircle2, MapPin, Sprout } from "lucide-react";
import { GROWER_PARTNERSHIPS } from "@/lib/about-data";

export function GrowerPartnerships() {
  return (
    <section aria-labelledby="growers-heading" className="py-12 md:py-16 border-t border-outline-variant/30 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5 mb-1.5">
          <Sprout className="size-3.5" /> Direct From Soil
        </span>
        <h2 id="growers-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
          Pacific Northwest Grower Partnerships
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant max-w-2xl">
          We bypass overseas industrial monoculture in favor of dedicated family growers across the Willamette Valley and Columbia River Gorge. Stems are harvested hours before reaching our studio worktables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GROWER_PARTNERSHIPS.map((farm) => (
          <div
            key={farm.id}
            className="flex flex-col rounded-3xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
              <Image
                src={farm.imageUrl}
                alt={farm.farmName}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <span className="absolute top-3 right-3 rounded-full bg-[#1b1c19]/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono font-medium text-white border border-white/20 flex items-center gap-1">
                <MapPin className="size-3 text-primary" /> {farm.distance}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {farm.location}
                </p>
                <h3 className="font-serif text-lg font-semibold text-on-surface leading-snug">
                  {farm.farmName}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {farm.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-outline-variant/30 text-xs">
                <p className="font-medium text-on-surface">
                  <span className="text-on-surface-variant">Signature Blooms:</span> {farm.specialty}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {farm.practices.map((practice) => (
                    <span
                      key={practice}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-0.5 text-[10px] font-medium text-on-surface-variant"
                    >
                      <CheckCircle2 className="size-3 text-primary" /> {practice}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
