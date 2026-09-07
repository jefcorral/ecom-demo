"use client";

import { useState } from "react";
import { Camera, Check, Trash2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESET_AVATARS } from "@/lib/profile";

interface AvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar?: string;
  onSelectAvatar: (url: string) => void;
}

export function AvatarDialog({
  open,
  onOpenChange,
  currentAvatar,
  onSelectAvatar,
}: AvatarDialogProps) {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatar || "");
  const [customUrl, setCustomUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleApply = () => {
    onSelectAvatar(selectedUrl);
    onOpenChange(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    setUploadError("");
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-surface-container-lowest p-6 text-on-surface">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Update Profile Photo</DialogTitle>
          <DialogDescription className="text-on-surface-variant">
            Choose a preset, upload a photo, or paste a link.
          </DialogDescription>
        </DialogHeader>
        <div className="my-3 space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-primary">
              {selectedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedUrl} alt="Avatar" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-primary-container text-on-primary-container">
                  <Camera className="size-5 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Selected Photo</p>
              <p className="text-xs text-on-surface-variant truncate">
                {selectedUrl ? "Ready" : "Default"}
              </p>
            </div>
            {selectedUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUrl("")}
                className="text-error"
                aria-label="Remove photo"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-semibold uppercase text-on-surface-variant">
              Presets
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AVATARS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedUrl(p.url)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 ${
                    selectedUrl === p.url
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-outline-variant/40"
                  }`}
                  aria-label={`Select ${p.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="size-full object-cover" />
                  {selectedUrl === p.url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/40">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1 block text-xs font-semibold uppercase text-on-surface-variant">
              Upload
            </Label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-outline p-2.5 hover:bg-surface-container-low">
              <Upload className="size-4 text-primary" />
              <span className="text-xs font-medium">Choose file</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
            </label>
            {uploadError && (
              <p role="alert" aria-live="polite" className="mt-1 text-xs text-error">
                {uploadError}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Or paste image URL"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => customUrl.trim() && setSelectedUrl(customUrl.trim())}
              disabled={!customUrl.trim()}
            >
              Apply
            </Button>
          </div>
        </div>
        <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
