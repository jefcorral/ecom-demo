import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function IconButton({ className, size = "icon", ...props }: ComponentProps<typeof Button>) {
  return <Button size={size} className={cn("size-11 shrink-0 rounded-full active:scale-95", className)} {...props} />
}

export { IconButton }
