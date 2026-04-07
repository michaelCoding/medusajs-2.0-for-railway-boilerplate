import React, { Suspense } from 'react'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductActions from '@modules/products/components/product-actions'
import ProductOnboardingCta from '@modules/products/components/product-onboarding-cta'
import ProductTabs from '@modules/products/components/product-tabs'
import RelatedProducts from '@modules/products/components/related-products'
import ProductInfo from '@modules/products/templates/product-info'
import ProductReviews from '@modules/products/components/product-reviews'
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products'
import { notFound } from 'next/navigation'
import ProductActionsWrapper from './product-actions-wrapper'
import { HttpTypes } from '@medusajs/types'

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, region, countryCode }) => {
  if (!product || !product.id) return notFound()

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Main product section ─────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-6 large:px-12 pt-32 pb-20 grid grid-cols-1 large:grid-cols-12 gap-16"
        data-testid="product-container"
      >
        {/* Left: Image gallery — 7 cols on large+ */}
        <div className="large:col-span-7">
          <ImageGallery images={product.images || []} />
        </div>

        {/* Right: Product panel — 5 cols on large+, sticky */}
        <div className="large:col-span-5 large:sticky large:top-32 large:h-fit">
          <div className="space-y-8">
            <ProductOnboardingCta />
            <ProductInfo product={product} />

            <Suspense
              fallback={<ProductActions disabled product={product} region={region} />}
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            <ProductTabs product={product} />
          </div>
        </div>
      </div>

      {/* ── Customer reviews ──────────────────────────────────── */}
      <ProductReviews />

      {/* ── Related products ──────────────────────────────────── */}
      <section
        className="py-24 max-w-7xl mx-auto px-6 large:px-12"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </section>
    </div>
  )
}

export default ProductTemplate
