import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/types"

const statusVariants: Record<OrderStatus, "muted" | "primary" | "warning" | "success" | "sale" | "error"> = {
  pending_payment: "muted",
  paid: "primary",
  payment_failed: "error",
  processing: "warning",
  shipped: "primary",
  delivered: "success",
  cancelled: "sale",
  refunded: "sale",
  partially_refunded: "warning",
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={statusVariants[status]}>{status.replaceAll("_", " ")}</Badge>
}

export { StatusBadge }
