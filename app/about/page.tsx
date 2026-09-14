import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { FounderStory } from "@/components/about/founder-story";
import { FloristProfiles } from "@/components/about/florist-profiles";
import { GrowerPartnerships } from "@/components/about/grower-partnerships";
import { SustainabilityCommitments } from "@/components/about/sustainability-commitments";
import { CraftsmanshipProcess } from "@/components/about/craftsmanship-process";
import { StudioHours } from "@/components/about/studio-hours";
import { PressQuotes } from "@/components/about/press-quotes";
import { AboutCTA } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "About Us | Bloom & Stem Artisanal Florist",
  description:
    "Learn about Bloom & Stem, our Portland floral atelier, founder Eleanor Vance, sustainable grower partnerships, and slow-flower craftsmanship.",
};

export default function AboutPage() {
  return (
    <main className="pb-20">
      <div className="mx-auto w-full max-w-[1140px] px-4 md:px-8 space-y-4">
        <AboutHero />
        <FounderStory />
        <FloristProfiles />
        <GrowerPartnerships />
        <SustainabilityCommitments />
        <CraftsmanshipProcess />
        <StudioHours />
        <PressQuotes />
        <AboutCTA />
      </div>
    </main>
  );
}
