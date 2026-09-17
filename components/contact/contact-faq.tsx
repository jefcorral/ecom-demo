import { ChevronDown, HelpCircle } from "lucide-react";

export function ContactFAQ() {
  const faqs = [
    {
      q: "Need to make an urgent change to today's delivery?",
      a: "Please call our direct studio hotline at (503) 555-0142 immediately. For same-day deliveries, address and message updates can be accommodated if called before 11:00 AM PST.",
    },
    {
      q: "What happens if the recipient isn't home?",
      a: "Our couriers place arrangements in climate-safe, shaded areas with water-bagged hydration packs, then send an instant SMS notification with photo proof of delivery to both sender and recipient.",
    },
    {
      q: "What is your 7-Day Freshness Guarantee?",
      a: "If your arrangement does not stay fresh and vibrant for at least 7 days with basic water care, send a quick photo to hello@bloomstem.com and we will immediately send a complimentary replacement bouquet.",
    },
    {
      q: "Do you deliver on Sundays and holidays?",
      a: "Yes! We offer standard Sunday delivery throughout the Greater Portland metro area. For major holidays (Valentine's Day, Mother's Day), early booking is recommended.",
    },
  ];

  return (
    <section aria-labelledby="contact-faq-heading" className="space-y-6 pt-4 border-t border-outline-variant/30">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HelpCircle className="size-4" />
        </div>
        <div>
          <h2 id="contact-faq-heading" className="font-serif text-2xl font-semibold text-on-surface">
            Immediate Assistance FAQ
          </h2>
          <p className="text-xs text-on-surface-variant">
            Quick answers to the most common delivery and order support questions.
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
