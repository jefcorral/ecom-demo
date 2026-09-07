"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  Calendar,
  Clock,
  Edit,
  Heart,
  Mail,
  MapPin,
  MoreHorizontal,
  NotepadText,
  Package,
  Palette,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AdminCustomer,
  CustomerOrder,
  CustomerPreferences,
  GiftRecipient,
  SupportTicket,
  addAdminCustomerNote,
  disableAdminCustomer,
  enableAdminCustomer,
  segmentLabel,
  ticketStatusColor,
  ticketTypeLabel,
} from "@/lib/admin-customers";

type DetailMode = "overview" | "orders" | "notes" | "support";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const segmentConfig = {
  vip: { chip: "bg-primary-container text-on-primary-container", dot: "bg-primary", icon: Star },
  active: { chip: "bg-secondary-container text-on-secondary-container", dot: "bg-secondary", icon: User },
  recent: { chip: "bg-tertiary-container text-on-tertiary-container", dot: "bg-tertiary", icon: Clock },
  inactive: { chip: "bg-surface-container-high text-on-surface-variant", dot: "bg-outline", icon: User },
  new: { chip: "bg-surface-container text-on-surface", dot: "bg-on-surface-variant", icon: Sparkles },
};

export function CustomerDetailContent({ customer: initialCustomer }: { customer: AdminCustomer }) {
  const [customer, setCustomer] = useState(initialCustomer);
  const [mode, setMode] = useState<DetailMode>("overview");
  const [noteDraft, setNoteDraft] = useState("");
  const [noteBusy, setNoteBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDisable, setConfirmDisable] = useState(false);
  const disabled = customer.status === "disabled";
  const SegmentIcon = segmentConfig[customer.segment].icon;

  const handleAddNote = async () => {
    if (!noteDraft.trim()) return;
    setNoteBusy(true);
    try {
      const note = await addAdminCustomerNote(customer.id, noteDraft.trim());
      setCustomer((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
      setNoteDraft("");
      toast.success("Note saved.");
    } catch {
      toast.error("Could not save note.");
    } finally {
      setNoteBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    try {
      await disableAdminCustomer(customer.id);
      setCustomer((prev) => ({ ...prev, status: "disabled" }));
      toast.success(`${customer.name} account disabled.`);
    } catch {
      toast.error("Could not disable account.");
    } finally {
      setBusy(false);
      setConfirmDisable(false);
    }
  };

  const handleEnable = async () => {
    setBusy(true);
    try {
      await enableAdminCustomer(customer.id);
      setCustomer((prev) => ({ ...prev, status: "active" }));
      toast.success(`${customer.name} account re-enabled.`);
    } catch {
      toast.error("Could not enable account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
      {disabled && (
        <div className="flex items-center gap-4 rounded-2xl border border-error/20 bg-error-container p-4 text-error" role="alert">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-error/10">
            <Ban className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-medium">Account Disabled</h2>
            <p className="text-sm">This account is currently disabled. The customer cannot log in or place new orders.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/customers"
            aria-label="Back to customers"
            className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/dashboard/customers" className="text-on-surface-variant hover:text-on-surface">
                  Customers
                </Link>
              </li>
              <li className="text-on-surface-variant">/</li>
              <li className="font-medium text-on-surface">{customer.name}</li>
            </ol>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/customers/${customer.id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "min-h-11 rounded-full px-5")}
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
          <Button className="min-h-11 rounded-full px-5">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <ProfileCard customer={customer} onDisable={() => setConfirmDisable(true)} onEnable={handleEnable} busy={busy} />
          <ContactCard customer={customer} />
          <PreferencesCard preferences={customer.preferences} />
          <AddressCard customer={customer} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="flex gap-2 overflow-x-auto border-b border-outline-variant/30 pb-1" role="tablist" aria-label="Customer sections">
            {([
              { id: "overview", label: "Overview" },
              { id: "orders", label: "Orders" },
              { id: "notes", label: "Notes" },
              { id: "support", label: "Support" },
            ] as { id: DetailMode; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => setMode(tab.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  mode === tab.id ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === "overview" && (
            <>
              <MetricsCards customer={customer} />
              <OrdersSection customer={customer} />
              <GiftRecipientsSection recipients={customer.giftRecipients} />
              <SubscriptionCard subscription={customer.subscription} />
            </>
          )}

          {mode === "orders" && <OrdersSection customer={customer} full />}

          {mode === "notes" && (
            <NotesSection
              notes={customer.notes}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onAddNote={handleAddNote}
              noteBusy={noteBusy}
            />
          )}

          {mode === "support" && <SupportSection tickets={customer.supportHistory} />}
        </div>
      </div>

      <Dialog open={confirmDisable} onOpenChange={setConfirmDisable}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
                <Ban className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="font-serif text-2xl text-error">Disable Account</DialogTitle>
                <DialogDescription>Are you sure you want to disable this account?</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <p className="text-sm text-on-surface-variant">
            {customer.name} will no longer be able to log in or place orders. You can re-enable the account later.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDisable(false)}>
              Cancel
            </Button>
            <Button disabled={busy} variant="destructive" onClick={handleDisable}>
              Confirm Disable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileCard({
  customer,
  onDisable,
  onEnable,
  busy,
}: {
  customer: AdminCustomer;
  onDisable: () => void;
  onEnable: () => void;
  busy: boolean;
}) {
  const segment = segmentConfig[customer.segment];
  const SegmentIcon = segment.icon;
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container text-3xl font-medium">
          {customer.initials}
        </div>
        <h1 className="mt-4 font-serif text-2xl">{customer.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", segment.chip)}>
            <SegmentIcon className="h-3 w-3" />
            {segmentLabel(customer.segment)}
          </span>
          {customer.status === "disabled" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-error-container px-2.5 py-1 text-xs font-medium text-error">
              <Ban className="h-3 w-3" /> Disabled
            </span>
          )}
        </div>
        <p className="mt-2 flex items-center gap-1 text-sm text-on-surface-variant">
          <MapPin className="h-3.5 w-3.5" /> {customer.location}
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <p className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Mail className="h-4 w-4" /> {customer.email}
        </p>
        <p className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Phone className="h-4 w-4" /> {customer.phone}
        </p>
        <p className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Calendar className="h-4 w-4" /> Customer since {customer.joined}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {customer.status === "disabled" ? (
          <Button disabled={busy} onClick={onEnable} className="col-span-2 min-h-11 rounded-full">
            <ShieldCheck className="h-4 w-4" /> Enable Account
          </Button>
        ) : (
          <>
            <Button disabled={busy} variant="destructive" onClick={onDisable} className="min-h-11 rounded-full">
              <Ban className="h-4 w-4" /> Disable
            </Button>
            <Button variant="outline" className="min-h-11 rounded-full">
              <Send className="h-4 w-4" /> Message
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

function ContactCard({ customer }: { customer: AdminCustomer }) {
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
        <Mail className="h-5 w-5 text-primary" /> Contact Details
      </h2>
      <dl className="space-y-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Email Address</dt>
          <dd className="mt-1 text-sm font-medium">{customer.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Phone Number</dt>
          <dd className="mt-1 text-sm font-medium">{customer.phone}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Customer Since</dt>
          <dd className="mt-1 text-sm font-medium">{customer.joined}</dd>
        </div>
      </dl>
    </section>
  );
}

function PreferencesCard({ preferences }: { preferences: CustomerPreferences }) {
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
        <Heart className="h-5 w-5 text-primary" /> Preferences
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Favorite Blooms</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.favoriteBlooms.map((bloom) => (
              <span key={bloom} className="rounded-full bg-secondary-container px-3 py-1 text-sm text-on-secondary-container">
                {bloom}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Style Profile</p>
            <p className="mt-1 inline-block rounded-full bg-surface-container px-3 py-1 text-sm">{preferences.styleProfile}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Color Palette</p>
            <p className="mt-1 inline-block rounded-full bg-surface-container px-3 py-1 text-sm">{preferences.colorPalette}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Allergies / Avoid</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.allergies.length > 0 ? (
              preferences.allergies.map((allergy) => (
                <span key={allergy} className="rounded-full bg-error-container px-3 py-1 text-sm text-error">
                  {allergy}
                </span>
              ))
            ) : (
              <span className="text-sm text-on-surface-variant">No known allergies</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AddressCard({ customer }: { customer: AdminCustomer }) {
  const primary = customer.addresses.find((a) => a.isPrimary) || customer.addresses[0];
  if (!primary) return null;
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
        <MapPin className="h-5 w-5 text-primary" /> Primary Delivery Address
      </h2>
      <p className="text-sm font-medium">
        {primary.street}
        <br />
        {primary.city}, {primary.state} {primary.zip}
      </p>
      <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-surface-container text-sm text-on-surface-variant">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Map preview
        </span>
      </div>
    </section>
  );
}

function MetricsCards({ customer }: { customer: AdminCustomer }) {
  const items = [
    { label: "Lifetime Value", value: money.format(customer.totalSpend), icon: TrendingUp },
    { label: "Total Orders", value: customer.orders.toString(), icon: Package },
    { label: "Average Order", value: customer.averageOrderValue > 0 ? money.format(customer.averageOrderValue) : "—", icon: TrendingUp },
    { label: "Petal Points", value: customer.petalPoints.toLocaleString(), icon: Sparkles },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-medium uppercase tracking-widest">{item.label}</span>
            <item.icon className="h-4 w-4" />
          </div>
          <p className="font-serif text-2xl">{item.value}</p>
          {customer.segment === "vip" && item.label === "Lifetime Value" && (
            <p className="mt-1 text-xs text-primary">Top 5% Customer</p>
          )}
        </div>
      ))}
    </div>
  );
}

function OrdersSection({ customer, full = false }: { customer: AdminCustomer; full?: boolean }) {
  const orders = full ? customer.orderHistory : customer.orderHistory.slice(0, 4);
  const hasOrders = orders.length > 0;
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-serif text-xl">
          <Package className="h-5 w-5 text-primary" /> {full ? "Order History" : "Recent Orders"}
        </h2>
        {!full && hasOrders && customer.orderHistory.length > 4 && (
          <button onClick={() => {}} className="text-sm font-medium text-primary hover:underline">
            View All
          </button>
        )}
      </div>
      {!hasOrders ? (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
            <Package className="h-9 w-9 text-on-surface-variant" />
          </div>
          <h3 className="font-serif text-xl">No orders yet</h3>
          <p className="mt-1 max-w-md text-sm text-on-surface-variant">
            This customer hasn&apos;t bloomed with us quite yet. Send a welcome promotion to inspire their first purchase.
          </p>
          <Button className="mt-4 min-h-11 rounded-full">
            <Mail className="h-4 w-4" /> Send Welcome Offer
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}

function OrderRow({ order }: { order: CustomerOrder }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-container p-4">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-container-high">
          <Package className="h-5 w-5 text-on-surface-variant" />
        </div>
        <div>
          <p className="font-medium">{order.isSubscription ? "Monthly Subscription" : order.productName}</p>
          <p className="text-sm text-on-surface-variant">
            {order.id} · {order.date} · {order.items} items
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-serif text-lg">{money.format(order.total)}</p>
        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-xs text-on-secondary-container">{order.status}</span>
      </div>
    </div>
  );
}

function GiftRecipientsSection({ recipients }: { recipients: GiftRecipient[] }) {
  if (recipients.length === 0) return null;
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
        <Heart className="h-5 w-5 text-primary" /> Gift Recipients
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">
            <tr>
              <th className="pb-3">Recipient</th>
              <th className="pb-3">Relation</th>
              <th className="pb-3">Key Occasion</th>
              <th className="pb-3 text-right">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {recipients.map((r) => (
              <tr key={r.id} className="border-t border-outline-variant/30">
                <td className="py-3">{r.name}</td>
                <td className="py-3">{r.relation}</td>
                <td className="py-3">
                  {r.occasion}
                  <br />
                  <span className="text-xs text-on-surface-variant">{r.occasionDate}</span>
                </td>
                <td className="py-3 text-right">{r.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SubscriptionCard({ subscription }: { subscription: AdminCustomer["subscription"] }) {
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
        <Sparkles className="h-5 w-5 text-primary" /> Subscription
      </h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            Status: <span className={cn("capitalize", subscription.status === "active" ? "text-secondary" : "text-on-surface-variant")}>{subscription.status}</span>
          </p>
          <p className="text-sm text-on-surface-variant">{subscription.plan}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Next Delivery</p>
          <p className="text-sm text-on-surface-variant">{subscription.nextDelivery}</p>
        </div>
      </div>
    </section>
  );
}

function NotesSection({
  notes,
  noteDraft,
  setNoteDraft,
  onAddNote,
  noteBusy,
}: {
  notes: AdminCustomer["notes"];
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  onAddNote: () => void;
  noteBusy: boolean;
}) {
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
        <NotepadText className="h-5 w-5 text-primary" /> Internal Notes
      </h2>
      <div className="space-y-4">
        {notes.length === 0 && <p className="text-sm text-on-surface-variant">No notes yet.</p>}
        {notes.map((note) => (
          <div key={note.id} className="rounded-xl bg-surface-container p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-xs font-medium text-on-secondary-container">
                  {note.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="font-medium">{note.author}</span>
              </div>
              <span className="text-xs text-on-surface-variant">{note.timestamp}</span>
            </div>
            <p className="text-sm text-on-surface-variant">{note.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          placeholder="Add a note about this customer..."
          className="min-h-11 flex-1 rounded-full"
          onKeyDown={(e) => e.key === "Enter" && onAddNote()}
        />
        <Button disabled={noteBusy || !noteDraft.trim()} onClick={onAddNote} className="min-h-11 rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

function SupportSection({ tickets }: { tickets: SupportTicket[] }) {
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
        <ShieldCheck className="h-5 w-5 text-primary" /> Support & Refund History
      </h2>
      {tickets.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No support tickets or refunds on record.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-xl bg-surface-container p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">{ticketTypeLabel(ticket.type)}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ticketStatusColor(ticket.status))}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">{ticket.description}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{ticket.date}</p>
              {ticket.amount && <p className="mt-1 font-medium">{money.format(ticket.amount)}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
