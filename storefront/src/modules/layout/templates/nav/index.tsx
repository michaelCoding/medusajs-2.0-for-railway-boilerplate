import { Suspense } from 'react'
import { listRegions } from '@lib/data/regions'
import { StoreRegion } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import CartButton from '@modules/layout/components/cart-button'
import SideMenu from '@modules/layout/components/side-menu'
import { ThemeSwitcher } from '@modules/common/components/theme-switcher'

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto border-b border-basic-primary bg-primary duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Mobile: side menu */}
          <div className="flex large:hidden">
            <SideMenu regions={regions} />
          </div>

          {/* Logo - centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <LocalizedClientLink
              href="/"
              className="text-md font-semibold text-action-primary hover:text-action-primary-hover uppercase tracking-widest transition-colors"
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          {/* Desktop: nav links (left side) */}
          <div className="hidden large:flex items-center gap-6 h-full">
            {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
              <LocalizedClientLink
                className="text-md text-action-primary hover:text-action-primary-hover transition-colors"
                href="/search"
                scroll={false}
                data-testid="nav-search-link"
              >
                Search
              </LocalizedClientLink>
            )}
            <LocalizedClientLink
              className="text-md text-action-primary hover:text-action-primary-hover transition-colors"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
          </div>

          {/* Right: theme switcher + cart */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeSwitcher />
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 text-md text-action-primary hover:text-action-primary-hover"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
