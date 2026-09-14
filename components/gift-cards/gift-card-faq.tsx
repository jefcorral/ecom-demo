import { ChevronDown, HelpCircle } from "lucide-react";

export function GiftCardFAQ() {
  const faqs = [
    {
      q: "How does digital gift card delivery work?",
      a: "Digital gift cards are sent directly to the recipient's email address on your chosen date. Each email includes your custom note, redemption instructions, and a unique 16-character voucher code that can be copied directly into checkout.",
    },
    {
      q: "When will a physical gift card arrive?",
      a: "Physical gift cards are hand-inscribed and dispatched via standard postal carrier within 1 business day. Delivery within the Pacific Northwest typically takes 2–3 business days, and 3–5 business days nationwide. Priority shipping options are also available at checkout.",
    },
    {
      q: "How do I redeem my Bloom & Stem gift card?",
      a: "To redeem online, enter your 16-character voucher code during Step 2 (Payment) at checkout. The card value will be immediately deducted from your order subtotal. In-person shoppers can present their digital email barcode or physical card at our Portland studio.",
    },
    {
      q: "Do Bloom & Stem gift cards expire?",
      a: "Never. Bloom & Stem gift cards have zero expiration dates, zero dormancy fees, and zero maintenance penalties. Any unused balance remains on the card until spent.",
    },
    {
      q: "Can I use multiple gift cards or combine with promotional codes?",
      a: "Yes! You can apply up to two gift cards per transaction, and gift cards may be combined with seasonal promotional codes or sale arrangements.",
    },
    {
      q: "What happens if my order exceeds the gift card amount?",
      a: "If your order total exceeds your gift card balance, you can pay the remaining difference using any credit card, Apple Pay, Google Pay, or another gift card.",
    },
    {
      q: "Can I check my remaining gift card balance?",
      a: "Yes. Use our instant Card Balance tool below, or check your balance during checkout. You can also contact our studio team with your voucher code anytime.",
    },
  ];

  return (
    <section aria-labelledby="faq-heading" className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HelpCircle className="size-4" />
        </div>
        <div>
          <h2 id="faq-heading" className="font-serif text-2xl font-semibold text-on-surface">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-on-surface-variant">
            Everything you need to know about purchasing and redeeming our gift cards.
          </p>
        </div>
      </div>

      <div className="divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-2 sm:p-4 shadow-xs">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-3 first:pt-1 last:pb-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm font-semibold text-on-surface hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2">
              <span>{faq.q}</span>
              <ChevronDown className="size-4 shrink-0 text-on-surface-variant transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="px-2 pt-2 pb-1 text-sm leading-relaxed text-on-surface-variant">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
