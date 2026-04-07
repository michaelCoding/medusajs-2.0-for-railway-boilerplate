import { getCollectionsList } from '@lib/data/collections'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import NavActions from './nav-actions'
import NavMobileMenu from './nav-mobile-menu'
import { NavLinks } from './nav-links'

export default async function NavWrapper({ countryCode }: { countryCode: string }) {
  const { collections } = await getCollectionsList()
  const cols = collections ?? []

  return (
    <header className="sticky top-0 w-full z-50 bg-[#fcf9f4]/80 backdrop-blur-md transition-colors duration-300">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">

        {/* Left: logo + nav */}
        <div className="flex items-center gap-12">
          <LocalizedClientLink
            href="/"
            className="font-lora text-2xl italic text-[#6f4627]"
          >
            The Woodenly
          </LocalizedClientLink>

          {/* Desktop nav — Home / Store / Journal with active state */}
          <NavLinks />
        </div>

        {/* Right: cart + account + mobile trigger */}
        <div className="flex items-center gap-2">
          <NavActions />
          <NavMobileMenu collections={cols} />
        </div>

      </div>
    </header>
  )
}
