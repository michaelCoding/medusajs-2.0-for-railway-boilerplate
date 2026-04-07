"use client"

import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  fulfilled:           { label: "Fulfilled",  bg: "#d4ede4", color: "#2d6b4f" },
  shipped:             { label: "Shipped",    bg: "#d4ede4", color: "#2d6b4f" },
  not_fulfilled:       { label: "Processing", bg: "#fef3e2", color: "#8a5a0a" },
  pending:             { label: "Pending",    bg: "#fef3e2", color: "#8a5a0a" },
  cancelled:           { label: "Cancelled",  bg: "#fef0f0", color: "#c0392b" },
  returned:            { label: "Returned",   bg: "#f0edf8", color: "#5a4080" },
  partially_fulfilled: { label: "Partial",    bg: "#fef3e2", color: "#8a5a0a" },
}

const OrderCard = ({ order }: OrderCardProps) => {
  const totalItems = useMemo(
    () => order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [order]
  )

  const statusKey = order.fulfillment_status ?? "pending"
  const statusStyle = STATUS_CONFIG[statusKey] ?? {
    label: statusKey.replace(/_/g, " "),
    bg: "#f0ede8",
    color: "#6b6860",
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const previewItems = order.items?.slice(0, 4) ?? []
  const extraCount = Math.max(0, (order.items?.length ?? 0) - 4)

  return (
    <LocalizedClientLink
      href={`/account/orders/details/${order.id}`}
      data-testid="order-card"
      className="group block"
    >
      <div
        className="relative bg-[#faf7f3] border border-[#e8e4dc] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_6px_28px_rgba(28,28,26,0.09)] hover:-translate-y-0.5"
        style={{ borderLeft: "3px solid #6f4627" }}
      >
        <div className="p-6">

          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-lora text-[21px] text-[#1c1c1a] leading-none mb-1.5">
                Order{" "}
                <span data-testid="order-display-id" className="text-[#6f4627]">
                  #{order.display_id}
                </span>
              </p>
              <p className="text-xs text-[#9b9590]" data-testid="order-created-at">
                {formattedDate}
              </p>
            </div>
            <span
              className="text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full capitalize"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
            >
              {statusStyle.label}
            </span>
          </div>

          {/* ── Product thumbnails ── */}
          {previewItems.length > 0 && (
            <div className="flex gap-2.5 mb-5" data-testid="order-items">
              {previewItems.map((item) => (
                <div
                  key={item.id}
                  className="w-14 h-14 rounded-xl overflow-hidden bg-[#ede9e2] flex-shrink-0"
                  data-testid="order-item"
                >
                  <Thumbnail thumbnail={item.thumbnail} images={[]} size="full" />
                </div>
              ))}
              {extraCount > 0 && (
                <div className="w-14 h-14 rounded-xl bg-[#ede9e2] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-[#9b9590]">+{extraCount}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e8e4dc]">
            <div className="flex items-baseline gap-2">
              <span
                className="text-[15px] font-semibold text-[#1c1c1a]"
                data-testid="order-amount"
              >
                {convertToLocale({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </span>
              <span className="text-xs text-[#9b9590]">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <span
              className="flex items-center gap-1 text-xs text-[#6f4627] group-hover:gap-2 transition-all duration-200"
              data-testid="order-details-link"
            >
              View details
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6h8M7 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default OrderCard
