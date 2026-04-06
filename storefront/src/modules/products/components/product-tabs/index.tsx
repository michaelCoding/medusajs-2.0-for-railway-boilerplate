"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

type AccordionItemProps = {
  title: string
  children: React.ReactNode
}

function AccordionItem({ title, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 font-semibold text-sm text-on-surface-variant uppercase tracking-widest text-left"
      >
        <span>{title}</span>
        <span
          className="material-symbols-outlined transition-transform duration-200"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24", transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="pb-4 text-on-surface-variant leading-relaxed text-sm">
          {children}
        </div>
      )}
    </div>
  )
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const materialContent = [
    product.material && `Material: ${product.material}`,
    product.origin_country && `Country of origin: ${product.origin_country}`,
    product.type && `Type: ${product.type.value}`,
    product.weight && `Weight: ${product.weight} g`,
    product.length && product.width && product.height &&
      `Dimensions: ${product.length}L × ${product.width}W × ${product.height}H`,
  ]
    .filter(Boolean)
    .join(". ")

  return (
    <div className="w-full pt-8 space-y-4 border-t border-outline-variant/20">
      <AccordionItem title="Material Details">
        {materialContent
          ? materialContent
          : "Hand-selected solid wood sourced from sustainable forests. Finished with a food-safe blend of natural beeswax and linseed oil."}
      </AccordionItem>
      <AccordionItem title="Care Instructions">
        Hand wash with mild soap and lukewarm water. Do not soak. Occasional oiling with food-grade mineral oil will preserve the wood's luster.
      </AccordionItem>
      <AccordionItem title="Shipping & Returns">
        Your package will arrive in 3–5 business days. We offer simple exchanges and easy returns — no questions asked.
      </AccordionItem>
    </div>
  )
}

export default ProductTabs
