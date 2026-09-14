"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Compass,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSuccessToast } from "@/lib/toast-helper";

export function StudioHours() {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("consultation");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) {
      setError("Please provide your name and email address.");
      return;
    }
    setError(null);
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setSubmitted(true);
    showSuccessToast("Studio consultation request sent! We will reach out within 24 hours.");
  };

  return (
    <section id="studio-hours" aria-labelledby="studio-heading" className="py-12 md:py-16 border-t border-outline-variant/30 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5 mb-1.5">
          <Compass className="size-3.5" /> Portland Flagship
        </span>
        <h2 id="studio-heading" className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
          Visit Our Studio &amp; Flower Bar
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant max-w-xl">
          Located in Northwest Portland. Walk-ins are always welcome at our open flower bar, where you can select single stems or design a custom arrangement with a florist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                <MapPin className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-on-surface">Atelier Location</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  128 Botanical Way<br />
                  Portland, OR 97205
                </p>
                <p className="text-xs text-on-surface-variant mt-1.5">
                  Complimentary 1-hour customer parking behind building.
                </p>
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-primary" />
                <a href="tel:+15035550142" className="text-on-surface hover:text-primary font-medium">
                  (503) 555-0142
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-primary" />
                <a href="mailto:hello@bloomstem.com" className="text-on-surface hover:text-primary font-medium">
                  hello@bloomstem.com
                </a>
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Clock className="size-3.5" /> Studio &amp; Flower Bar Hours
              </div>
              <div className="divide-y divide-outline-variant/20 text-xs">
                <div className="flex justify-between py-2">
                  <span className="font-medium text-on-surface">Monday – Friday</span>
                  <span className="text-on-surface-variant">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-on-surface">Saturday</span>
                  <span className="text-on-surface-variant">9:00 AM – 5:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-on-surface">Sunday</span>
                  <span className="text-on-surface-variant">10:00 AM – 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-outline-variant/40 bg-surface-container-low p-6 sm:p-8 shadow-xs space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
                <Sparkles className="size-3" /> Connect With Our Team
              </span>
              <h3 className="font-serif text-xl font-semibold text-on-surface">
                Book a Studio Consultation or Workshop
              </h3>
              <p className="text-xs text-on-surface-variant">
                Meet with a florist for bespoke event designs, weddings, or private botanical workshops.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl border border-primary/30 bg-primary/10 text-center space-y-3">
                <CheckCircle2 className="size-8 text-primary mx-auto" />
                <p className="font-serif text-lg font-semibold text-on-surface">Inquiry Received!</p>
                <p className="text-xs text-on-surface-variant">
                  Thank you, {inquiryName}. Eleanor or Clara will respond to {inquiryEmail} within one business day.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false);
                    setInquiryName("");
                    setInquiryEmail("");
                    setInquiryMessage("");
                  }}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="studio-name" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      Your Name *
                    </label>
                    <Input
                      id="studio-name"
                      placeholder="e.g. Maya Lin"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-email" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      Email Address *
                    </label>
                    <Input
                      id="studio-email"
                      type="email"
                      placeholder="maya@example.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="studio-type" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Inquiry Type
                  </label>
                  <select
                    id="studio-type"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="h-12 w-full rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="consultation">Bespoke Floral Consultation</option>
                    <option value="wedding">Weddings &amp; Large Events</option>
                    <option value="workshop">Private Atelier Workshop (4–12 guests)</option>
                    <option value="press">Press &amp; Editorial Inquiries</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="studio-message" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Your Vision or Questions
                  </label>
                  <Textarea
                    id="studio-message"
                    rows={3}
                    placeholder="Tell us about your event, floral palette, or desired dates..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                  />
                </div>

                {error && <p className="text-xs text-error">{error}</p>}

                <Button type="submit" disabled={submitting} className="w-full h-12">
                  <Send className="size-4 mr-1.5" />
                  {submitting ? "Sending..." : "Submit Studio Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
