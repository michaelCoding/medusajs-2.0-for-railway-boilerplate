'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

interface InlineProductCardProps {
  handle: string
  /** Optional: pass pre-fetched data to avoid client fetch */
  product?: {
    title: string
    thumbnail: string | null
    price: string | null
  }
}

export function InlineProductCard({ handle, product: staticProduct }: InlineProductCardProps) {
  const [product, setProduct] = useState(staticProduct ?? null)

  useEffect(() => {
    if (staticProduct || !handle) return
    // Fetch from storefront API when no static data provided
    fetch(`/api/products/${handle}`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch(() => null)
  }, [handle, staticProduct])

  if (!product) return null

  return (
    <aside className="my-8 border border-[#E8E4DC] bg-[#F0EDE6] p-4 flex gap-4 items-center not-prose">
      {product.thumbnail && (
        <div className="relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <p className="text-xs uppercase tracking-[0.08em] text-[#6B6860]">Featured product</p>
        <p className="text-sm font-medium text-[#1C1C1A] truncate">{product.title}</p>
        {product.price && (
          <p className="text-sm text-[#6B6860]">{product.price}</p>
        )}
        <LocalizedClientLink
          href={`/products/${handle}`}
          className="text-xs uppercase tracking-[0.1em] border border-[#1C1C1A] px-3 py-1.5 w-max text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-[#F7F4EF] transition-colors duration-200"
        >
          View product
        </LocalizedClientLink>
      </div>
    </aside>
  )
}
