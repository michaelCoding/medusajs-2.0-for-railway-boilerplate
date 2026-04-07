import { HttpTypes } from "@medusajs/types"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
}

const Item = ({ item }: ItemProps) => {
  return (
    <div
      className="flex items-start gap-4 py-5"
      data-testid="product-row"
    >
      {/* Thumbnail */}
      <div className="w-[64px] h-[64px] shrink-0 rounded-sm overflow-hidden bg-[var(--scandi-bg-card,#F0EDE6)]">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>

      {/* Name + variant */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className="font-body text-sm font-medium text-[var(--scandi-fg,#1C1C1A)] leading-snug"
          data-testid="product-name"
        >
          {item.title}
        </p>
        {item.variant && (
          <div className="mt-0.5 text-xs text-[var(--scandi-fg-muted,#6B6860)]">
            <LineItemOptions
              variant={item.variant}
              data-testid="product-variant"
            />
          </div>
        )}
      </div>

      {/* Qty × price + line total */}
      <div className="shrink-0 text-right font-body pt-0.5">
        <div className="text-xs text-[var(--scandi-fg-muted,#6B6860)] flex items-center gap-1 justify-end">
          <span data-testid="product-quantity">{item.quantity}</span>
          <span>×</span>
          <LineItemUnitPrice item={item} style="tight" />
        </div>
        <div className="text-sm font-semibold text-[var(--scandi-fg,#1C1C1A)] mt-0.5">
          <LineItemPrice item={item} style="tight" />
        </div>
      </div>
    </div>
  )
}

export default Item
