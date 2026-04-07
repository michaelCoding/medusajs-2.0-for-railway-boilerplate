"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
}

const ItemsPreviewTemplate = ({ items }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4

  return (
    <div className={hasOverflow ? "max-h-[380px] overflow-y-auto no-scrollbar" : ""}>
      {items
        ? items
            .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
            .map((item) => <Item key={item.id} item={item} type="preview" />)
        : repeat(3).map((i) => <SkeletonLineItem key={i} />)}
    </div>
  )
}

export default ItemsPreviewTemplate
