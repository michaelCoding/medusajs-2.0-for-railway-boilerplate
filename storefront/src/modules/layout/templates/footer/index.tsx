'use client'

import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1A] text-[#F7F4EF]">
      <div className="content-container py-16 medium:py-20">
        <div className="grid grid-cols-1 gap-12 medium:grid-cols-4">
          {/* Brand blurb */}
          <div className="medium:col-span-1">
            <p className="font-lora text-xl mb-4">The Woodenly</p>
            <p className="text-sm text-[#F7F4EF]/60 leading-relaxed max-w-[220px]">
              Handcrafting heirloom-quality wooden wares for the intentional home.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-[#F7F4EF]/40 mb-6">Shop</p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/store', label: 'All Objects' },
                { href: '/categories', label: 'Categories' },
                { href: '/collections', label: 'Collections' },
                { href: '/shipping-returns', label: 'Shipping & Returns' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <LocalizedClientLink
                    href={href}
                    className="text-sm text-[#F7F4EF]/70 hover:text-[#F7F4EF] transition-colors duration-200"
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-[#F7F4EF]/40 mb-6">Journal</p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/blog', label: 'Stories' },
                { href: '/about-us', label: 'About Us' },
                { href: '/faq', label: 'FAQ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <LocalizedClientLink
                    href={href}
                    className="text-sm text-[#F7F4EF]/70 hover:text-[#F7F4EF] transition-colors duration-200"
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-[#F7F4EF]/40 mb-6">Stay in touch</p>
            <p className="text-sm text-[#F7F4EF]/60 mb-4 leading-relaxed">
              Seasonal notes on living well.
            </p>
            <form className="flex gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent border border-[#F7F4EF]/20 px-3 py-2 text-sm text-[#F7F4EF] placeholder-[#F7F4EF]/30 focus:outline-none focus:border-[#F7F4EF]/60"
              />
              <button
                type="submit"
                className="border border-l-0 border-[#F7F4EF]/20 px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#F7F4EF]/70 hover:bg-[#F7F4EF]/10 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F7F4EF]/10">
        <div className="content-container py-5 flex flex-col medium:flex-row items-start medium:items-center justify-between gap-3">
          <p className="text-xs text-[#F7F4EF]/30">
            © {new Date().getFullYear()} The Woodenly. Handcrafted for the Slow Life.
          </p>
          <div className="flex gap-6">
            {[
              { href: '/privacy-policy', label: 'Privacy' },
              { href: '/terms-and-conditions', label: 'Terms' },
            ].map(({ href, label }) => (
              <LocalizedClientLink
                key={href}
                href={href}
                className="text-xs text-[#F7F4EF]/30 hover:text-[#F7F4EF]/60 transition-colors"
              >
                {label}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
