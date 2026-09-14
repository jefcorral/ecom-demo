"use client";

import { useState } from "react";
import Image from "next/image";
import { Flower2, Heart, Sparkles, UserCheck } from "lucide-react";
import { FLORISTS_DATA } from "@/lib/about-data";
import { FloristProfile } from "@/types";
import { cn } from "@/lib/utils";

export function FloristProfiles() {
  const [selectedFlorist, setSelectedFlorist] = useState<FloristProfile>(FLORISTS_DATA[0]);

  return (
    <section id="florists" aria-labelledby="florists-heading" className="py-12 md:py-16 border-t border-outline-variant/30 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5 mb-1.5">
            <UserCheck className="size-3.5" /> The Artisans
          </span>
          <h2 id="florists-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
            Meet Our Florists &amp; Stylists
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant max-w-xl">
            Each arrangement is individually conceived and hand-tied by our dedicated team of artists, sculptors, and botanical caretakers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FLORISTS_DATA.map((florist) => {
          const isSelected = selectedFlorist.id === florist.id;
          return (
            <div
              key={florist.id}
              onClick={() => setSelectedFlorist(florist)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedFlorist(florist);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col rounded-3xl border bg-surface-container-lowest overflow-hidden transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none",
                isSelected
                  ? "border-primary ring-2 ring-primary/40 bg-surface-container-low"
                  : "border-outline-variant/40 hover:border-primary/50"
              )}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container">
                <Image
                  src={florist.imageUrl}
                  alt={florist.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">
                  {florist.yearsWithStudio} yrs at atelier
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {florist.name}
                  </h3>
                  <p className="text-xs font-medium text-primary mt-0.5">{florist.role}</p>
                  <p className="mt-2 text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {florist.bio}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-outline-variant/30 text-xs">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <Heart className="size-3.5 text-primary shrink-0" />
                    <span className="truncate"><strong>Favorite:</strong> {florist.favoriteBloom}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {florist.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-on-surface-variant"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Spotlight Card */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
              <Sparkles className="size-3" /> Florist Quote
            </span>
            <p className="font-serif text-base sm:text-xl italic text-on-surface">
              &ldquo;{selectedFlorist.quote}&rdquo;
            </p>
            <p className="text-xs text-on-surface-variant">
              — {selectedFlorist.name}, {selectedFlorist.role}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Flower2 className="size-4" />
            </span>
            <span className="text-xs font-medium text-on-surface">
              Specialist in {selectedFlorist.specialties[0]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
