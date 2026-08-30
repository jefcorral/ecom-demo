import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <nav role="navigation" aria-label="Pagination" className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-on-surface-variant">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant="ghost"
            size="icon"
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={cn(
              "h-10 w-10 rounded-full text-sm font-medium transition-colors",
              p === page
                ? "bg-primary text-on-primary hover:bg-primary/90"
                : "text-on-surface hover:bg-surface-container"
            )}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}
