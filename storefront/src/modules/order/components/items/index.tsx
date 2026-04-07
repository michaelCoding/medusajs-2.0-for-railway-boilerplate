import { HttpTypes } from "@medusajs/types"
import Item from "@modules/order/components/item"

type ItemsProps = {
  items: HttpTypes.StoreCartLineItem[] | HttpTypes.StoreOrderLineItem[] | null
}

const Items = ({ items }: ItemsProps) => {
  if (!items?.length) return null

  return (
    <div
      className="flex flex-col divide-y divide-[var(--scandi-border,#E8E4DC)]"
      data-testid="products-table"
    >
      {items
        .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
        .map((item) => (
          <Item key={item.id} item={item} />
        ))}
    </div>
  )
}

export default Items
