import { Clock, ExternalLink, MapPin, Navigation, Sparkles } from "lucide-react";
import { STUDIO_CONTACT_DETAILS } from "@/lib/contact-data";
import { Button } from "@/components/ui/button";

export function StudioLocationCard() {
  const directionsUrl = `https://maps.google.com/?q=${encodeURIComponent("128 Botanical Way, Portland, OR 97205")}`;

  return (
    <aside aria-labelledby="studio-location-heading" className="space-y-6">
      <div className="rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-7 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Northwest Flagship
          </span>
          <h3 id="studio-location-heading" className="font-serif text-xl font-semibold text-on-surface">
            Studio Hours &amp; Location
          </h3>
        </div>

        {/* Stylized Visual Map Representation */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-outline-variant/30 bg-[#2c3e2a]/5 flex flex-col items-center justify-center p-4 text-center">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#785900_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-md mb-2 animate-bounce motion-reduce:animate-none">
              <MapPin className="size-6" />
            </div>
            <p className="font-serif font-semibold text-sm text-on-surface">Bloom &amp; Stem Atelier</p>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">128 Botanical Way, Portland</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-on-surface">{STUDIO_CONTACT_DETAILS.address}</p>
              <p className="text-on-surface-variant">{STUDIO_CONTACT_DETAILS.cityStateZip}</p>
              <p className="text-[11px] text-on-surface-variant/80 mt-0.5">
                {STUDIO_CONTACT_DETAILS.neighborhood}
              </p>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-3 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-primary text-[11px]">
              <Clock className="size-3.5" /> Opening Hours
            </div>
            <div className="divide-y divide-outline-variant/20 space-y-1">
              {STUDIO_CONTACT_DETAILS.hours.map((h) => (
                <div key={h.days} className="flex justify-between py-1">
                  <span className="font-medium text-on-surface">{h.days}</span>
                  <span className="text-on-surface-variant">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-low p-3 space-y-1">
            <p className="font-semibold text-on-surface text-[11px]">Visiting &amp; Parking</p>
            <p className="text-on-surface-variant text-[11px] leading-relaxed">
              Dedicated 1-hour customer parking behind our studio. NW 23rd Ave Streetcar stop is just 2 blocks away.
            </p>
          </div>

          <Button
            render={<a href={directionsUrl} target="_blank" rel="noopener noreferrer" />}
            variant="outline"
            className="w-full h-11 text-xs font-semibold rounded-full"
          >
            <Navigation className="size-3.5 mr-1.5" /> Get Directions in Google Maps <ExternalLink className="size-3 ml-1 opacity-60" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
