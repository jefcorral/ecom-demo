import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flower2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactForm } from "@/components/contact/contact-form";
import { StudioLocationCard } from "@/components/contact/studio-location-card";
import { ContactFAQ } from "@/components/contact/contact-faq";

export const metadata: Metadata = {
  title: "Contact & Florist Support",
  description:
    "Reach our Portland floral studio team for delivery assistance, order tracking, bespoke event arrangements, and botanical care advice.",
};

export default function ContactPage() {
  return (
    <main className="pb-24 lg:pb-16">
      <div className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-12 space-y-12">
        {/* Navigation Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <ArrowLeft className="size-3.5" /> Back to Florals
        </Link>

        {/* Page Header */}
        <PageHeader
          eyebrow="Florist Support &amp; Atelier Care"
          title="How Can We Help You?"
          description="Whether checking the status of an active delivery, planning custom florals for a wedding, or inquiring about our Northwest Portland studio, our team of artisans is here for you."
        />

        {/* Direct Contact Channels */}
        <ContactChannels />

        {/* Main Grid: Form + Studio Location */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 shadow-xs">
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <StudioLocationCard />
          </div>
        </div>

        {/* Immediate Assistance FAQ */}
        <ContactFAQ />
      </div>
    </main>
  );
}
