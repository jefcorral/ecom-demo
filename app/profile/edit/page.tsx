"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";
import { useAuth } from "@/app/providers";
import { updateProfile, deleteAccount } from "@/lib/auth";
import { getUserPreferences, saveUserPreferences, DEFAULT_USER_PREFERENCES } from "@/lib/profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileNav } from "@/components/profile/profile-nav";
import { PersonalInfoCard, PersonalInfoFormState } from "@/components/profile/personal-info-card";
import { FloralPreferencesCard } from "@/components/profile/floral-preferences-card";
import { NotificationsConsentCard } from "@/components/profile/notifications-consent-card";
import { PasswordSecurityCard } from "@/components/profile/password-security-card";
import { DangerZoneCard } from "@/components/profile/danger-zone-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { successToast } from "@/components/ui/success-toast";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserPreferences } from "@/types";

export default function ProfileEditPage() {
  const { user, isLoggedIn, loading: authLoading, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormState>(() => ({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: DEFAULT_USER_PREFERENCES.phone ?? "",
    birthday: DEFAULT_USER_PREFERENCES.birthday ?? "",
  }));
  const [savedPersonalInfo, setSavedPersonalInfo] = useState<PersonalInfoFormState>(() => ({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: DEFAULT_USER_PREFERENCES.phone ?? "",
    birthday: DEFAULT_USER_PREFERENCES.birthday ?? "",
  }));

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string>("/profile");

  const [prevUserId, setPrevUserId] = useState(user?.id);
  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    const userPrefs = getUserPreferences(user.id);
    const initial = {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: userPrefs.phone ?? "",
      birthday: userPrefs.birthday ?? "",
    };
    setPersonalInfo(initial);
    setSavedPersonalInfo(initial);
  }
  const [personalInfoErrors, setPersonalInfoErrors] = useState<Partial<Record<keyof PersonalInfoFormState, string>>>({});
  const [savingPersonal, setSavingPersonal] = useState(false);

  const isDirty = useMemo(() => {
    return (
      personalInfo.firstName !== savedPersonalInfo.firstName ||
      personalInfo.lastName !== savedPersonalInfo.lastName ||
      personalInfo.phone !== savedPersonalInfo.phone ||
      personalInfo.birthday !== savedPersonalInfo.birthday
    );
  }, [personalInfo, savedPersonalInfo]);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleNavigateWithCheck = (href: string, e?: React.SyntheticEvent) => {
    if (isDirty) {
      e?.preventDefault();
      setPendingUrl(href);
      setShowLeaveDialog(true);
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    let active = true;
    const sync = () => {
      if (!active) return;
      const loadedPrefs = getUserPreferences(user?.id);
      setPreferences(loadedPrefs);
      setSavedPersonalInfo((prev) => ({
        ...prev,
        phone: loadedPrefs.phone ?? prev.phone,
        birthday: loadedPrefs.birthday ?? prev.birthday,
      }));
      setPersonalInfo((prev) => ({
        ...prev,
        phone: loadedPrefs.phone ?? prev.phone,
        birthday: loadedPrefs.birthday ?? prev.birthday,
      }));
    };

    const timer = setTimeout(sync, 0);
    window.addEventListener("bloom-user-preferences", sync);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener("bloom-user-preferences", sync);
    };
  }, [user?.id]);

  const handleAvatarChange = (avatarUrl: string) => {
    const updated = saveUserPreferences(user?.id, { avatarUrl });
    setPreferences(updated);
    successToast("Botanical avatar updated");
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfoFormState, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    if (personalInfoErrors[field]) {
      setPersonalInfoErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSavePersonalInfo = async () => {
    const errors: Partial<Record<keyof PersonalInfoFormState, string>> = {};
    if (!personalInfo.firstName.trim()) errors.firstName = "First name is required.";
    if (!personalInfo.lastName.trim()) errors.lastName = "Last name is required.";
    if (Object.keys(errors).length > 0) {
      setPersonalInfoErrors(errors);
      return;
    }

    setSavingPersonal(true);
    setPersonalInfoErrors({});
    try {
      await updateProfile({
        firstName: personalInfo.firstName.trim(),
        lastName: personalInfo.lastName.trim(),
      });
      const updated = saveUserPreferences(user?.id, {
        phone: personalInfo.phone.trim(),
        birthday: personalInfo.birthday,
      });
      setPreferences(updated);
      setSavedPersonalInfo({
        firstName: personalInfo.firstName.trim(),
        lastName: personalInfo.lastName.trim(),
        phone: personalInfo.phone.trim(),
        birthday: personalInfo.birthday,
      });
      await refreshUser();
      successToast("Personal details updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleResetPreferences = () => {
    const updated = saveUserPreferences(user?.id, {
      flowerStyles: [],
      flowerColors: [],
      favoriteBlooms: "",
    });
    setPreferences(updated);
    successToast("Floral preferences reset to defaults");
  };

  const handleToggleStyle = (styleLabel: string) => {
    const current = preferences.flowerStyles ?? [];
    const exists = current.includes(styleLabel);
    const next = exists ? current.filter((s) => s !== styleLabel) : [...current, styleLabel];
    const updated = saveUserPreferences(user?.id, { flowerStyles: next });
    setPreferences(updated);
  };

  const handleTogglePalette = (paletteLabel: string) => {
    const current = preferences.flowerColors ?? [];
    const exists = current.includes(paletteLabel);
    const next = exists ? current.filter((p) => p !== paletteLabel) : [...current, paletteLabel];
    const updated = saveUserPreferences(user?.id, { flowerColors: next });
    setPreferences(updated);
  };

  const handleChangeFavoriteBlooms = (val: string) => {
    const updated = saveUserPreferences(user?.id, { favoriteBlooms: val });
    setPreferences(updated);
  };

  const handleChangeEmailConsent = (enabled: boolean) => {
    const updated = saveUserPreferences(user?.id, { emailConsent: enabled });
    setPreferences(updated);
    successToast(enabled ? "Subscribed to seasonal catalogs" : "Unsubscribed from email catalog");
  };

  const handleChangeSmsConsent = (enabled: boolean) => {
    const updated = saveUserPreferences(user?.id, { smsConsent: enabled });
    setPreferences(updated);
    successToast(enabled ? "Subscribed to SMS delivery alerts" : "Unsubscribed from SMS alerts");
  };

  const handleUpdatePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      await updateProfile({
        currentPassword: data.currentPassword,
        password: data.newPassword,
      });
      successToast("Password updated securely");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
      throw err;
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    await deleteAccount(user.id);
    await logout();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="mx-auto w-full max-w-[1140px] px-4 pt-10 pb-24 lg:px-6">
        <div className="h-40 rounded-3xl bg-surface-container-low animate-pulse motion-reduce:animate-none mb-8" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 pt-20 pb-24 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-container text-primary mb-4">
          <UserIcon className="size-8" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-on-surface">Sign In to Your Account</h1>
        <p className="mt-2 text-xs text-on-surface-variant">Please sign in to edit your profile.</p>
        <Link href="/login?redirect=/profile/edit" className={cn(buttonVariants({ className: "mt-6 w-full rounded-full min-h-[44px]" }))}>
          Sign In / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 pt-8 pb-24 md:py-12 lg:px-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={(e) => handleNavigateWithCheck("/profile", e)}
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-on-surface-variant hover:text-on-surface min-h-[44px] px-3 touch-manipulation motion-reduce:transition-none"
        >
          <ArrowLeft className="size-3.5" /> Back to Profile Overview
        </Button>
      </div>

      <ProfileHeader
        user={user}
        preferences={preferences}
        onAvatarChange={handleAvatarChange}
        isEditing
        onViewProfileClick={(e) => handleNavigateWithCheck("/profile", e)}
      />

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside>
          <ProfileNav onNavigate={(href, e) => handleNavigateWithCheck(href, e)} />
        </aside>

        <main className="space-y-8">
          <div className="space-y-4">
            <PersonalInfoCard
              email={user?.email ?? ""}
              values={personalInfo}
              errors={personalInfoErrors}
              onChange={handlePersonalInfoChange}
              disabled={savingPersonal}
            />

            {isDirty && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-900 dark:text-amber-200"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full bg-amber-500 animate-pulse motion-reduce:animate-none" />
                  You have unsaved changes in Personal Details.
                </span>
                <span className="font-medium shrink-0">Click &quot;Save Personal Details&quot; to apply.</span>
              </div>
            )}

            <div className="flex justify-end">
              <LoadingButton
                onClick={handleSavePersonalInfo}
                loading={savingPersonal}
                className="gap-1.5 rounded-full text-xs min-h-[44px] px-5 touch-manipulation motion-reduce:transition-none"
              >
                <Save className="size-3.5" /> Save Personal Details
              </LoadingButton>
            </div>
          </div>

          <FloralPreferencesCard
            flowerStyles={preferences.flowerStyles ?? []}
            flowerColors={preferences.flowerColors ?? []}
            favoriteBlooms={preferences.favoriteBlooms ?? ""}
            onToggleStyle={handleToggleStyle}
            onTogglePalette={handleTogglePalette}
            onChangeFavoriteBlooms={handleChangeFavoriteBlooms}
            onResetPreferences={handleResetPreferences}
          />

          <NotificationsConsentCard
            emailNotifications={preferences.emailConsent}
            smsNotifications={preferences.smsConsent}
            onChangeEmailNotifications={handleChangeEmailConsent}
            onChangeSmsNotifications={handleChangeSmsConsent}
          />

          <PasswordSecurityCard
            onUpdatePassword={handleUpdatePassword}
          />

          <DangerZoneCard
            userEmail={user?.email}
            onDeleteAccount={handleDeleteAccount}
          />
        </main>
      </div>

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="max-w-md bg-surface-container-lowest text-on-surface">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Discard Unsaved Changes?</DialogTitle>
            <DialogDescription className="text-xs text-on-surface-variant pt-2 leading-relaxed">
              You have unsaved changes in your personal details. If you leave now, these changes will be discarded.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowLeaveDialog(false)}
              className="min-h-[44px] touch-manipulation"
            >
              Keep Editing
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setShowLeaveDialog(false);
                router.push(pendingUrl);
              }}
              className="min-h-[44px] touch-manipulation"
            >
              Discard &amp; Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
