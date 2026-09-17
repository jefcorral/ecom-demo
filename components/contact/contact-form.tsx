"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  RotateCcw,
  Send,
  Truck,
} from "lucide-react";
import {
  CONTACT_TOPICS,
  ContactFormErrors,
  INITIAL_CONTACT_FORM,
  submitContactInquiry,
  validateContactForm,
} from "@/lib/contact-data";
import {
  ContactFormData,
  ContactSubmissionResult,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { ErrorBanner } from "@/components/ui/error-state";
import { showSuccessToast } from "@/lib/toast-helper";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_CONTACT_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ContactSubmissionResult | null>(null);

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleReset = () => {
    setFormData(INITIAL_CONTACT_FORM);
    setErrors({});
    setSubmitError(null);
  };

  const handleFormSubmit = async () => {
    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitContactInquiry(formData);
      setResult(res);
      showSuccessToast("Your message has been sent to our Portland florist team!");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFormSubmit();
  };

  if (result) {
    return (
      <div
        role="region"
        aria-live="polite"
        className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-10 space-y-6 shadow-xs"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
          <CheckCircle2 className="size-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Ticket Ref: {result.ticketId}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
            Thank you, {result.data.name}!
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed max-w-lg">
            Your inquiry regarding <strong>{CONTACT_TOPICS.find((t) => t.id === result.data.topic)?.label}</strong> has been routed directly to our lead florists.
          </p>
        </div>

        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Response Expectation</span>
            <span className="font-semibold text-primary">{result.estimatedResponse}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Destination Email</span>
            <span className="font-medium text-on-surface">{result.data.email}</span>
          </div>
          {result.data.orderId && (
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Referenced Order</span>
              <span className="font-mono text-on-surface">{result.data.orderId}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              handleReset();
            }}
            className="w-full sm:w-auto h-12"
          >
            Send Another Message
          </Button>
          <Button render={<Link href="/track-order" />} className="w-full sm:w-auto h-12">
            <Truck className="size-4 mr-1.5" /> Track An Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section aria-labelledby="topic-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="topic-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            1. What can we help you with?
          </h3>
          <span className="text-[11px] text-primary font-medium">Select a topic</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label="Inquiry topic">
          {CONTACT_TOPICS.map((topic) => {
            const isSelected = formData.topic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleFieldChange("topic", topic.id)}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all outline-none flex flex-col justify-between space-y-1.5",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                    : "border-outline-variant/50 bg-surface-container-lowest hover:border-outline"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-serif text-sm font-semibold text-on-surface">
                    {topic.label}
                  </span>
                  {isSelected && <span className="size-2 rounded-full bg-primary" />}
                </div>
                <p className="text-[11px] text-on-surface-variant leading-tight">
                  {topic.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>
      <section aria-labelledby="details-heading" className="space-y-4">
        <h3 id="details-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          2. Your Details &amp; Order
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Full Name *
            </label>
            <Input
              id="contact-name"
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Email Address *
            </label>
            <Input
              id="contact-email"
              type="email"
              placeholder="eleanor@example.com"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Phone Number (Optional)
            </label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="(503) 555-0100"
              value={formData.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="contact-order-id" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Order ID (If Applicable)
            </label>
            <Input
              id="contact-order-id"
              placeholder="e.g. ORD-8924"
              value={formData.orderId}
              onChange={(e) => handleFieldChange("orderId", e.target.value)}
              className="font-mono uppercase"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="message-heading" className="space-y-4">
        <h3 id="message-heading" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          3. How can we help?
        </h3>

        <div>
          <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Subject *
          </label>
          <Input
            id="contact-subject"
            placeholder="Brief summary of your inquiry..."
            value={formData.subject}
            onChange={(e) => handleFieldChange("subject", e.target.value)}
            aria-invalid={!!errors.subject}
          />
          {errors.subject && <p className="mt-1 text-xs text-error">{errors.subject}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Message Details *
            </label>
            <span className="text-[11px] text-on-surface-variant">{formData.message.length} chars</span>
          </div>
          <Textarea
            id="contact-message"
            rows={4}
            placeholder="Please share any details, floral preferences, or questions..."
            value={formData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="mt-1 text-xs text-error">{errors.message}</p>}
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Preferred Response Channel
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="radio"
                name="preferredMethod"
                checked={formData.preferredMethod === "email"}
                onChange={() => handleFieldChange("preferredMethod", "email")}
                className="accent-primary"
              />
              <span>Email Response (Recommended)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="radio"
                name="preferredMethod"
                checked={formData.preferredMethod === "phone"}
                onChange={() => handleFieldChange("preferredMethod", "phone")}
                className="accent-primary"
              />
              <span>Phone Call</span>
            </label>
          </div>
        </div>
      </section>
      {submitError && <ErrorBanner message={submitError} onRetry={handleFormSubmit} />}

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-outline-variant/30">
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          className="w-full sm:flex-1 h-14 text-base font-semibold shadow-md"
        >
          <Send className="size-4 mr-2" />
          Send Message to Atelier
        </LoadingButton>

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto h-14"
        >
          <RotateCcw className="size-4 mr-1.5" />
          Reset
        </Button>
      </div>
    </form>
  );
}
