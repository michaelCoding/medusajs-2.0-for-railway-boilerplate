'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type SortOptions = 'created_at' | 'price_asc' | 'price_desc'

const categories = ['All', 'Tableware', 'Decor', 'Furniture', 'Kitchenware']
const materials = ['Walnut', 'Oak', 'Maple']

export default function StoreFilterBar({ sortBy }: { sortBy: SortOptions }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set('sortBy', value)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="sticky top-[72px] z-40 bg-[#fcf9f4] py-6 mt-4 border-b border-[#d5c3b8]/20">
      <div className="flex flex-col medium:flex-row medium:items-center justify-between gap-6 px-8 max-w-screen-2xl mx-auto">

        {/* Category + material pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#51443c] mr-2">Filter:</span>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={[
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  cat === 'All'
                    ? 'bg-[#ebe8e3] text-[#1c1c19]'
                    : 'bg-[#f0ede8] text-[#51443c] hover:bg-[#e5e2dd]',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-[#d5c3b8]/40 mx-2 hidden medium:block" />

          {/* Material pills */}
          <div className="flex flex-wrap gap-2">
            {materials.map((mat) => (
              <button
                key={mat}
                className="px-4 py-1.5 rounded-full border border-[#d5c3b8]/30 text-[#51443c] text-sm font-medium hover:bg-[#f0ede8] transition-colors"
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[#51443c]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border-none text-sm font-medium focus:ring-1 focus:ring-[#6f4627]/30 rounded-lg pr-10 text-[#1c1c19]"
          >
            <option value="created_at">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

      </div>
    </div>
  )
}
