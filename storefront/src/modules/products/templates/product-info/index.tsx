import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <header className="space-y-2" id="product-info">
      {product.collection && (
        <LocalizedClientLink href={`/collections/${product.collection.handle}`}>
          <p className="text-[#586330] font-medium tracking-widest text-xs uppercase">
            {product.collection.title}
          </p>
        </LocalizedClientLink>
      )}

      <h1
        className="text-4xl large:text-5xl font-headline text-on-surface leading-tight"
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {cheapestPrice && (
        <p
          className="text-2xl font-body text-primary font-light pt-1"
          data-testid="product-price"
          data-value={cheapestPrice.calculated_price_number}
        >
          {cheapestPrice.calculated_price}
        </p>
      )}
    </header>
  )
}

export default ProductInfo
