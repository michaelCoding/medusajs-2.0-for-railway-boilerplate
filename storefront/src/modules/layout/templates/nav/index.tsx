import { listCategories } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import NavActions from './nav-actions'
import NavMobileMenu from './nav-mobile-menu'

export default async function NavWrapper({ countryCode }: { countryCode: string }) {
  const [, { collections }] = await Promise.all([
    listCategories(),
    getCollectionsList(),
  ])

  const cols = collections ?? []

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E8E4DC] bg-[var(--scandi-bg)]/90 backdrop-blur-sm transition-all duration-300">
      <div className="content-container flex items-center justify-between h-16 medium:h-20">

        {/* Brand */}
        <LocalizedClientLink
          href={`/${countryCode}`}
          className="font-lora text-xl tracking-tight text-[#1C1C1A]"
        >
          Solace
        </LocalizedClientLink>

        {/* Desktop nav links — pure server, no state needed */}
        <div className="hidden medium:flex items-center gap-10">
          {cols.slice(0, 4).map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={`/${countryCode}/collections/${c.handle}`}
              className="text-sm uppercase tracking-[0.08em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors duration-200"
            >
              {c.title}
            </LocalizedClientLink>
          ))}
          <LocalizedClientLink
            href={`/${countryCode}/blog`}
            className="text-sm uppercase tracking-[0.08em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors duration-200"
          >
            Journal
          </LocalizedClientLink>
        </div>

        {/* Right side: server actions + mobile trigger */}
        <div className="flex items-center gap-2">
          <NavActions />
          <NavMobileMenu collections={cols} />
        </div>

      </div>
    </nav>
  )
}
