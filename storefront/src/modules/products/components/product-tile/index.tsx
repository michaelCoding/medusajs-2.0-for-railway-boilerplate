import { useMemo } from 'react'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { LoadingImage } from './loading-image'
import ProductPrice from './price'
import { ProductActions } from './action'

export function ProductTile({
  product,
  regionId,
}: {
  product: {
    id: string
    created_at: string
    title: string
    handle: string
    thumbnail: string | null
    calculatedPrice: string | null
    salePrice: string | null
  }
  regionId: string
}) {
  const isNew = useMemo(() => {
    const days = (Date.now() - new Date(product.created_at).getTime()) / 86400000
    return days <= 7
  }, [product.created_at])

  return (
    <div
      className="group flex flex-col"
      data-testid={formatNameForTestId(`${product.title}-product-tile`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F0EDE6] aspect-[3/4]">
        {isNew && (
          <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.1em] bg-[#7A9E7E] text-white px-2 py-1">
            New
          </span>
        )}
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <LoadingImage
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </LocalizedClientLink>
        {/* Quick add on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#1C1C1A]/90">
          <ProductActions productHandle={product.handle} regionId={regionId} />
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <p className="text-sm text-[#1C1C1A] leading-snug mb-1 group-hover:text-[#C07B5A] transition-colors duration-200">
            {product.title}
          </p>
        </LocalizedClientLink>
        <ProductPrice calculatedPrice={product.calculatedPrice} salePrice={product.salePrice} />
      </div>
    </div>
  )
}
