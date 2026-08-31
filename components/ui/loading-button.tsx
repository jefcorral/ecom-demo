"use client"

import { Check, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function LoadingButton({ loading = false, success = false, loadingLabel = "Loading...", successLabel = "Done", children, disabled, ...props }: React.ComponentProps<typeof Button> & { loading?: boolean; success?: boolean; loadingLabel?: string; successLabel?: string }) {
  return <Button disabled={disabled || loading || success} aria-busy={loading} {...props}>{loading ? <><LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />{loadingLabel}</> : success ? <><Check className="size-4 motion-safe:animate-in motion-safe:zoom-in" />{successLabel}</> : children}</Button>
}

export { LoadingButton }
