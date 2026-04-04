'use client'

import { useState } from 'react'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import NavActions from './nav-actions'

export default function NavContent({
  productCategories,
  collections,
  countryCode,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
  countryCode: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Brand */}
      <LocalizedClientLink
        href="/"
        className="font-lora text-xl tracking-tight text-[#1C1C1A]"
      >
        Solace
      </LocalizedClientLink>

      {/* Desktop nav links */}
      <div className="hidden medium:flex items-center gap-10">
        {collections.slice(0, 4).map((c) => (
          <LocalizedClientLink
            key={c.id}
            href={`/collections/${c.handle}`}
            className="text-sm uppercase tracking-[0.08em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors duration-200"
          >
            {c.title}
          </LocalizedClientLink>
        ))}
        <LocalizedClientLink
          href="/blog"
          className="text-sm uppercase tracking-[0.08em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors duration-200"
        >
          Journal
        </LocalizedClientLink>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <NavActions />
        {/* Mobile hamburger */}
        <button
          className="medium:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-[#1C1C1A]" />
          <span className="block w-5 h-px bg-[#1C1C1A]" />
          <span className="block w-3 h-px bg-[#1C1C1A]" />
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--scandi-bg)] flex flex-col p-8">
          <button
            className="self-end text-[#1C1C1A] text-2xl mb-12"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav className="flex flex-col gap-8">
            {collections.slice(0, 4).map((c) => (
              <LocalizedClientLink
                key={c.id}
                href={`/collections/${c.handle}`}
                className="font-lora text-3xl text-[#1C1C1A]"
                onClick={() => setMobileOpen(false)}
              >
                {c.title}
              </LocalizedClientLink>
            ))}
            <LocalizedClientLink
              href="/blog"
              className="font-lora text-3xl text-[#1C1C1A]"
              onClick={() => setMobileOpen(false)}
            >
              Journal
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="font-lora text-3xl text-[#1C1C1A]"
              onClick={() => setMobileOpen(false)}
            >
              Shop All
            </LocalizedClientLink>
          </nav>
        </div>
      )}
    </>
  )
}
