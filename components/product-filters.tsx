"use client";

import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { useState } from "react";

const PRICE_OPTIONS = [
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-150", label: "$100 - $150" },
  { value: "over-150", label: "Over $150" },
];

interface ProductFiltersProps {
  categories: Category[];
  activeCategoryIds: string[];
  activePriceRanges: string[];
  inStock: boolean;
  activeFilterCount: number;
  onCategoryChange: (id: string) => void;
  onPriceRangeChange: (value: string) => void;
  onInStockChange: (value: boolean) => void;
  onClear: () => void;
}

export function ProductFilters({
  categories,
  activeCategoryIds,
  activePriceRanges,
  inStock,
  activeFilterCount,
  onCategoryChange,
  onPriceRangeChange,
  onInStockChange,
  onClear,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="space-y-6">
      <FilterSection title="Category" defaultOpen>
        <div className="space-y-2">
          <FilterOption
            label="All Categories"
            checked={activeCategoryIds.length === 0}
            onChange={() => onCategoryChange("")}
          />
          {categories.map((category) => (
            <FilterOption
              key={category.id}
              label={category.name}
              checked={activeCategoryIds.includes(category.id)}
              onChange={() => onCategoryChange(category.id)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price" defaultOpen>
        <div className="space-y-2">
          {PRICE_OPTIONS.map((option) => (
            <FilterOption
              key={option.value}
              label={option.label}
              checked={activePriceRanges.includes(option.value)}
              onChange={() => onPriceRangeChange(option.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability" defaultOpen>
        <div className="space-y-2">
          <CheckboxOption
            label="In Stock Online"
            checked={inStock}
            onChange={() => onInStockChange(!inStock)}
          />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 md:block">
        <div className="sticky top-[140px] space-y-4">
          {content}
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              className="mb-4 h-10 gap-2 rounded-full border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          }
        />
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-surface-container-lowest p-0">
          <div className="flex w-full justify-center pt-3 pb-1">
            <div className="h-1.5 w-12 rounded-full bg-surface-variant" />
          </div>
          <SheetHeader className="border-b border-outline-variant/30 p-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-serif text-xl font-semibold text-on-surface">Filters</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>
          <div className="max-h-[calc(85vh-8rem)] overflow-y-auto p-4">{content}</div>
          <div className="absolute inset-x-0 bottom-0 border-t border-outline-variant/30 bg-surface-container-lowest p-4">
            <Button
              className="w-full rounded-full bg-primary text-on-primary hover:bg-primary/90"
              onClick={() => setOpen(false)}
            >
              Show Results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-outline-variant/30 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-on-surface">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5" />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary transition-transform" />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all",
          isOpen ? "mt-2 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

function FilterOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-4 py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer rounded border-outline-variant text-primary accent-primary focus:ring-primary"
      />
      <span className="text-base text-on-surface transition-colors group-hover:text-primary">{label}</span>
    </label>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-4 py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer rounded border-outline-variant text-primary accent-primary focus:ring-primary"
      />
      <span className="text-base text-on-surface transition-colors group-hover:text-primary">{label}</span>
    </label>
  );
}
