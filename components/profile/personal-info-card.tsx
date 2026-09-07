"use client";

import { CheckCircle2, Mail, Phone, Calendar, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface PersonalInfoFormState {
  firstName: string;
  lastName: string;
  phone: string;
  birthday: string;
}

interface PersonalInfoCardProps {
  email: string;
  values: PersonalInfoFormState;
  errors?: Partial<Record<keyof PersonalInfoFormState, string>>;
  onChange: (field: keyof PersonalInfoFormState, value: string) => void;
  disabled?: boolean;
}

export function PersonalInfoCard({
  email,
  values,
  errors = {},
  onChange,
  disabled = false,
}: PersonalInfoCardProps) {
  return (
    <section aria-labelledby="personal-info-title" className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-5">
        <h2 id="personal-info-title" className="font-serif text-xl font-medium text-on-surface">
          Personal Information
        </h2>
        <p className="mt-1 text-xs text-on-surface-variant">
          Your profile details used for orders and floral deliveries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="first-name" className="text-xs font-semibold uppercase text-on-surface-variant">
            First Name <span className="text-error">*</span>
          </Label>
          <div className="relative mt-1.5">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/60" />
            <Input
              id="first-name"
              required
              aria-required="true"
              aria-invalid={!!errors.firstName}
              value={values.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              disabled={disabled}
              placeholder="First name"
              className="pl-9"
            />
          </div>
          {errors.firstName && (
            <p role="alert" aria-live="polite" className="mt-1 text-xs text-error font-medium">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="last-name" className="text-xs font-semibold uppercase text-on-surface-variant">
            Last Name <span className="text-error">*</span>
          </Label>
          <div className="relative mt-1.5">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/60" />
            <Input
              id="last-name"
              required
              aria-required="true"
              aria-invalid={!!errors.lastName}
              value={values.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              disabled={disabled}
              placeholder="Last name"
              className="pl-9"
            />
          </div>
          {errors.lastName && (
            <p role="alert" aria-live="polite" className="mt-1 text-xs text-error font-medium">
              {errors.lastName}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-address" className="text-xs font-semibold uppercase text-on-surface-variant">
              Email Address
            </Label>
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary text-[10px] py-0.5">
              <CheckCircle2 className="size-3" />
              Verified
            </Badge>
          </div>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/60" />
            <Input
              id="email-address"
              type="email"
              value={email}
              readOnly
              disabled
              className="cursor-not-allowed bg-surface-container-low pl-9 text-on-surface-variant"
            />
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Email is verified and locked to your account.
          </p>
        </div>

        <div>
          <Label htmlFor="phone-number" className="text-xs font-semibold uppercase text-on-surface-variant">
            Phone Number
          </Label>
          <div className="relative mt-1.5">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/60" />
            <Input
              id="phone-number"
              type="tel"
              value={values.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              disabled={disabled}
              placeholder="+1 (555) 000-0000"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="birthday" className="text-xs font-semibold uppercase text-on-surface-variant">
            Birthday (Optional)
          </Label>
          <div className="relative mt-1.5">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/60" />
            <Input
              id="birthday"
              type="date"
              value={values.birthday}
              onChange={(e) => onChange("birthday", e.target.value)}
              disabled={disabled}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
