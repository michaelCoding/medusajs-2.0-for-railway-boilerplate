'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createNavigation } from '@lib/constants'
import { cn } from '@lib/util/cn'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { NavigationItem } from '@modules/common/components/navigation-item'
import CollectionsMenu from './collections-menu'
import DropdownMenu from './dropdown-menu'

export default function Navigation({
  countryCode,
  productCategories,
  collections,
}: {
  countryCode: string
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
}) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<{ name: string; handle: string } | null>(null)

  const navigation = useMemo(
    () => createNavigation(productCategories, collections),
    [productCategories, collections]
  )

  return (
    <Box className="hidden gap-4 self-stretch large:flex">
      {navigation.map((item, index) => {
        const handle = item.name.toLowerCase().replace(' ', '-')
        const active = pathname.includes(`/${countryCode}/${handle}`) ||
          (handle === 'shop' && pathname.includes(`/${countryCode}/categories`))

        return (
          <DropdownMenu
            key={index}
            item={item}
            activeItem={openDropdown}
            isOpen={openDropdown?.name === item.name}
            onOpenChange={(open) => setOpenDropdown(open ? { name: item.name, handle: item.handle } : null)}
            customContent={
              item.name === 'Collections'
                ? <CollectionsMenu collections={collections} />
                : undefined
            }
          >
            <div className="flex h-full items-center">
              <NavigationItem
                href={`/${countryCode}${item.handle}`}
                className={cn('!py-2 px-2', { 'border-b border-action-primary': active })}
              >
                {item.name}
              </NavigationItem>
            </div>
          </DropdownMenu>
        )
      })}
    </Box>
  )
}
