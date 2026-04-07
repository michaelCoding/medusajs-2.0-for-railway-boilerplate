import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="font-body text-sm text-[var(--scandi-fg-muted,#6B6860)] leading-relaxed space-y-2">
      <p>
        Your order has been received and is being prepared with care in our
        atelier. A confirmation has been sent to{" "}
        <span
          className="font-semibold text-[var(--scandi-fg,#1C1C1A)]"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
        <span>
          <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--scandi-fg-muted)]">
            Date&nbsp;
          </span>
          <span
            className="text-[var(--scandi-fg,#1C1C1A)] font-medium"
            data-testid="order-date"
          >
            {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </span>

        <span>
          <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--scandi-fg-muted)]">
            Order&nbsp;
          </span>
          <span
            className="text-[var(--scandi-fg,#1C1C1A)] font-medium"
            data-testid="order-id"
          >
            #{order.display_id}
          </span>
        </span>
      </div>

      {showStatus && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
          <span>
            <span className="text-[11px] uppercase tracking-[0.15em]">Status&nbsp;</span>
            <span
              className="font-medium text-[var(--scandi-fg,#1C1C1A)]"
              data-testid="order-status"
            >
              {formatStatus(order.fulfillment_status ?? "pending")}
            </span>
          </span>
          <span>
            <span className="text-[11px] uppercase tracking-[0.15em]">Payment&nbsp;</span>
            <span
              className="font-medium text-[var(--scandi-fg,#1C1C1A)]"
              data-testid="order-payment-status"
            >
              {formatStatus(order.payment_status ?? "pending")}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
