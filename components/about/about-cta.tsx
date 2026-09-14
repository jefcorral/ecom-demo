import Link from "next/link";
import { ArrowRight, Flower2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
  return (
    <section aria-labelledby="cta-heading" className="my-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 p-8 sm:p-12 text-center space-y-6">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
        <Flower2 className="size-7" />
      </div>

      <div className="space-y-2 max-w-xl mx-auto">
        <h2 id="cta-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
          Experience Botanical Elegance
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Whether celebrating life’s grandest milestones or sharing a quiet moment of gratitude, our florists are ready to hand-tie your next arrangement.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button render={<Link href="/products" />} size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
          Shop Seasonal Bouquets <ArrowRight className="size-4 ml-2" />
        </Button>
        <Button render={<Link href="/gift-cards" />} variant="outline" size="lg" className="w-full sm:w-auto h-14 px-7 text-base">
          <Gift className="size-4 mr-2 text-primary" /> Send a Gift Card
        </Button>
      </div>
    </section>
  );
}
