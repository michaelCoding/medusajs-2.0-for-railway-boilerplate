import { getProductPrice } from '@lib/util/get-product-price'
import { StoreProduct } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ProductTile } from '../product-tile'
import CarouselWrapper from './carousel-wrapper'

interface ViewAllProps { link: string; text?: string }
interface ProductCarouselProps {
  products: StoreProduct[]
  regionId: string
  label?: string
  title: string
  viewAll?: ViewAllProps
  testId?: string
}

export function ProductCarousel({ products, regionId, label, title, viewAll, testId }: ProductCarouselProps) {
  return (
    <section className="content-container py-20 large:py-28 overflow-hidden" data-testid={testId}>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          {label && (
            <p className="text-xs uppercase tracking-[0.28em] text-[#6f4627]/60 font-semibold mb-4">{label}</p>
          )}
          <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em]">
            {title}
          </h2>
        </div>
        {viewAll && (
          <LocalizedClientLink
            href={viewAll.link}
            className="hidden medium:inline-flex text-xs uppercase tracking-[0.1em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors border-b border-[#6B6860] pb-px"
          >
            {viewAll.text || 'View all'} →
          </LocalizedClientLink>
        )}
      </div>

      {/* Carousel */}
      <CarouselWrapper title={title} productsCount={products.length}>
        <div className="flex gap-4">
          {products.map((item, index) => {
            const { cheapestPrice } = getProductPrice({ product: item })
            return (
              <div
                key={item.id ?? index}
                className="flex-[0_0_calc(75%-16px)] small:flex-[0_0_calc(50%-16px)] medium:flex-[0_0_calc(35%-16px)] xl:flex-[0_0_calc(28%-16px)]"
              >
                <ProductTile
                  product={{
                    id: item.id ?? '',
                    created_at: item.created_at ?? '',
                    title: item.title ?? '',
                    handle: item.handle ?? '',
                    thumbnail: item.thumbnail ?? null,
                    calculatedPrice: cheapestPrice?.calculated_price ?? null,
                    salePrice: cheapestPrice?.original_price ?? null,
                  }}
                  regionId={regionId}
                />
              </div>
            )
          })}
        </div>
      </CarouselWrapper>

      {/* Mobile view all */}
      {viewAll && (
        <div className="mt-8 text-center medium:hidden">
          <LocalizedClientLink
            href={viewAll.link}
            className="text-xs uppercase tracking-[0.1em] text-[#6B6860] border-b border-[#6B6860] pb-px"
          >
            {viewAll.text || 'View all'} →
          </LocalizedClientLink>
        </div>
      )}
    </section>
  )
}
