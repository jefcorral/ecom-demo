import { Clock, Gift, ShieldCheck, Sparkles } from "lucide-react";

export function GiftCardTrustFeatures() {
  const features = [
    {
      icon: Sparkles,
      title: "Never Expires",
      description: "No maintenance fees or expiration dates ever.",
    },
    {
      icon: Clock,
      title: "Instant or Scheduled",
      description: "Send immediately or choose the perfect future date.",
    },
    {
      icon: Gift,
      title: "Artisanal Keepsake",
      description: "Physical cards crafted with luxe embossed paper & seal.",
    },
    {
      icon: ShieldCheck,
      title: "Flexible Redemption",
      description: "Redeemable online at checkout or at our Portland studio.",
    },
  ];

  return (
    <section aria-labelledby="gift-card-trust-title" className="py-8 border-y border-outline-variant/30">
      <h2 id="gift-card-trust-title" className="sr-only">Gift Card Guarantees</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <Icon className="size-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-on-surface mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-[200px]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
