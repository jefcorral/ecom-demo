import { Clock, Mail, MapPin, MessageSquare, Phone, Sparkles } from "lucide-react";
import { STUDIO_CONTACT_DETAILS } from "@/lib/contact-data";

export function ContactChannels() {
  return (
    <section aria-labelledby="channels-heading" className="space-y-4">
      <h2 id="channels-heading" className="sr-only">Contact Channels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Phone */}
        <div className="p-5 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone className="size-4" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Live Florist Line
            </span>
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-on-surface">Direct Phone</h3>
            <a
              href={`tel:${STUDIO_CONTACT_DETAILS.phoneRaw}`}
              className="font-medium text-sm text-primary hover:underline block mt-0.5"
            >
              {STUDIO_CONTACT_DETAILS.phone}
            </a>
            <p className="text-[11px] text-on-surface-variant mt-1">
              {STUDIO_CONTACT_DETAILS.liveFloristHours}
            </p>
          </div>
        </div>

        {/* 2. Email */}
        <div className="p-5 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="size-4" />
            </div>
            <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              2–4 Hr Reply
            </span>
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-on-surface">Studio Email</h3>
            <a
              href={`mailto:${STUDIO_CONTACT_DETAILS.email}`}
              className="font-medium text-sm text-primary hover:underline block mt-0.5 truncate"
            >
              {STUDIO_CONTACT_DETAILS.email}
            </a>
            <p className="text-[11px] text-on-surface-variant mt-1">
              Monitored every day during daylight hours.
            </p>
          </div>
        </div>

        {/* 3. Studio */}
        <div className="p-5 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="size-4" />
            </div>
            <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              NW Portland
            </span>
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-on-surface">Portland Atelier</h3>
            <p className="text-sm text-on-surface font-medium mt-0.5">
              {STUDIO_CONTACT_DETAILS.address}
            </p>
            <p className="text-[11px] text-on-surface-variant mt-1">
              Walk-in flower bar open 7 days a week.
            </p>
          </div>
        </div>

        {/* 4. Chat Availability */}
        <div className="p-5 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageSquare className="size-4" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <Sparkles className="size-3" /> Online Concierge
            </span>
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-on-surface">Digital Care</h3>
            <p className="text-sm font-medium text-on-surface mt-0.5">
              Rapid Response Form
            </p>
            <p className="text-[11px] text-on-surface-variant mt-1">
              Fill our message form below for direct routing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
