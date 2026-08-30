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

interface ProductFiltersProps {
  categories: Category[];
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
}

export function ProductFilters({ categories, activeCategoryId, onCategoryChange }: ProductFiltersProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="space-y-6">
      <FilterSection title="Category" defaultOpen>
        <div className="space-y-2">
          <FilterOption
            label="All Categories"
            checked={activeCategoryId === ""}
            onChange={() => {
              onCategoryChange("");
              setOpen(false);
            }}
          />
          {categories.map((category) => (
            <FilterOption
              key={category.id}
              label={category.name}
              checked={activeCategoryId === category.id}
              onChange={() => {
                onCategoryChange(category.id);
                setOpen(false);
              }}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 md:block">
        <div className="sticky top-[140px] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface">Filters</h2>
            {activeCategoryId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange("")}
                className="h-auto px-0 py-0 text-xs font-semibold text-primary hover:bg-transparent hover:text-on-primary-container"
              >
                Clear
              </Button>
            )}
          </div>
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
              {activeCategoryId && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  1
                </span>
              )}
            </Button>
          }
        />
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-surface-container-lowest p-0">
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
          <div className="p-4">{content}</div>
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
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-on-surface">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-primary transition-transform" />
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
        {children}
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
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <input
        type="radio"
        name="category"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer border-outline-variant text-primary accent-primary focus:ring-primary"
      />
      <span className="text-sm text-on-surface transition-colors group-hover:text-primary">{label}</span>
    </label>
  );
}
