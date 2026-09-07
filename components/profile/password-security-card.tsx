"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";

interface PasswordSecurityCardProps {
  onUpdatePassword: (input: { currentPassword: string; newPassword: string }) => Promise<void>;
  disabled?: boolean;
}

export function PasswordSecurityCard({ onUpdatePassword, disabled = false }: PasswordSecurityCardProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);
    try {
      await onUpdatePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="security-card-title" className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <KeyRound className="size-5 text-primary" />
        <h2 id="security-card-title" className="font-serif text-xl font-medium text-on-surface">
          Account Security & Password
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" aria-live="polite" className="rounded-xl border border-error/30 bg-error-container/30 p-3 text-xs text-error font-medium">
            {error}
          </div>
        )}
        {success && (
          <div role="alert" aria-live="polite" className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary-container/30 p-3 text-xs text-primary font-medium">
            <ShieldCheck className="size-4 shrink-0" />
            Password changed successfully. Your account is secured.
          </div>
        )}

        <div>
          <Label htmlFor="current-password" className="text-xs font-semibold uppercase text-on-surface-variant">
            Current Password <span className="text-error">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={disabled || loading}
              placeholder="••••••••"
              className="pr-10 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              aria-label={showCurrent ? "Hide current password" : "Show current password"}
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="new-password" className="text-xs font-semibold uppercase text-on-surface-variant">
              New Password <span className="text-error">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={disabled || loading}
                placeholder="Min 8 characters"
                className="pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                aria-label={showNew ? "Hide new password" : "Show new password"}
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Minimum 8 characters.
            </p>

          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase text-on-surface-variant">
              Confirm New Password <span className="text-error">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={disabled || loading}
                placeholder="Repeat new password"
                className="pr-10 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <LoadingButton
            type="submit"
            variant="outline"
            loading={loading}
            loadingLabel="Updating Password..."
            disabled={disabled || !currentPassword || !newPassword || !confirmPassword}
            className="w-full sm:w-auto"
          >
            Update Password
          </LoadingButton>
        </div>
      </form>
    </section>
  );
}
