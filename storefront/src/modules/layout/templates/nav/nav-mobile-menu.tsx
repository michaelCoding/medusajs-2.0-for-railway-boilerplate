'use client'

import { useState } from 'react'
import { StoreCollection } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function NavMobileMenu({
  collections,
}: {
  collections: StoreCollection[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger trigger */}
      <button
        className="medium:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <span className="block w-5 h-px bg-[#1C1C1A]" />
        <span className="block w-5 h-px bg-[#1C1C1A]" />
        <span className="block w-3 h-px bg-[#1C1C1A]" />
      </button>

      {/* Fullscreen overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-[#fcf9f4] flex flex-col p-8">
          <button
            className="self-end text-[#1C1C1A] text-2xl mb-12"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav className="flex flex-col gap-8">
            <LocalizedClientLink
              href="/"
              className="font-lora text-3xl text-[#1C1C1A]"
              onClick={() => setOpen(false)}
            >
              Home
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="font-lora text-3xl text-[#1C1C1A]"
              onClick={() => setOpen(false)}
            >
              Store
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/blog"
              className="font-lora text-3xl text-[#1C1C1A]"
              onClick={() => setOpen(false)}
            >
              Journal
            </LocalizedClientLink>
          </nav>
        </div>
      )}
    </>
  )
}
