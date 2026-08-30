import { cn } from "@/lib/utils";

interface LowStockBadgeProps {
  stock: number;
  lowStockThreshold?: number | null;
  className?: string;
}

export function LowStockBadge({
  stock,
  lowStockThreshold = 5,
  className,
}: LowStockBadgeProps) {
  const threshold = lowStockThreshold ?? 5;

  if (stock === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[9999px] bg-[#5C6B58] text-white px-[8px] py-[4px] text-[11px] font-sans font-bold tracking-wider uppercase",
          className
        )}
      >
        Out of Stock
      </span>
    );
  }

  if (stock <= threshold) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[9999px] bg-[#FDFBF6] text-[#D4A373] border border-[#D4A373] px-[8px] py-[4px] text-[11px] font-sans font-bold tracking-wider uppercase",
          className
        )}
      >
        Only {stock} Left
      </span>
    );
  }

  return null;
}
