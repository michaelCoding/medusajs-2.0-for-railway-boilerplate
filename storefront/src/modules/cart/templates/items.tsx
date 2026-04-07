import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
}

const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
  const count = items?.length ?? 0

  return (
    <div>
      <div className="flex items-baseline justify-between pb-4 border-b border-[#e8e4dc]">
        <h2 className="font-lora text-[28px] text-[#1c1c1a]">Your Cart</h2>
        <span className="text-sm text-[#9b9590]">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      <div>
        {items
          ? items
              .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
              .map((item) => <Item key={item.id} item={item} />)
          : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
      </div>
    </div>
  )
}

export default ItemsTemplate
