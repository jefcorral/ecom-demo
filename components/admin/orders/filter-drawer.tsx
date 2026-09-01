"use client";

import { Check, Calendar, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderFilterValue {
  key: string;
  value: string;
}

export interface OrderFilterDraft {
  status: Set<string>;
  date: string | null;
  fulfillment: Set<string>;
  customer: string | null;
  location: string;
}

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: OrderFilterDraft;
  onDraftChange: (draft: OrderFilterDraft) => void;
  onApply: (filters: OrderFilterValue[]) => void;
  onClear: () => void;
}

const statusOptions = ["Pending", "Designing", "Fulfilled"];
const dateOptions = ["This Week", "Last 30 Days"];
const fulfillmentOptions = ["Delivery", "Pickup", "Shipping"];
const customerOptions = ["Retail", "Event", "Subscription"];
const locationOptions = ["All Locations", "Portland", "NYC", "Seattle"];

export function getDraft(activeFilters: OrderFilterValue[]): OrderFilterDraft {
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

export function buildFilters(draft: OrderFilterDraft): OrderFilterValue[] {
  const filters: OrderFilterValue[] = [];
  draft.status.forEach((value) => filters.push({ key: "Status", value }));
  if (draft.date) filters.push({ key: "Date", value: draft.date });
  draft.fulfillment.forEach((value) => filters.push({ key: "Fulfillment", value }));
  if (draft.customer) filters.push({ key: "Customer Type", value: draft.customer });
  if (draft.location !== "All Locations") filters.push({ key: "Location", value: draft.location });
  return filters;
}

export function OrderFilterDrawer({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onApply,
  onClear,
}: FilterDrawerProps) {
  const handleApply = () => {
    onApply(buildFilters(draft));
    onOpenChange(false);
  };

  const handleClear = () => {
    onClear();
    onOpenChange(false);
  };

  const update = (partial: Partial<OrderFilterDraft>) => {
    onDraftChange({ ...draft, ...partial });
  };

  const toggle = (value: string, key: keyof OrderFilterDraft, current: Set<string>) => {
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    update({ [key]: next } as unknown as Partial<OrderFilterDraft>);
  };

  return (
    <div className="pointer-events-none">
      <div
        onClick={() => onOpenChange(false)}
        className={cn(
          "fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-96 max-w-full flex-col bg-surface shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-5">
          <h2 className="font-serif text-2xl text-on-surface">Filters</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <section>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">Order Status</h3>
            <div className="space-y-3">
              {statusOptions.map((option) => (
                <label key={option} className="group flex cursor-pointer items-center gap-3">
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                      draft.status.has(option)
                        ? "border-secondary bg-secondary text-on-secondary"
                        : "border-outline-variant bg-surface-container-low"
                    )}
                  >
                    {draft.status.has(option) && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={draft.status.has(option)}
                    onChange={() => toggle(option, "status", draft.status)}
                  />
                  <span className="text-sm text-on-surface transition-colors group-hover:text-secondary">{option}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">Date Range</h3>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => update({ date: draft.date === option ? null : option })}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    draft.date === option
                      ? "border border-secondary/20 bg-secondary-container/30 text-on-secondary-container"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="relative flex w-full items-center rounded-xl border border-outline-variant/40 bg-surface-container-low py-2.5 pl-10 pr-4 text-left text-sm text-on-surface transition-colors hover:bg-surface-container">
              <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant/60" />
              Select custom range...
            </button>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">Fulfillment</h3>
            <div className="flex flex-wrap gap-2">
              {fulfillmentOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggle(option, "fulfillment", draft.fulfillment)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    draft.fulfillment.has(option)
                      ? "border border-secondary/20 bg-secondary-container/30 text-on-secondary-container"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">Customer Type</h3>
            <div className="space-y-3">
              {customerOptions.map((option) => (
                <label key={option} className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="customer-type"
                    className={cn(
                      "h-5 w-5 appearance-none rounded-full border bg-surface transition-all",
                      draft.customer === option
                        ? "border-[6px] border-secondary"
                        : "border-outline-variant"
                    )}
                    checked={draft.customer === option}
                    onChange={() => update({ customer: option })}
                  />
                  <span className="text-sm text-on-surface transition-colors group-hover:text-secondary">{option}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">Location</h3>
            <div className="relative">
              <select
                value={draft.location}
                onChange={(e) => update({ location: e.target.value })}
                className="w-full appearance-none rounded-xl border border-outline-variant/40 bg-surface-container-low py-2.5 pl-4 pr-10 text-base text-on-surface outline-none"
              >
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant/60" />
            </div>
          </section>
        </div>

        <div className="flex items-center gap-3 border-t border-outline-variant/30 bg-surface-container-lowest p-6">
          <button
            onClick={handleClear}
            className="flex-1 rounded-full py-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-variant/20"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-[2] rounded-full bg-primary py-3 text-sm font-medium text-on-primary shadow-md transition-colors hover:bg-primary/90"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </div>
  );
}
