import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductsById } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import Image from "next/image"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

type StoreProductParamsWithTags = HttpTypes.StoreProductParams & {
  tags?: string[]
}

type StoreProductWithTags = HttpTypes.StoreProduct & {
  tags?: { value: string }[]
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  const queryParams: StoreProductParamsWithTags = {}
  if (region?.id) queryParams.region_id = region.id
  if (product.collection_id) queryParams.collection_id = [product.collection_id]
  const productWithTags = product as StoreProductWithTags
  if (productWithTags.tags) {
    queryParams.tags = productWithTags.tags.map((t) => t.value).filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await getProductsList({ queryParams, countryCode }).then(
    ({ response }) => response.products.filter((p) => p.id !== product.id).slice(0, 4)
  )

  if (!products.length) return null

  // Fetch priced products for price display
  const pricedProducts = region
    ? await getProductsById({ ids: products.map((p) => p.id!), regionId: region.id })
    : []

  return (
    <div>
      <div className="flex flex-col medium:flex-row justify-between items-end mb-12 gap-4">
        <div className="space-y-2">
          <p className="text-primary font-semibold tracking-widest text-xs uppercase">Curated Discovery</p>
          <h3 className="text-3xl font-headline text-on-surface">Related to this moment</h3>
        </div>
        <LocalizedClientLink
          href="/store"
          className="text-primary font-semibold border-b-2 border-primary-fixed-dim pb-1 hover:opacity-70 transition-opacity text-sm"
        >
          View All Collections
        </LocalizedClientLink>
      </div>

      <ul className="grid grid-cols-2 medium:grid-cols-4 gap-8">
        {products.map((p) => {
          const priced = pricedProducts.find((pp) => pp.id === p.id)
          const { cheapestPrice } = priced
            ? getProductPrice({ product: priced })
            : { cheapestPrice: null }

          return (
            <li key={p.id}>
              <LocalizedClientLink href={`/products/${p.handle}`} className="group cursor-pointer block">
                <div className="overflow-hidden rounded-xl mb-4">
                  <div className="relative w-full aspect-[3/4]">
                    {p.thumbnail && (
                      <Image
                        src={p.thumbnail}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </div>
                </div>
                <h4 className="font-semibold text-on-surface text-sm">{p.title}</h4>
                {cheapestPrice && (
                  <p className="text-on-surface-variant text-sm">{cheapestPrice.calculated_price}</p>
                )}
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
