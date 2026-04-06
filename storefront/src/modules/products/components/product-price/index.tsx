import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-surface-container-high animate-pulse rounded" />
  }

  return (
    <div className="flex flex-col gap-0.5">
      <p
        className="text-2xl font-body text-primary font-light"
        data-testid="product-price"
        data-value={selectedPrice.calculated_price_number}
      >
        {!variant && "From "}
        {selectedPrice.calculated_price}
      </p>
      {selectedPrice.price_type === "sale" && (
        <p className="text-sm text-on-surface-variant line-through" data-testid="original-product-price">
          {selectedPrice.original_price}
        </p>
      )}
    </div>
  )
}
