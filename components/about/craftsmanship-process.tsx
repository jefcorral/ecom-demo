import { Scissors } from "lucide-react";
import { CRAFTSMANSHIP_STEPS } from "@/lib/about-data";

export function CraftsmanshipProcess() {
  return (
    <section aria-labelledby="craftsmanship-heading" className="py-12 md:py-16 border-t border-outline-variant/30 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5 mb-1.5">
          <Scissors className="size-3.5" /> The Atelier Method
        </span>
        <h2 id="craftsmanship-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
          Our Craftsmanship Process
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant max-w-2xl">
          From first dawn cut in the Willamette Valley to the moment your recipient opens their door, every arrangement moves through a four-step ritual of care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CRAFTSMANSHIP_STEPS.map((item) => (
          <div
            key={item.step}
            className="flex flex-col justify-between p-6 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs hover:border-primary/50 transition-all space-y-4"
          >
            <div className="space-y-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-on-primary font-mono text-sm font-bold shadow-xs">
                0{item.step}
              </span>
              <h3 className="font-serif text-lg font-semibold text-on-surface leading-snug">
                {item.title}
              </h3>
              <p className="text-xs font-medium text-primary">
                {item.tagline}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 text-[11px] text-on-surface-variant">
              {item.detail}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
