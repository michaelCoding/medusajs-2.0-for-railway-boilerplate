'use client'

import { usePathname } from 'next/navigation'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Store', href: '/store' },
  { label: 'Journal', href: '/blog' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden medium:flex gap-8">
      {links.map(({ label, href }) => {
        const active =
          href === '/'
            ? /^\/[a-z]{2}(\/)?$/.test(pathname)
            : pathname.includes(href)

        return (
          <LocalizedClientLink
            key={href}
            href={href}
            className={[
              'font-medium tracking-wide transition-colors duration-300',
              active
                ? 'text-[#6f4627] border-b-2 border-[#6f4627] pb-1'
                : 'text-[#1c1c19]/60 hover:text-[#6f4627]',
            ].join(' ')}
          >
            {label}
          </LocalizedClientLink>
        )
      })}
    </nav>
  )
}
