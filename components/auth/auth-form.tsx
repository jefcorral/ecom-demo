"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="ml-2 text-xs font-semibold text-on-surface-variant">{label}</Label>
      {children}
      {error && <p id={`${id}-error`} className="text-xs font-semibold text-error">{error}</p>}
    </div>
  );
}

export function PasswordInput({ id, error, icon: Icon, className, ...props }: Omit<React.ComponentProps<typeof Input>, "type"> & { id: string; error?: string; icon?: LucideIcon }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-outline-variant" />}
      <Input id={id} type={visible ? "text" : "password"} className={cn("bg-surface-container-low pr-12", Icon && "pl-12", className)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : props["aria-describedby"]} {...props} />
      <button type="button" onClick={() => setVisible((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface" aria-label={visible ? "Hide password" : "Show password"}>
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

export function FormErrorSummary({ message }: { message?: string }) {
  if (!message) return null;
  return <div role="alert" className="flex items-start gap-2 rounded-md bg-error-container p-3 text-sm text-on-error-container motion-safe:animate-in motion-safe:slide-in-from-top-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>;
}

export function AuthSubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return <LoadingButton type="submit" loading={loading} loadingLabel={typeof children === "string" ? children : "Loading..."} className="w-full bg-[#785900] text-white hover:bg-[#9a7300]">{children}<ArrowRight className="order-2 h-4 w-4" /></LoadingButton>;
}

export function AuthSuccess({ title, message, children }: { title: string; message: string; children: React.ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center text-center motion-safe:animate-in motion-safe:zoom-in-95">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm"><Check className="h-8 w-8" strokeWidth={2.5} /></span>
      <h2 className="font-serif text-2xl font-semibold text-on-surface">{title}</h2>
      <p className="mt-2 text-on-surface-variant">{message}</p>
      <div className="mt-6 w-full">{children}</div>
    </div>
  );
}

export function CheckboxField({ id, checked, onChange, children, error }: { id: string; checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-on-surface-variant">
        <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className={cn("mt-0.5 h-4 w-4 rounded border-outline-variant accent-primary", error && "outline outline-1 outline-error")} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
        <span>{children}</span>
      </label>
      {error && <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-error">{error}</p>}
    </div>
  );
}
