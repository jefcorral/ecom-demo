"use client";

import { Bell, Mail, MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/label";

interface NotificationsConsentCardProps {
  emailNotifications: boolean;
  smsNotifications: boolean;
  onChangeEmailNotifications: (enabled: boolean) => void;
  onChangeSmsNotifications: (enabled: boolean) => void;
  disabled?: boolean;
}

export function NotificationsConsentCard({
  emailNotifications,
  smsNotifications,
  onChangeEmailNotifications,
  onChangeSmsNotifications,
  disabled = false,
}: NotificationsConsentCardProps) {
  return (
    <section aria-labelledby="notifications-title" className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-primary" />
          <h2 id="notifications-title" className="font-serif text-xl font-medium text-on-surface">
            Communication Preferences
          </h2>
        </div>
        <p className="mt-1 text-xs text-on-surface-variant">
          Control how Bloom & Stem communicates bouquet dispatches, seasonal offers, and care tips.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email notifications */}
        <div className="flex items-start justify-between rounded-xl bg-surface-container-low p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-surface-container-highest p-2 text-primary">
              <Mail className="size-4" />
            </div>
            <div>
              <Label htmlFor="email-notif-toggle" className="text-sm font-medium text-on-surface cursor-pointer">
                Seasonal Catalogs & Botanical Inquiries
              </Label>
              <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">
                Receive weekly seasonal bloom releases, member-exclusive invitations, and flower care guides.
              </p>
            </div>
          </div>
          <input
            id="email-notif-toggle"
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => onChangeEmailNotifications(e.target.checked)}
            disabled={disabled}
            aria-label="Email notifications"
            className="size-5 shrink-0 rounded border-outline text-primary accent-primary focus:ring-primary disabled:cursor-not-allowed"
          />
        </div>

        {/* SMS notifications */}
        <div className="flex items-start justify-between rounded-xl bg-surface-container-low p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-surface-container-highest p-2 text-primary">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <Label htmlFor="sms-notif-toggle" className="text-sm font-medium text-on-surface cursor-pointer">
                Delivery Alerts & Courier Updates
              </Label>
              <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">
                Real-time SMS updates when your fresh stems are picked, dispatched, and left at your doorstep.
              </p>
            </div>
          </div>
          <input
            id="sms-notif-toggle"
            type="checkbox"
            checked={smsNotifications}
            onChange={(e) => onChangeSmsNotifications(e.target.checked)}
            disabled={disabled}
            aria-label="SMS delivery alerts"
            className="size-5 shrink-0 rounded border-outline text-primary accent-primary focus:ring-primary disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </section>
  );
}
