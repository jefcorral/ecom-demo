import { Check } from "lucide-react"
import { toast } from "sonner"

function successToast(message: string, description?: string) {
  return toast.success(message, { description, icon: <span className="flex size-7 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Check className="size-4" /></span>, className: "rounded-md border-outline-variant bg-surface-container-lowest text-on-surface shadow-md" })
}

export { successToast }
