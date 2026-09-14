"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/app/providers";
import {
  INITIAL_GIFT_CARD_FORM,
  GIFT_CARD_THEMES,
} from "@/lib/gift-cards";
import { mockGiftCardProduct } from "@/lib/mock-data";
import { showSuccessToast } from "@/lib/toast-helper";
import { GiftCardFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { GiftCardPreview } from "@/components/gift-cards/gift-card-preview";
import { GiftCardForm } from "@/components/gift-cards/gift-card-form";
import { GiftCardTrustFeatures } from "@/components/gift-cards/gift-card-trust-features";
import { GiftCardFAQ } from "@/components/gift-cards/gift-card-faq";
import { GiftCardBalance } from "@/components/gift-cards/gift-card-balance";

export default function GiftCardsPage() {
  const { addItem } = useCart();
  const [formData, setFormData] = useState<GiftCardFormData>(INITIAL_GIFT_CARD_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addedItemDetails, setAddedItemDetails] = useState<{
    recipient: string;
    amount: number;
    format: string;
    quantity: number;
  } | null>(null);

  const handleFormChange = (updated: Partial<GiftCardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
    if (submitError) setSubmitError(null);
  };

  const handleReset = () => {
    setFormData(INITIAL_GIFT_CARD_FORM);
    setSubmitError(null);
    setAddedItemDetails(null);
  };

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const effectiveAmount = formData.isCustom
      ? parseFloat(formData.customAmount) || 0
      : formData.amount;

    const deliverySummary =
      formData.deliveryTiming === "scheduled" && formData.deliveryDate
        ? `Scheduled for ${formData.deliveryDate}`
        : "Send immediately";

    const note = [
      `[Gift Card: ${formData.format.toUpperCase()}]`,
      `Design: ${GIFT_CARD_THEMES[formData.theme].name}`,
      `Amount: $${effectiveAmount.toFixed(2)}`,
      `To: ${formData.recipientName}`,
      `From: ${formData.senderName}`,
      `Delivery: ${deliverySummary}`,
      formData.message ? `Message: "${formData.message}"` : "",
    ].filter(Boolean).join(" | ");

    try {
      await addItem(mockGiftCardProduct.id, formData.quantity, note);
      showSuccessToast(
        `${formData.quantity} × $${effectiveAmount} ${formData.format === "digital" ? "Digital" : "Physical"} Gift Card added to bag`
      );
      setAddedItemDetails({
        recipient: formData.recipientName,
        amount: effectiveAmount,
        format: formData.format,
        quantity: formData.quantity,
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        showSuccessToast(
          `${formData.quantity} × $${effectiveAmount} Gift Card added to bag (preview mode)`
        );
        setAddedItemDetails({
          recipient: formData.recipientName,
          amount: effectiveAmount,
          format: formData.format,
          quantity: formData.quantity,
        });
      } else {
        setSubmitError(
          err instanceof Error ? err.message : "Could not add gift card to cart. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-12 space-y-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <ArrowLeft className="size-3.5" /> Back to Florals
        </Link>

        <PageHeader
          eyebrow="The Art of Giving"
          title="Bloom & Stem Gift Cards"
          description="Give the timeless elegance of fresh bouquets, botanical plants, and bespoke gifts. Send a digital voucher instantly by email or order an embossed keepsake card in our signature envelope."
        />

        {addedItemDetails && (
          <div
            role="status"
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-on-primary">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-on-surface">
                  Gift Card added to your bag!
                </p>
                <p className="text-xs text-on-surface-variant">
                  {addedItemDetails.quantity} × ${addedItemDetails.amount.toFixed(2)}{" "}
                  {addedItemDetails.format} card for {addedItemDetails.recipient}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddedItemDetails(null)}
                className="flex-1 sm:flex-none"
              >
                Configure Another
              </Button>
              <Button render={<Link href="/cart" />} size="sm" className="flex-1 sm:flex-none">
                <ShoppingBag className="size-4 mr-1.5" /> View Bag &amp; Checkout
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start">
          <div>
            <GiftCardForm
              formData={formData}
              onChange={handleFormChange}
              onReset={handleReset}
              onAddToCart={handleAddToCart}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onRetrySubmit={handleAddToCart}
            />
          </div>

          <div className="lg:sticky lg:top-24 space-y-6">
            <GiftCardPreview formData={formData} />

            <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-xs space-y-3">
              <h3 className="font-serif text-sm font-semibold text-on-surface">Order Summary</h3>
              <div className="space-y-2 text-xs divide-y divide-outline-variant/30">
                <div className="flex justify-between pt-1">
                  <span className="text-on-surface-variant">Format</span>
                  <span className="font-medium text-on-surface capitalize">{formData.format} Card</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-on-surface-variant">Card Design</span>
                  <span className="font-medium text-on-surface">{GIFT_CARD_THEMES[formData.theme].name}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-on-surface-variant">Recipient</span>
                  <span className="font-medium text-on-surface truncate max-w-[180px]">{formData.recipientName || "—"}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-on-surface-variant">Delivery Fee</span>
                  <span className="font-medium text-primary">Free Delivery</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-semibold text-on-surface">
                  <span>Subtotal</span>
                  <span>
                    ${((formData.isCustom ? parseFloat(formData.customAmount) || 0 : formData.amount) * formData.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-on-surface-variant">
                <Lock className="size-3.5 text-primary" />
                <span>Encrypted checkout • Zero expiration date</span>
              </div>
            </div>
          </div>
        </div>
        <GiftCardTrustFeatures />

        <GiftCardBalance />

        <GiftCardFAQ />

        <section
          aria-labelledby="corporate-gifting-title"
          className="rounded-3xl bg-surface-container-low border border-outline-variant/50 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Building2 className="size-3.5" /> Corporate &amp; Bulk Orders
            </span>
            <h2 id="corporate-gifting-title" className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
              Sending 10+ Gift Cards?
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Delight your clients, celebrate team milestones, or prepare bespoke
              event gifts. We offer custom branding, bulk CSV delivery, and
              dedicated concierge billing.
            </p>
          </div>

          <Button
            render={<Link href="/contact" />}
            variant="outline"
            className="h-12 px-6 rounded-full"
          >
            Inquire for Bulk Orders <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </section>
      </div>
    </div>
  );
}
