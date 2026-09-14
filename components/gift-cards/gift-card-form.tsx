"use client";

import { useState } from "react";
import {
  Check,
  Mail,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import {
  FormErrors,
  GIFT_CARD_THEMES,
  PRESET_AMOUNTS,
  QUICK_MESSAGES,
  validateGiftCardForm,
} from "@/lib/gift-cards";
import {
  GiftCardFormData,
  GiftCardThemeId,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { ErrorBanner } from "@/components/ui/error-state";
import { cn } from "@/lib/utils";

interface GiftCardFormProps {
  formData: GiftCardFormData;
  onChange: (updated: Partial<GiftCardFormData>) => void;
  onReset: () => void;
  onAddToCart: () => Promise<void>;
  isSubmitting: boolean;
  submitError?: string | null;
  onRetrySubmit?: () => void;
}

export function GiftCardForm({
  formData,
  onChange,
  onReset,
  onAddToCart,
  isSubmitting,
  submitError,
  onRetrySubmit,
}: GiftCardFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleAmountClick = (val: number) => {
    onChange({ amount: val, isCustom: false, customAmount: "" });
    if (errors.customAmount) setErrors((prev) => ({ ...prev, customAmount: undefined }));
  };

  const handleCustomAmountChange = (val: string) => {
    const cleanVal = val.replace(/[^0-9.]/g, "");
    onChange({ isCustom: true, customAmount: cleanVal });
    if (errors.customAmount) setErrors((prev) => ({ ...prev, customAmount: undefined }));
  };

  const currentEffectiveAmount = formData.isCustom
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;

  const total = currentEffectiveAmount * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateGiftCardForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    await onAddToCart();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section aria-labelledby="format-heading">
        <h2 id="format-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
          1. Select Format
        </h2>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Gift card format">
          <button
            type="button"
            role="radio"
            aria-checked={formData.format === "digital"}
            onClick={() => onChange({ format: "digital" })}
            className={cn(
              "flex flex-col items-start p-3 sm:p-4 rounded-xl border text-left transition-all outline-none",
              formData.format === "digital"
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                : "border-outline-variant/60 bg-surface-container-lowest hover:border-outline"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Mail className={cn("size-4", formData.format === "digital" ? "text-primary" : "text-on-surface-variant")} />
              <span className="font-serif font-semibold text-sm text-on-surface">Digital e-Gift Card</span>
            </div>
            <p className="text-xs text-on-surface-variant">Instant or scheduled delivery via email • Free</p>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={formData.format === "physical"}
            onClick={() => onChange({ format: "physical" })}
            className={cn(
              "flex flex-col items-start p-3 sm:p-4 rounded-xl border text-left transition-all outline-none",
              formData.format === "physical"
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                : "border-outline-variant/60 bg-surface-container-lowest hover:border-outline"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Package className={cn("size-4", formData.format === "physical" ? "text-primary" : "text-on-surface-variant")} />
              <span className="font-serif font-semibold text-sm text-on-surface">Physical Keepsake</span>
            </div>
            <p className="text-xs text-on-surface-variant">Luxe embossed card &amp; envelope via post</p>
          </button>
        </div>
      </section>

      <section aria-labelledby="theme-heading">
        <h2 id="theme-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
          2. Choose Card Design
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Card design theme">
          {(Object.keys(GIFT_CARD_THEMES) as GiftCardThemeId[]).map((themeId) => {
            const item = GIFT_CARD_THEMES[themeId];
            const isSelected = formData.theme === themeId;
            return (
              <button
                key={themeId}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange({ theme: themeId })}
                className={cn(
                  "flex flex-col items-center p-2.5 rounded-xl border text-center transition-all outline-none",
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 bg-surface-container-low shadow-xs"
                    : "border-outline-variant/50 bg-surface-container-lowest hover:border-outline"
                )}
              >
                <div className={cn("size-7 rounded-full border mb-1.5 shadow-xs flex items-center justify-center bg-gradient-to-br", item.previewGradient)}>
                  {isSelected && <Check className="size-3.5 text-primary stroke-[3]" />}
                </div>
                <span className="text-xs font-medium text-on-surface line-clamp-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>
      <section aria-labelledby="amount-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="amount-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            3. Choose Gift Amount
          </h2>
          <span className="text-xs text-primary font-medium">Selected: ${currentEffectiveAmount.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESET_AMOUNTS.map((amt) => {
            const isSelected = !formData.isCustom && formData.amount === amt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => handleAmountClick(amt)}
                className={cn(
                  "h-11 rounded-full text-sm font-semibold border transition-all outline-none",
                  isSelected
                    ? "bg-primary text-on-primary border-primary shadow-xs"
                    : "bg-surface-container-lowest text-on-surface border-outline-variant/60 hover:border-primary hover:bg-surface-container-low"
                )}
              >
                ${amt}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onChange({ isCustom: true })}
            className={cn(
              "h-11 rounded-full text-sm font-semibold border transition-all outline-none",
              formData.isCustom
                ? "bg-primary text-on-primary border-primary shadow-xs"
                : "bg-surface-container-lowest text-on-surface border-outline-variant/60 hover:border-primary hover:bg-surface-container-low"
            )}
          >
            Custom
          </button>
        </div>

        {formData.isCustom && (
          <div className="p-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-low">
            <label htmlFor="custom-amount-input" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Enter Custom Amount ($10 – $1,000)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-on-surface-variant">$</span>
              <Input
                id="custom-amount-input"
                type="text"
                inputMode="decimal"
                placeholder="75.00"
                value={formData.customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-8"
                aria-invalid={!!errors.customAmount}
              />
            </div>
            {errors.customAmount && (
              <p className="mt-1.5 text-xs text-error">{errors.customAmount}</p>
            )}
          </div>
        )}
      </section>
      <section aria-labelledby="recipient-heading" className="space-y-4">
        <h2 id="recipient-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          4. Recipient Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="recipient-name" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Recipient Name *
            </label>
            <Input
              id="recipient-name"
              placeholder="e.g. Eleanor Vance"
              value={formData.recipientName}
              onChange={(e) => {
                onChange({ recipientName: e.target.value });
                if (errors.recipientName) setErrors((p) => ({ ...p, recipientName: undefined }));
              }}
              aria-invalid={!!errors.recipientName}
            />
            {errors.recipientName && <p className="mt-1 text-xs text-error">{errors.recipientName}</p>}
          </div>

          {formData.format === "digital" && (
            <div>
              <label htmlFor="recipient-email" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Recipient Email *
              </label>
              <Input
                id="recipient-email"
                type="email"
                placeholder="eleanor@example.com"
                value={formData.recipientEmail}
                onChange={(e) => {
                  onChange({ recipientEmail: e.target.value });
                  if (errors.recipientEmail) setErrors((p) => ({ ...p, recipientEmail: undefined }));
                }}
                aria-invalid={!!errors.recipientEmail}
              />
              {errors.recipientEmail && <p className="mt-1 text-xs text-error">{errors.recipientEmail}</p>}
            </div>
          )}
        </div>

        {formData.format === "physical" && (
          <div className="space-y-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-3 sm:p-4">
            <p className="text-xs font-semibold text-on-surface uppercase tracking-wider">Mailing Address</p>
            <Input
              placeholder="Street Address"
              value={formData.deliveryAddress.street}
              onChange={(e) => {
                onChange({ deliveryAddress: { ...formData.deliveryAddress, street: e.target.value } });
                if (errors.street) setErrors((p) => ({ ...p, street: undefined }));
              }}
              aria-invalid={!!errors.street}
            />
            {errors.street && <p className="text-xs text-error">{errors.street}</p>}
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="City"
                value={formData.deliveryAddress.city}
                onChange={(e) => onChange({ deliveryAddress: { ...formData.deliveryAddress, city: e.target.value } })}
              />
              <Input
                placeholder="State"
                value={formData.deliveryAddress.state}
                onChange={(e) => onChange({ deliveryAddress: { ...formData.deliveryAddress, state: e.target.value } })}
              />
              <Input
                placeholder="ZIP"
                value={formData.deliveryAddress.zip}
                onChange={(e) => {
                  onChange({ deliveryAddress: { ...formData.deliveryAddress, zip: e.target.value } });
                  if (errors.zip) setErrors((p) => ({ ...p, zip: undefined }));
                }}
                aria-invalid={!!errors.zip}
              />
            </div>
          </div>
        )}

        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Delivery Timing
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="radio"
                name="deliveryTiming"
                checked={formData.deliveryTiming === "instant"}
                onChange={() => onChange({ deliveryTiming: "instant", deliveryDate: "" })}
                className="accent-primary"
              />
              <span>{formData.format === "digital" ? "Send Immediately" : "Dispatch Now"}</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="radio"
                name="deliveryTiming"
                checked={formData.deliveryTiming === "scheduled"}
                onChange={() => onChange({ deliveryTiming: "scheduled" })}
                className="accent-primary"
              />
              <span>Schedule Later Date</span>
            </label>
          </div>

          {formData.deliveryTiming === "scheduled" && (
            <div className="pt-2">
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.deliveryDate}
                onChange={(e) => {
                  onChange({ deliveryDate: e.target.value });
                  if (errors.deliveryDate) setErrors((p) => ({ ...p, deliveryDate: undefined }));
                }}
                aria-invalid={!!errors.deliveryDate}
              />
              {errors.deliveryDate && <p className="mt-1 text-xs text-error">{errors.deliveryDate}</p>}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="sender-heading" className="space-y-4">
        <h2 id="sender-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          5. Sender &amp; Gift Message
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="sender-name" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Your Name *
            </label>
            <Input
              id="sender-name"
              placeholder="e.g. Julian"
              value={formData.senderName}
              onChange={(e) => {
                onChange({ senderName: e.target.value });
                if (errors.senderName) setErrors((p) => ({ ...p, senderName: undefined }));
              }}
              aria-invalid={!!errors.senderName}
            />
            {errors.senderName && <p className="mt-1 text-xs text-error">{errors.senderName}</p>}
          </div>

          <div>
            <label htmlFor="sender-email" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Your Email (Receipt)
            </label>
            <Input
              id="sender-email"
              type="email"
              placeholder="julian@example.com"
              value={formData.senderEmail}
              onChange={(e) => onChange({ senderEmail: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="personal-message" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Personal Message (Optional)
            </label>
            <span className="text-[11px] text-on-surface-variant">{formData.message.length}/250</span>
          </div>
          <Textarea
            id="personal-message"
            maxLength={250}
            rows={3}
            placeholder="Write a heartfelt note..."
            value={formData.message}
            onChange={(e) => onChange({ message: e.target.value })}
          />

          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_MESSAGES.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange({ message: msg })}
                className="rounded-full bg-surface-container px-2.5 py-1 text-[11px] text-on-surface-variant hover:bg-primary/20 hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
              >
                + &ldquo;{msg.slice(0, 24)}...&rdquo;
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="space-y-4 pt-2 border-t border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Quantity
            </span>
            <span className="text-xs text-on-surface-variant">Duplicate cards with identical customization</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={formData.quantity <= 1}
              onClick={() => onChange({ quantity: Math.max(1, formData.quantity - 1) })}
              className="size-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface disabled:opacity-40 hover:bg-surface-container"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="font-semibold text-sm w-4 text-center">{formData.quantity}</span>
            <button
              type="button"
              disabled={formData.quantity >= 10}
              onClick={() => onChange({ quantity: Math.min(10, formData.quantity + 1) })}
              className="size-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface disabled:opacity-40 hover:bg-surface-container"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        {submitError && (
          <ErrorBanner message={submitError} onRetry={onRetrySubmit} />
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            className="w-full sm:flex-1 h-14 text-base font-semibold shadow-md"
          >
            <ShoppingBag className="size-5 mr-1" />
            Add to Bag • ${total.toFixed(2)}
          </LoadingButton>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto h-14"
            aria-label="Reset form fields"
          >
            <RotateCcw className="size-4 mr-1.5" />
            Reset
          </Button>
        </div>
      </section>
    </form>
  );
}
