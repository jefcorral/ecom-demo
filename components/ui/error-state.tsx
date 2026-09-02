"use client"

import Link from "next/link"
import { RefreshCw, Unplug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

function ErrorState({ title = "We couldn't reach the garden", description = "Something went wrong on our end. Please check your connection and try again.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return <EmptyState variant="error" icon={Unplug} title={title} description={description} action={onRetry && <Button onClick={onRetry} className="w-full sm:w-auto"><RefreshCw className="size-4" />Try Again</Button>} secondaryAction={<Button render={<Link href="/contact" />} variant="ghost" className="w-full sm:w-auto">Contact Support</Button>} />
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className="flex flex-col gap-3 rounded-md bg-error-container p-4 text-on-error-container motion-safe:animate-in motion-safe:slide-in-from-top-2 sm:flex-row sm:items-center"><span className="flex-1 text-sm font-medium">{message}</span>{onRetry && <Button type="button" size="sm" onClick={onRetry}>Try Again</Button>}</div>
}

export { ErrorBanner, ErrorState }
