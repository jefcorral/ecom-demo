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
    <nav role="navigation" aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1 sm:mt-10 sm:gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="font-label-md text-on-surface-variant">
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
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors sm:h-10 sm:w-10",
              p === page
                ? "bg-primary text-on-primary shadow-sm hover:bg-primary/90"
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
        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
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
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 2) {
    return [1, 2, 3, "ellipsis", total];
  }

  if (current >= total - 1) {
    return [1, "ellipsis", total - 2, total - 1, total];
  }

  return [1, "ellipsis", current, "ellipsis", total];
}
