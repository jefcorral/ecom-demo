import { Award, Quote } from "lucide-react";
import { PRESS_QUOTES } from "@/lib/about-data";

export function PressQuotes() {
  return (
    <section aria-labelledby="press-heading" className="py-12 md:py-16 border-t border-outline-variant/30 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center justify-center gap-1.5">
          <Award className="size-3.5" /> Selected Press &amp; Recognition
        </span>
        <h2 id="press-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
          What the Design World Says
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRESS_QUOTES.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between p-6 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs space-y-4 hover:border-primary/50 transition-all"
          >
            <div className="space-y-3">
              <Quote className="size-5 text-primary/40" />
              <p className="font-serif text-sm sm:text-base italic text-on-surface leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface uppercase tracking-wider text-[11px]">
                {item.publication}
              </span>
              <span className="text-on-surface-variant font-mono text-[11px]">
                {item.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
