"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Edit3, Heart, Mail, Palette, Phone, ShoppingBag, Sparkles, User as UserIcon } from "lucide-react";
import { useAuth } from "@/app/providers";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileNav } from "@/components/profile/profile-nav";
import {
  getUserPreferences,
  saveUserPreferences,
  FLOWER_STYLE_OPTIONS,
  COLOR_PALETTE_OPTIONS,
} from "@/lib/profile";
import { UserPreferences } from "@/types";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(() => getUserPreferences(user?.id));

  useEffect(() => {
    const sync = () => setPreferences(getUserPreferences(user?.id));
    sync();
    window.addEventListener("bloom-user-preferences", sync);
    return () => window.removeEventListener("bloom-user-preferences", sync);
  }, [user?.id]);

  const handleAvatarChange = (avatarUrl: string) => {
    const updated = saveUserPreferences(user?.id, { avatarUrl });
    setPreferences(updated);
  };

  if (authLoading) {
    return (
      <div className="mx-auto w-full max-w-[1140px] px-4 pt-10 pb-24 lg:px-6">
        <div className="h-40 rounded-3xl bg-surface-container-low animate-pulse motion-reduce:animate-none mb-8" />
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <div className="h-64 rounded-2xl bg-surface-container-low animate-pulse motion-reduce:animate-none" />
          <div className="space-y-6">
            <div className="h-48 rounded-2xl bg-surface-container-low animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-container text-primary mb-4">
          <UserIcon className="size-8" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-on-surface">Sign In to Your Account</h1>
        <p className="mt-2 text-xs text-on-surface-variant">
          Access your personal floral preferences, order history, and saved addresses.
        </p>
        <Link href="/login?redirect=/profile" className={cn(buttonVariants({ className: "mt-6 w-full rounded-full" }))}>
          Sign In / Register
        </Link>
      </div>
    );
  }

  const selectedStyles = FLOWER_STYLE_OPTIONS.filter((s) =>
    preferences.flowerStyles.includes(s.label) || preferences.flowerStyles.includes(s.id)
  );
  const selectedPalettes = COLOR_PALETTE_OPTIONS.filter((p) =>
    preferences.flowerColors.includes(p.label) || preferences.flowerColors.includes(p.id)
  );

  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 pt-8 pb-24 md:py-12 lg:px-6 space-y-8">
      <ProfileHeader user={user} preferences={preferences} onAvatarChange={handleAvatarChange} />
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside>
          <ProfileNav />
        </aside>
        <main className="space-y-6">
          <section aria-labelledby="overview-personal-info" className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserIcon className="size-5 text-primary" />
                <h2 id="overview-personal-info" className="font-serif text-lg font-medium text-on-surface">
                  Personal Details
                </h2>
              </div>
              <Button render={<Link href="/profile/edit" />} variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <Edit3 className="size-3.5" /> Edit
              </Button>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low/50">
                <dt className="text-on-surface-variant font-medium uppercase tracking-wider text-[10px]">Full Name</dt>
                <dd className="mt-1 font-semibold text-on-surface text-sm">
                  {user?.firstName || user?.lastName ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Not specified"}
                </dd>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low/50">
                <dt className="text-on-surface-variant font-medium uppercase tracking-wider text-[10px]">Email Address</dt>
                <dd className="mt-1 font-semibold text-on-surface text-sm flex items-center gap-1.5">
                  <Mail className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </dd>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low/50">
                <dt className="text-on-surface-variant font-medium uppercase tracking-wider text-[10px]">Contact Phone</dt>
                <dd className="mt-1 text-on-surface text-sm flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary shrink-0" />
                  {preferences.phone || "No phone added"}
                </dd>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low/50">
                <dt className="text-on-surface-variant font-medium uppercase tracking-wider text-[10px]">Birthday</dt>
                <dd className="mt-1 text-on-surface text-sm">
                  {preferences.birthday || "Not provided"}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="overview-floral-preferences" className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <h2 id="overview-floral-preferences" className="font-serif text-lg font-medium text-on-surface">
                  Curated Floral Style
                </h2>
              </div>
              <Button render={<Link href="/profile/edit" />} variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <Palette className="size-3.5" /> Customize
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Preferred Aesthetics</p>
                {selectedStyles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedStyles.map((style) => (
                      <span key={style.id} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-container/40 px-3 py-1 text-xs font-medium text-on-primary-container">
                        <Sparkles className="size-3 text-primary" />
                        {style.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant italic">No arrangement aesthetics selected yet.</p>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Favorite Harmonizations</p>
                {selectedPalettes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPalettes.map((palette) => (
                      <span key={palette.id} className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface">
                        <span className="flex -space-x-1">
                          {palette.colors.slice(0, 3).map((hex, i) => (
                            <span key={i} className="size-3 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                          ))}
                        </span>
                        {palette.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant italic">No color palettes chosen yet.</p>
                )}
              </div>

              {preferences.favoriteBlooms && (
                <div className="p-3 rounded-xl bg-surface-container-low/50">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">Favorite Blooms & Notes</p>
                  <p className="mt-1 text-on-surface text-xs leading-relaxed">{preferences.favoriteBlooms}</p>
                </div>
              )}
            </div>
          </section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/orders" className="group flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md motion-reduce:transition-none">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary-container/50 text-primary group-hover:scale-105 transition-transform motion-reduce:transform-none motion-reduce:transition-none">
                  <ShoppingBag className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-on-surface text-sm">Order History</h3>
                  <p className="text-[11px] text-on-surface-variant">Track deliveries &amp; view receipts</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-on-surface-variant group-hover:text-primary transition-colors motion-reduce:transition-none" />
            </Link>

            <Link href="/wishlist" className="group flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md motion-reduce:transition-none">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary-container/50 text-primary group-hover:scale-105 transition-transform motion-reduce:transform-none motion-reduce:transition-none">
                  <Heart className="size-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-medium text-on-surface text-sm">Saved Wishlist</h3>
                  <p className="text-[11px] text-on-surface-variant">Your favorite seasonal stems</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-on-surface-variant group-hover:text-primary transition-colors motion-reduce:transition-none" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
