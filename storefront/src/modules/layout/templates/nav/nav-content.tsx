'use client'

import { useState } from 'react'
import { cn } from '@lib/util/cn'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { SearchIcon, SolaceLogo } from '@modules/common/icons'
import SideMenu from '@modules/layout/components/side-menu'
import Navigation from './navigation'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'

export default function NavContent({
  productCategories,
  collections,
  countryCode,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
  countryCode: string
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <Box className="flex large:hidden">
        <SideMenu productCategories={productCategories} collections={collections} />
      </Box>
      {!isSearchOpen && (
        <Navigation countryCode={countryCode} productCategories={productCategories} collections={collections} />
      )}
      <Box className={cn('relative block', {
        'medium:absolute medium:left-1/2 medium:top-1/2 medium:-translate-x-1/2 medium:-translate-y-1/2': !isSearchOpen,
      })}>
        <LocalizedClientLink href="/">
          <SolaceLogo className="h-6 medium:h-7" />
        </LocalizedClientLink>
      </Box>
      {!isSearchOpen && (
        <Button
          variant="icon"
          withIcon
          className="ml-auto h-auto !p-2 xsmall:!p-3.5"
          onClick={() => setIsSearchOpen(true)}
          data-testid="search-button"
        >
          <SearchIcon />
        </Button>
      )}
    </>
  )
}
