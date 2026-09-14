"use client";

import { useState } from "react";
import { Flower2, Mail, Package, QrCode, RefreshCw, Sparkles } from "lucide-react";
import { GIFT_CARD_THEMES } from "@/lib/gift-cards";
import { GiftCardFormData } from "@/types";
import { cn } from "@/lib/utils";

export function GiftCardPreview({ formData }: { formData: GiftCardFormData }) {
  const [flipped, setFlipped] = useState(false);
  const theme = GIFT_CARD_THEMES[formData.theme] || GIFT_CARD_THEMES.botanical;

  const currentAmount = formData.isCustom
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;
  const displayAmount = currentAmount > 0 ? `$${currentAmount.toFixed(2)}` : "$0.00";
  const recipient = formData.recipientName.trim() || "Recipient Name";
  const sender = formData.senderName.trim() || "Your Name";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Sparkles className="size-3.5" /> Live Preview
        </span>
        <button
          type="button"
          onClick={() => setFlipped((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1 text-xs font-medium text-on-surface-variant hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          <RefreshCw className="size-3" />
          {flipped ? "Show Front" : "Show Back"}
        </button>
      </div>

      <div
        className={cn(
          "relative w-full aspect-[1.586/1] rounded-2xl p-5 sm:p-6 shadow-md border overflow-hidden flex flex-col justify-between bg-gradient-to-br motion-reduce:transition-none",
          theme.previewGradient,
          theme.borderClass
        )}
        aria-live="polite"
      >
        {!flipped ? (
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={cn("flex size-7 items-center justify-center rounded-full border", theme.badgeBgClass)}>
                  <Flower2 className="size-3.5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-semibold leading-none text-current">Bloom &amp; Stem</h3>
                  <p className={cn("text-[9px] uppercase tracking-wider mt-0.5", theme.subtextColorClass)}>Artisanal Florist</p>
                </div>
              </div>
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border", theme.badgeBgClass)}>
                {formData.format === "digital" ? <><Mail className="size-3" /> E-Gift</> : <><Package className="size-3" /> Keepsake</>}
              </span>
            </div>

            <div className="my-auto py-1">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className={cn("text-[9px] uppercase tracking-wider block", theme.subtextColorClass)}>Value</span>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-current">{displayAmount}</p>
                </div>
                <div className="text-right max-w-[55%]">
                  <span className={cn("text-[9px] uppercase tracking-wider block", theme.subtextColorClass)}>To</span>
                  <p className="font-serif text-xs sm:text-sm font-semibold truncate text-current">{recipient}</p>
                  <p className={cn("text-[10px] truncate", theme.subtextColorClass)}>From: {sender}</p>
                </div>
              </div>
              {formData.message && (
                <div className={cn("mt-2 rounded border p-1.5 text-xs italic line-clamp-2", theme.badgeBgClass)}>
                  &ldquo;{formData.message}&rdquo;
                </div>
              )}
            </div>

            <div className="flex items-end justify-between border-t border-current/15 pt-1.5 text-[10px]">
              <span className="font-mono tracking-widest font-semibold opacity-85">STEM-••••-••••</span>
              <span className={cn("text-[9px]", theme.subtextColorClass)}>Never Expires • Online &amp; In Studio</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full text-current relative z-10">
            <div className="border-b border-current/15 pb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Terms</span>
              <span className="font-mono opacity-75 text-[10px]">STEM-8492-7104</span>
            </div>
            <div className="my-auto grid grid-cols-[1fr_auto] gap-2 items-center text-[10px]">
              <div className={cn("leading-relaxed space-y-1", theme.subtextColorClass)}>
                <p>Present code at checkout on <strong>bloomstem.com</strong> or in-studio in Portland.</p>
                <p>Valid toward all florals, plants, and gifts. Never expires.</p>
              </div>
              <div className={cn("p-1 rounded border flex flex-col items-center", theme.badgeBgClass)}>
                <QrCode className="size-8 opacity-85" />
              </div>
            </div>
            <div className="border-t border-current/15 pt-1 flex items-center justify-between text-[9px] opacity-80">
              <span>bloomstem.com</span>
              <span>(503) 555-0142</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-on-surface-variant">
        {formData.format === "digital"
          ? "Delivered directly to recipient’s inbox with personal note and online checkout code."
          : "Hand-inscribed and delivered in our signature gold-foil embossed keepsake envelope."}
      </p>
    </div>
  );
}
