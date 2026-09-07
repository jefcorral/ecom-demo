"use client";

import { Check, Heart, Sparkles, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FLOWER_STYLE_OPTIONS, COLOR_PALETTE_OPTIONS } from "@/lib/profile";

interface FloralPreferencesCardProps {
  flowerStyles: string[];
  flowerColors: string[];
  favoriteBlooms: string;
  onToggleStyle: (styleLabel: string) => void;
  onTogglePalette: (paletteLabel: string) => void;
  onChangeFavoriteBlooms: (value: string) => void;
  onResetPreferences?: () => void;
  disabled?: boolean;
}

export function FloralPreferencesCard({
  flowerStyles,
  flowerColors,
  favoriteBlooms,
  onToggleStyle,
  onTogglePalette,
  onChangeFavoriteBlooms,
  onResetPreferences,
  disabled = false,
}: FloralPreferencesCardProps) {
  const isCompletelyEmpty = flowerStyles.length === 0 && flowerColors.length === 0 && !favoriteBlooms.trim();

  return (
    <section aria-labelledby="floral-preferences-title" className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 id="floral-preferences-title" className="font-serif text-xl font-medium text-on-surface">
              Floral &amp; Aesthetic Preferences
            </h2>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            We tailor bouquet recommendations and seasonal selections to your botanical taste.
          </p>
        </div>

        {onResetPreferences && (
          <button
            type="button"
            onClick={onResetPreferences}
            disabled={disabled}
            className="text-xs font-medium text-primary hover:underline disabled:opacity-50 touch-manipulation min-h-[44px] px-2 flex items-center"
          >
            Reset to defaults
          </button>
        )}
      </div>

      {isCompletelyEmpty && (
        <div className="mb-6 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low/50 p-4 text-center">
          <Sparkles className="mx-auto size-5 text-primary/70 mb-1" />
          <p className="text-xs font-medium text-on-surface">No preferences selected yet</p>
          <p className="mt-0.5 text-[11px] text-on-surface-variant">
            Select arrangement styles and color palettes below to customize your botanical recommendations.
          </p>
        </div>
      )}

      {/* Flower Style Selection */}
      <div className="mb-6">
        <Label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Preferred Arrangement Styles
        </Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FLOWER_STYLE_OPTIONS.map((style) => {
            const isSelected = flowerStyles.includes(style.label);
            return (
              <button
                key={style.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleStyle(style.label)}
                aria-pressed={isSelected}
                className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all motion-reduce:transition-none touch-manipulation ${
                  isSelected
                    ? "border-primary bg-surface-container-low shadow-sm ring-2 ring-primary/20"
                    : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-sm font-medium text-on-surface">{style.label}</span>
                  <div className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-primary bg-primary text-white" : "border-outline-variant/60"}`}>
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">{style.description}</p>
              </button>
            );
          })}
        </div>
      </div>
      {/* Color Palette Selection */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center gap-1.5">
          <Palette className="size-4 text-primary" />
          <Label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Preferred Color Palettes
          </Label>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_PALETTE_OPTIONS.map((p) => {
            const isSelected = flowerColors.includes(p.label);
            return (
              <button
                key={p.id}
                type="button"
                disabled={disabled}
                onClick={() => onTogglePalette(p.label)}
                aria-pressed={isSelected}
                className={`group flex items-center justify-between rounded-xl border p-3.5 text-left transition-all motion-reduce:transition-none touch-manipulation ${
                  isSelected
                    ? "border-primary bg-surface-container-low shadow-sm ring-2 ring-primary/20"
                    : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-on-surface">{p.label}</p>
                  <p className="mt-0.5 text-[11px] text-on-surface-variant truncate">{p.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <div className="flex -space-x-1 overflow-hidden p-0.5">
                    {p.colors.map((hex, i) => (
                      <span
                        key={i}
                        className="inline-block size-4 rounded-full border border-surface shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                  {isSelected && <Check className="size-3.5 text-primary ml-1" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Favorite Blooms & Notes */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <Heart className="size-3.5 text-primary" />
          <Label htmlFor="favorite-blooms" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Favorite Blooms & Notes
          </Label>
        </div>
        <textarea
          id="favorite-blooms"
          rows={3}
          value={favoriteBlooms}
          onChange={(e) => onChangeFavoriteBlooms(e.target.value)}
          disabled={disabled}
          placeholder="e.g. Garden roses, peonies, ranunculus. Prefer pet-safe stems..."
          className="w-full rounded-xl border border-outline bg-surface-container-lowest p-3 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="mt-1.5 text-[11px] text-on-surface-variant">
          Our florists reference these notes when handcrafting arrangements for your subscription and gifting.
        </p>
      </div>
    </section>
  );
}
