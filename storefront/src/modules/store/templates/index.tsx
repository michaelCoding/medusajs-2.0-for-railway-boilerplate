import { Suspense } from 'react'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import { BannerData } from '@lib/data/cms'
import PaginatedProducts from './paginated-products'
import StoreFilterBar from './store-filter-bar'

const FALLBACK = {
  headline: "Every object, a quiet intention.",
  text: "Browse our collection of hand-turned wooden pieces.",
  cta_text: "Shop the Collection",
  cta_link: "/store",
  image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
}

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  banner,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  banner?: BannerData | null
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || 'created_at'
  const b = banner ?? FALLBACK

  return (
    <div className="bg-[#fcf9f4] min-h-screen">

      {/* CMS-controlled banner */}
      <div className="px-8 max-w-screen-2xl mx-auto">
        <section className="mt-8 rounded-xl overflow-hidden relative aspect-[21/9] medium:aspect-[21/7]">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${b.image_url}')` }}
          />
          {/* Gradient overlay from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c19]/50 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 flex items-center px-12">
            <div className="max-w-md space-y-4">
              <h2 className="font-lora text-4xl medium:text-5xl large:text-6xl text-[#fcf9f4] leading-tight">
                {b.headline}
              </h2>
              {b.text && (
                <p className="text-[#fcf9f4]/90 font-medium text-lg">{b.text}</p>
              )}
              {b.cta_text && (
                <a
                  href={b.cta_link}
                  className="mt-4 inline-block bg-[#6f4627] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#8b5e3c] transition-all"
                >
                  {b.cta_text}
                </a>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Sticky filter + sort bar */}
      <StoreFilterBar sortBy={sort} />

      {/* Product grid */}
      <div
        className="px-8 max-w-screen-2xl mx-auto py-12"
        data-testid="category-container"
      >
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>

    </div>
  )
}

export default StoreTemplate
