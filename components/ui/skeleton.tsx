import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-[skeleton-shimmer_1.5s_ease-in-out_infinite] rounded-lg bg-[linear-gradient(90deg,#f5f2eb_25%,rgba(255,255,255,0.65)_50%,#f5f2eb_75%)] bg-[length:200%_100%] motion-reduce:animate-none motion-reduce:bg-[#f5f2eb]", className)}
      {...props}
    />
  )
}

export { Skeleton }
