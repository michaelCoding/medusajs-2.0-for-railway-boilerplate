import { Suspense } from 'react'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from './paginated-products'

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || 'created_at'

  return (
    <div className="bg-[var(--scandi-bg)] min-h-screen">
      {/* Page header */}
      <div className="content-container pt-14 pb-10 border-b border-[#E8E4DC]">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-2">Explore</p>
        <div className="flex items-end justify-between">
          <h1
            className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em]"
            data-testid="store-page-title"
          >
            All products
          </h1>
          {/* Sort/filter inline — desktop */}
          <div className="hidden medium:block">
            <RefinementList sortBy={sort} />
          </div>
        </div>
      </div>

      {/* Mobile filter */}
      <div className="medium:hidden content-container py-4 border-b border-[#E8E4DC]">
        <RefinementList sortBy={sort} />
      </div>

      {/* Product grid */}
      <div
        className="content-container py-12"
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
