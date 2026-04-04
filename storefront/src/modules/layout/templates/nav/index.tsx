import { listCategories } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import NavContent from './nav-content'

export default async function NavWrapper({ countryCode }: { countryCode: string }) {
  const [productCategories, { collections }] = await Promise.all([
    listCategories(),
    getCollectionsList(),
  ])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E8E4DC] bg-[var(--scandi-bg)]/90 backdrop-blur-sm transition-all duration-300">
      <div className="content-container flex items-center justify-between h-16 medium:h-20">
        <NavContent
          productCategories={productCategories ?? []}
          collections={collections ?? []}
          countryCode={countryCode}
        />
      </div>
    </nav>
  )
}
