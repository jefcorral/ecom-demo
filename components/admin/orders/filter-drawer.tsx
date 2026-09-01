"use client";

import { useState } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface OrderFilterValue {
  key: string;
  value: string;
}

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilters: OrderFilterValue[];
  onApply: (filters: OrderFilterValue[]) => void;
  onClear: () => void;
}

const statusOptions = ["Pending", "Designing", "Fulfilled"];
const dateOptions = ["This Week", "Last 30 Days"];
const fulfillmentOptions = ["Delivery", "Pickup", "Shipping"];
const customerOptions = ["Retail", "Event", "Subscription"];
const locationOptions = ["All Locations", "Portland", "NYC", "Seattle"];

function getDraft(activeFilters: OrderFilterValue[]) {
  const s = new Set<string>();
  const f = new Set<string>();
  let d: string | null = null;
  let c: string | null = null;
  let l = "All Locations";
  activeFilters.forEach((filter) => {
    if (filter.key === "Status" && statusOptions.includes(filter.value)) s.add(filter.value);
    if (filter.key === "Date" && dateOptions.includes(filter.value)) d = filter.value;
    if (filter.key === "Fulfillment" && fulfillmentOptions.includes(filter.value)) f.add(filter.value);
    if (filter.key === "Customer Type" && customerOptions.includes(filter.value)) c = filter.value;
    if (filter.key === "Location" && locationOptions.includes(filter.value)) l = filter.value;
  });
  return { status: s, date: d, fulfillment: f, customer: c, location: l };
}

export function OrderFilterDrawer({ open, onOpenChange, activeFilters, onApply, onClear }: FilterDrawerProps) {
  const [status, setStatus] = useState(() => getDraft(activeFilters).status);
  const [date, setDate] = useState<string | null>(() => getDraft(activeFilters).date);
  const [fulfillment, setFulfillment] = useState(() => getDraft(activeFilters).fulfillment);
  const [customer, setCustomer] = useState<string | null>(() => getDraft(activeFilters).customer);
  const [location, setLocation] = useState(() => getDraft(activeFilters).location);

  const handleApply = () => {
    const filters: OrderFilterValue[] = [];
    status.forEach((value) => filters.push({ key: "Status", value }));
    if (date) filters.push({ key: "Date", value: date });
    fulfillment.forEach((value) => filters.push({ key: "Fulfillment", value }));
    if (customer) filters.push({ key: "Customer Type", value: customer });
    if (location !== "All Locations") filters.push({ key: "Location", value: location });
    onApply(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setStatus(new Set());
    setDate(null);
    setFulfillment(new Set());
    setCustomer(null);
    setLocation("All Locations");
    onClear();
    onOpenChange(false);
  };

  const toggle = (value: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-l border-outline-variant/20 bg-surface-container-lowest p-0 sm:max-w-md">
        <SheetHeader className="border-b border-outline-variant/20 p-5">
          <SheetTitle className="font-serif text-2xl text-on-surface">Filters</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-8 overflow-y-auto p-5">
          <FilterSection title="Order Status">
            <div className="space-y-3">
              {statusOptions.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-3">
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                      status.has(option)
                        ? "border-secondary bg-secondary text-on-secondary"
                        : "border-outline-variant bg-surface-container-low"
                    )}
                  >
                    {status.has(option) && <X className="h-3.5 w-3.5" />}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={status.has(option)}
                    onChange={() => toggle(option, status, setStatus)}
                  />
                  <span className="text-sm text-on-surface">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Date Range">
            <div className="grid grid-cols-2 gap-3">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setDate(date === option ? null : option)}
                  className={cn(
                    "h-12 rounded-full text-sm font-medium transition-colors",
                    date === option
                      ? "bg-secondary-container text-on-secondary-container border border-secondary/20"
                      : "bg-surface-container text-on-surface border border-outline-variant/30"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="mt-3 flex h-12 w-full items-center gap-3 rounded-full border border-outline-variant/40 bg-surface-container-low px-4 text-sm text-on-surface hover:bg-surface-container transition-colors">
              <Calendar className="h-4 w-4" />
              Select custom range...
            </button>
          </FilterSection>

          <FilterSection title="Fulfillment">
            <div className="flex flex-wrap gap-2">
              {fulfillmentOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggle(option, fulfillment, setFulfillment)}
                  className={cn(
                    "h-10 rounded-full px-4 text-sm font-medium transition-colors",
                    fulfillment.has(option)
                      ? "bg-secondary-container text-on-secondary-container border border-secondary/20"
                      : "bg-surface-container text-on-surface border border-outline-variant/30"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Customer Type">
            <div className="space-y-3">
              {customerOptions.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-3">
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                      customer === option
                        ? "border-secondary bg-secondary"
                        : "border-outline-variant bg-surface-container-low"
                    )}
                  >
                    {customer === option && <div className="h-2 w-2 rounded-full bg-on-secondary" />}
                  </div>
                  <input
                    type="radio"
                    name="customer-type"
                    className="sr-only"
                    checked={customer === option}
                    onChange={() => setCustomer(option)}
                  />
                  <span className="text-sm text-on-surface">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Location">
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-outline-variant/40 bg-surface-container-low px-4 pr-10 text-sm text-on-surface outline-none"
              >
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            </div>
          </FilterSection>
        </div>

        <SheetFooter className="border-t border-outline-variant/20 p-5">
          <div className="flex w-full gap-4">
            <Button
              onClick={handleClear}
              variant="ghost"
              className="flex-1 rounded-full py-6 text-base font-medium text-on-surface hover:bg-surface-container"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApply}
              className="flex-[2] rounded-full bg-primary py-6 text-base font-medium text-on-primary hover:shadow-md"
            >
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">{title}</h3>
      {children}
    </div>
  );
}
