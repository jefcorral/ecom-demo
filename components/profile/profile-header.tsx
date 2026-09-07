"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, CheckCircle2, Edit3, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { User, UserPreferences } from "@/types";
import { Button } from "@/components/ui/button";
import { AvatarDialog } from "@/components/profile/avatar-dialog";

interface ProfileHeaderProps {
  user: User | null;
  preferences: UserPreferences;
  onAvatarChange?: (avatarUrl: string) => void;
  isEditing?: boolean;
  onViewProfileClick?: (e: React.MouseEvent) => void;
}

export function ProfileHeader({
  user,
  preferences,
  onAvatarChange,
  isEditing = false,
  onViewProfileClick,
}: ProfileHeaderProps) {
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  const fullName =
    user?.firstName || user?.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : "Botanical Enthusiast";

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "BS";

  const currentAvatar = preferences.avatarUrl;

  const handleAvatarSelect = (url: string) => {
    if (onAvatarChange) {
      onAvatarChange(url);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-secondary-container/20 p-6 md:p-8 shadow-sm">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-container/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="relative size-20 md:size-24 overflow-hidden rounded-full border-2 border-primary/20 bg-surface shadow-inner">
                {currentAvatar ? (
                  <Image src={currentAvatar} alt={fullName} fill sizes="96px" className="object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-primary-container/40 font-serif text-2xl font-bold text-primary">
                    {initials}
                  </div>
                )}
              </div>
              {onAvatarChange && (
                <button
                  type="button"
                  onClick={() => setAvatarDialogOpen(true)}
                  className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-primary text-on-primary shadow-md hover:scale-110 active:scale-95 transition-transform motion-reduce:transition-none motion-reduce:transform-none touch-manipulation after:absolute after:-inset-1.5 after:content-['']"
                  aria-label="Change botanical avatar"
                >
                  <Camera className="size-4" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-on-surface">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/60 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  <Sparkles className="size-3" />
                  Floral Member
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  {user?.email}
                  <CheckCircle2 className="size-3.5 text-primary" aria-label="Verified account" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            {isEditing ? (
              <Button
                render={<Link href="/profile" onClick={onViewProfileClick} />}
                variant="outline"
                size="sm"
                className="rounded-full text-xs min-h-[44px] px-4 touch-manipulation motion-reduce:transition-none"
              >
                View Profile
              </Button>
            ) : (
              <Button
                render={<Link href="/profile/edit" />}
                variant="outline"
                size="sm"
                className="rounded-full text-xs gap-1.5 min-h-[44px] px-4 touch-manipulation motion-reduce:transition-none"
              >
                <Edit3 className="size-3.5" />
                Edit Profile
              </Button>
            )}

            <Button
              render={<Link href="/orders" />}
              variant="outline"
              size="sm"
              className="rounded-full text-xs gap-1.5 min-h-[44px] px-4 touch-manipulation motion-reduce:transition-none"
            >
              <ShoppingBag className="size-3.5" />
              Orders
            </Button>

            <Button
              render={<Link href="/wishlist" />}
              variant="ghost"
              size="sm"
              className="rounded-full text-xs gap-1.5"
            >
              <Heart className="size-3.5 fill-current text-primary" />
              Wishlist
            </Button>
          </div>

        </div>
      </div>
      {onAvatarChange && (
        <AvatarDialog
          open={avatarDialogOpen}
          onOpenChange={setAvatarDialogOpen}
          currentAvatar={currentAvatar}
          onSelectAvatar={handleAvatarSelect}
        />
      )}

    </>
  );
}
