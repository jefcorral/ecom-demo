import { toast } from "sonner";
import { Check } from "lucide-react";

export function showSuccessToast(message: string) {
  toast.success(message, {
    style: {
      backgroundColor: "#F2B705", // --color-yellow
      color: "#FFFFFF",
      borderRadius: "12px",       // Toast radius: 12px
      fontSize: "14px",           // Toast text: 14px sans-serif
      fontFamily: "sans-serif",
      border: "none",
    },
    duration: 3000,
  });
}

interface ErrorToastOptions {
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export function showErrorToast(message: string, options?: ErrorToastOptions) {
  toast.error(message, {
    style: {
      backgroundColor: "#F3D9D9", // --color-blush
      color: "#C45B5B",           // --color-error
      borderRadius: "12px",       // Toast radius: 12px
      fontSize: "14px",           // Toast text: 14px sans-serif
      fontFamily: "sans-serif",
      border: "none",
    },
    duration: options?.duration ?? 5000, // Error toasts remain visible at least 5 seconds
    action: options?.actionLabel && options?.onAction ? {
      label: options.actionLabel,
      onClick: options.onAction,
    } : undefined,
  });
}
