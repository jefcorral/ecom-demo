import Image from "next/image";
import { Quote, Sparkles } from "lucide-react";
import { FOUNDER_STORY } from "@/lib/about-data";

export function FounderStory() {
  return (
    <section aria-labelledby="founder-story-heading" className="py-12 md:py-16 border-t border-outline-variant/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1 relative">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-lg border border-outline-variant/40 bg-surface-container-low">
            <Image
              src={FOUNDER_STORY.portraitUrl}
              alt="Eleanor Vance, Founder and Creative Director of Bloom and Stem"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

          <div className="mt-4 flex items-center justify-between px-2">
            <div>
              <p className="font-serif text-lg font-semibold text-on-surface">{FOUNDER_STORY.name}</p>
              <p className="text-xs text-on-surface-variant">{FOUNDER_STORY.title}</p>
            </div>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              Founded {FOUNDER_STORY.yearFounded}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Founder &amp; Atelier Story
            </span>
            <h2 id="founder-story-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface leading-snug">
              {FOUNDER_STORY.headline}
            </h2>
          </div>

          <div className="space-y-4 text-base text-on-surface-variant leading-relaxed font-sans">
            {FOUNDER_STORY.storyParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <blockquote className="rounded-2xl border-l-4 border-primary bg-surface-container-low p-5 sm:p-6 italic relative">
            <Quote className="size-6 text-primary/30 absolute right-4 top-4" />
            <p className="font-serif text-base sm:text-lg text-on-surface leading-relaxed">
              &ldquo;{FOUNDER_STORY.quote}&rdquo;
            </p>
            <footer className="mt-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant not-italic">
              — {FOUNDER_STORY.name}, {FOUNDER_STORY.title}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
