import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { PlaceholderImage } from "@modules/common/icons/placeholder-image"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) return null

  const { cheapestPrice } = getProductPrice({ product: pricedProduct })
  const image = product.thumbnail || product.images?.[0]?.url

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group cursor-pointer block">
      <div data-testid="product-wrapper">
        {/* Image */}
        <div className="overflow-hidden rounded-xl mb-4">
          <div className="relative w-full aspect-[3/4] bg-surface-container-low">
            {image ? (
              <Image
                src={image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                data-testid="product-image"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlaceholderImage size={isFeatured ? 24 : 16} />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <h4
          className="font-semibold text-on-surface text-sm leading-snug mb-1"
          data-testid="product-title"
        >
          {product.title}
        </h4>
        {cheapestPrice && (
          <p className="text-on-surface-variant text-sm" data-testid="price">
            {cheapestPrice.calculated_price}
          </p>
        )}
      </div>
    </LocalizedClientLink>
  )
}
