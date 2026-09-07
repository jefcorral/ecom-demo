"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DangerZoneCardProps {
  userEmail?: string;
  onDeleteAccount: () => Promise<void>;
  disabled?: boolean;
}

export function DangerZoneCard({
  userEmail,
  onDeleteAccount,
  disabled = false,
}: DangerZoneCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedConfirmation = "DELETE";
  const isConfirmed = confirmationInput.trim() === expectedConfirmation;

  const handleOpenDialog = () => {
    setConfirmationInput("");
    setError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!loading) {
      setDialogOpen(false);
      setConfirmationInput("");
      setError(null);
    }
  };

  // Note: ecom-api has no self-service account deletion endpoint yet; this shows a concierge fallback until DELETE /auth/me is added.
  const handleDelete = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);
    try {
      await onDeleteAccount();
      setDialogOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("forbidden") ||
        msg.includes("403")
      ) {
        setError(
          "Self-service account deletion is currently unavailable. Please contact our concierge at support@bloomandstem.com to request account erasure in accordance with privacy regulations."
        );
      } else {
        setError(
          msg || "Failed to delete account. Please try again or contact concierge."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        aria-labelledby="danger-zone-title"
        className="rounded-2xl border border-error/20 bg-surface-container-lowest p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-error">
              <AlertTriangle className="size-5" />
              <h2 id="danger-zone-title" className="font-serif text-xl font-medium text-error">
                Danger Zone
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant max-w-xl">
              Permanently delete your account and personal floral curation records. This action cannot be undone.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleOpenDialog}
            disabled={disabled}
            className="self-start sm:self-center"
          >
            <Trash2 className="size-4 mr-1.5" />
            Delete Account
          </Button>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-error">
              <AlertTriangle className="size-5" />
              <DialogTitle className="font-serif text-xl">Delete Your Account</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-on-surface-variant pt-2 leading-relaxed">
              This will permanently delete your Bloom &amp; Stem account
              {userEmail ? ` (${userEmail})` : ""}, including your profile information, saved addresses, and curated floral preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-error/20 bg-error-container/20 p-3 text-xs text-on-surface">
              <p className="font-medium text-error mb-1">
                Warning: This action is permanent and cannot be reversed.
              </p>
              <p className="text-[11px] text-on-surface-variant">
                You will immediately lose access to your account and flower preferences.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-error/30 bg-error-container/30 p-3 text-xs font-medium text-error"
              >
                {error}
              </div>
            )}

            <div>
              <Label
                htmlFor="confirm-delete-input"
                className="text-xs font-semibold uppercase text-on-surface-variant"
              >
                Type <span className="font-mono font-bold text-error">{expectedConfirmation}</span> to confirm
              </Label>
              <Input
                id="confirm-delete-input"
                type="text"
                autoComplete="off"
                value={confirmationInput}
                onChange={(e) => {
                  setConfirmationInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={expectedConfirmation}
                disabled={loading}
                className="mt-1.5 font-mono text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCloseDialog}
              disabled={loading}
            >
              Keep Account
            </Button>
            <LoadingButton
              type="button"
              variant="destructive"
              size="sm"
              loading={loading}
              loadingLabel="Deleting..."
              onClick={handleDelete}
              disabled={!isConfirmed || loading}
            >
              Permanently Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { DangerZoneCard as DeleteAccountCard };
