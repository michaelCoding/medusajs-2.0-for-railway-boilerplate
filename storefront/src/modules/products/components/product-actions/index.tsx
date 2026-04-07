"use client"

import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useRouter } from "next/navigation"
import { useIntersection } from "@lib/hooks/use-in-view"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import MobileActions from "./mobile-actions"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce((acc: Record<string, string | undefined>, varopt: any) => {
    if (varopt.option && varopt.value !== null && varopt.value !== undefined) {
      acc[varopt.option.title] = varopt.value
    }
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const countryCode = useParams().countryCode as string
  const router = useRouter()

  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({ ...prev, [title]: value }))
  }

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (selectedVariant?.manage_inventory && (selectedVariant?.inventory_quantity || 0) > 0) return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)
    try {
      await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode })
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return
    setIsBuying(true)
    try {
      await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode })
      router.push(`/${countryCode}/checkout?step=address`)
    } catch {
      setIsBuying(false)
    }
  }

  const ctaDisabled = !inStock || !selectedVariant || !!disabled || isAdding || isBuying

  return (
    <>
      {/*
        Each direct child here becomes a `space-y-8` sibling alongside
        ProductInfo (header) and ProductTabs (accordion) in the parent.
        We use `space-y-8` internally so that options and CTAs are also
        separated by 32 px — matching the source design exactly.
      */}
      <div className="space-y-8" ref={actionsRef}>

        {/* Option selectors — only shown when more than 1 variant */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="space-y-6" data-testid="product-options">
            {(product.options || []).map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={options[option.title ?? ""]}
                updateOption={setOptionValue}
                title={option.title ?? ""}
                disabled={!!disabled || isAdding || isBuying}
                variants={product.variants ?? []}
                selectedOptions={options}
              />
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          {/* Buy Now — add to cart then go to checkout */}
          <button
            onClick={handleBuyNow}
            disabled={ctaDisabled}
            data-testid="buy-now-button"
            className="w-full py-4 bg-[#6f4627] text-white rounded-md font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBuying
              ? "Redirecting…"
              : !selectedVariant
              ? "Select variant"
              : !inStock
              ? "Out of stock"
              : "Buy Now"}
          </button>

          {/* Add to Cart — stays on page */}
          <button
            onClick={handleAddToCart}
            disabled={ctaDisabled}
            data-testid="add-product-button"
            className="w-full py-4 border-2 border-[#6f4627] text-[#6f4627] rounded-md font-semibold text-lg hover:bg-[#6f4627]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding
              ? "Adding…"
              : !selectedVariant
              ? "Select variant"
              : !inStock
              ? "Out of stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </>
  )
}
