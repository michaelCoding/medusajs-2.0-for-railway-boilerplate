import React, { Suspense } from 'react'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductActions from '@modules/products/components/product-actions'
import ProductOnboardingCta from '@modules/products/components/product-onboarding-cta'
import ProductTabs from '@modules/products/components/product-tabs'
import RelatedProducts from '@modules/products/components/related-products'
import ProductInfo from '@modules/products/templates/product-info'
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
    <div className="bg-[var(--scandi-bg)] min-h-screen">
      {/* Main product section */}
      <div
        className="content-container py-10 flex flex-col medium:flex-row gap-8 large:gap-16"
        data-testid="product-container"
      >
        {/* Left: Image gallery — takes majority of width */}
        <div className="w-full medium:w-[55%] large:w-[60%]">
          <ImageGallery images={product?.images || []} />
        </div>

        {/* Right: Info + actions — sticky on desktop */}
        <div className="w-full medium:w-[45%] large:w-[40%] medium:sticky medium:top-24 medium:self-start flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <ProductOnboardingCta />
            <ProductInfo product={product} />
          </div>

          <Suspense
            fallback={<ProductActions disabled product={product} region={region} />}
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <ProductTabs product={product} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E8E4DC]" />

      {/* Related products */}
      <div
        className="content-container py-16 large:py-24"
        data-testid="related-products-container"
      >
        <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-3">You may also like</p>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
