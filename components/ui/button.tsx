import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:not-aria-[haspopup]:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-error/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary shadow-sm hover:bg-primary/90 hover:shadow-md",
        outline:
          "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:bg-surface-container-low",
        secondary:
          "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
        ghost:
          "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-6",
        xs: "h-8 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 px-4 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-2 px-8 text-base",
        icon: "size-11",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
