"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Spinner } from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
}

const Item = ({ item, type = "full" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { handle } = item.variant?.product ?? {}
  const maxQuantity = item.variant?.manage_inventory ? 10 : 10

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1) return
    setError(null)
    setUpdating(true)
    await updateLineItem({ lineId: item.id, quantity })
      .catch((err) => setError(err.message))
      .finally(() => setUpdating(false))
  }

  /* ── Preview mode (checkout sidebar) ── */
  if (type === "preview") {
    return (
      <div
        className="flex items-center gap-3 py-3 border-b border-[#e8e4dc] last:border-none"
        data-testid="product-row"
      >
        <LocalizedClientLink
          href={`/products/${handle}`}
          className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[#ede9e2]"
        >
          <Thumbnail
            thumbnail={item.variant?.product?.thumbnail}
            images={item.variant?.product?.images ?? []}
            size="square"
          />
        </LocalizedClientLink>

        <div className="flex-1 min-w-0">
          <p
            className="font-lora text-[13px] text-[#1c1c1a] truncate leading-snug"
            data-testid="product-title"
          >
            {item.product_title}
          </p>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>

        <div className="flex-shrink-0 text-right">
          <span className="text-[11px] text-[#9b9590]">{item.quantity}×</span>
          <div className="text-sm font-semibold text-[#1c1c1a]">
            <LineItemPrice item={item} style="tight" />
          </div>
        </div>
      </div>
    )
  }

  /* ── Full mode (cart page) ── */
  return (
    <div
      className="flex items-start gap-4 py-6 border-b border-[#e8e4dc] last:border-none"
      data-testid="product-row"
    >
      {/* Thumbnail */}
      <LocalizedClientLink
        href={`/products/${handle}`}
        className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#ede9e2] hover:opacity-90 transition-opacity"
      >
        <Thumbnail
          thumbnail={item.variant?.product?.thumbnail}
          images={item.variant?.product?.images ?? []}
          size="square"
        />
      </LocalizedClientLink>

      {/* Product info + controls */}
      <div className="flex-1 min-w-0">
        <LocalizedClientLink href={`/products/${handle}`}>
          <p
            className="font-lora text-[16px] text-[#1c1c1a] hover:text-[#6f4627] transition-colors mb-0.5"
            data-testid="product-title"
          >
            {item.product_title}
          </p>
        </LocalizedClientLink>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />

        {/* Quantity stepper + delete */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-[#e8e4dc] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => changeQuantity(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-[#9b9590] hover:text-[#1c1c1a] hover:bg-[#f0ede8] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="decrease-qty-button"
              aria-label="Decrease quantity"
            >
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <path d="M1 1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <span
              className="w-9 h-8 flex items-center justify-center text-sm text-[#1c1c1a] border-x border-[#e8e4dc] select-none"
              data-testid="item-quantity"
            >
              {updating ? <Spinner /> : item.quantity}
            </span>
            <button
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={updating || item.quantity >= maxQuantity}
              className="w-8 h-8 flex items-center justify-center text-[#9b9590] hover:text-[#1c1c1a] hover:bg-[#f0ede8] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="increase-qty-button"
              aria-label="Increase quantity"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <DeleteButton id={item.id} data-testid="product-delete-button" />
        </div>

        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right pt-0.5">
        <div
          className="text-[15px] font-semibold text-[#1c1c1a]"
          data-testid="product-total-price"
        >
          <LineItemPrice item={item} style="tight" />
        </div>
        <div className="text-xs text-[#9b9590] mt-0.5">
          <LineItemUnitPrice item={item} style="tight" /> each
        </div>
      </div>
    </div>
  )
}

export default Item
