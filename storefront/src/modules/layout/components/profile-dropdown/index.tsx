'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { signout } from '@lib/data/customer'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

const ProfileDropdown = ({ loggedIn }: { loggedIn: boolean }) => {
  const [open, setOpen] = useState(false)
  const { countryCode } = useParams()

  const handleLogout = async () => {
    await signout(countryCode as string)
  }

  const navItems = [
    { icon: 'package_2',  label: 'My Orders',        href: '/account/orders' },
    { icon: 'favorite',   label: 'Wishlist',          href: '/account' },
    { icon: 'settings',   label: 'Account Settings',  href: '/account/profile' },
  ]

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Popover className="relative">
        {/* Trigger */}
        <Popover.Button
          className="scale-95 active:scale-90 transition-transform text-[#6f4627] outline-none flex items-center"
          data-testid="profile-dropdown-button"
          aria-label="Account"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: loggedIn ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
          >
            account_circle
          </span>
        </Popover.Button>

        {/* Dropdown panel */}
        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            static
            className="absolute right-0 mt-4 w-72 origin-top-right z-[100]"
            data-testid={loggedIn ? 'profile-dropdown-logged-in' : 'profile-dropdown-logged-out'}
          >
            <div className="bg-[#ffffff] border border-[#d5c3b8]/20 rounded-xl shadow-[0px_20px_40px_rgba(28,28,25,0.08)] overflow-hidden">
              <div className="p-6 space-y-6">

                {/* Header */}
                <div className="space-y-4">
                  <h3 className="text-xl font-lora text-[#1c1c19]">
                    {loggedIn ? 'Welcome back' : 'Welcome back'}
                  </h3>
                  {!loggedIn && (
                    <LocalizedClientLink
                      href="/account"
                      className="block w-full bg-[#6f4627] text-white py-3 rounded-lg font-medium text-sm text-center transition-all hover:bg-[#8b5e3c] active:scale-[0.98]"
                      data-testid="profile-dropdown-sign-in-up"
                    >
                      Sign In / Register
                    </LocalizedClientLink>
                  )}
                </div>

                {/* Nav links */}
                <div className="space-y-1">
                  {navItems.map(({ icon, label, href }) => (
                    <LocalizedClientLink
                      key={href}
                      href={href}
                      className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-[#51443c] hover:bg-[#f6f3ee] hover:text-[#1c1c19] transition-colors"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '20px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}
                      >
                        {icon}
                      </span>
                      <span className="text-sm">{label}</span>
                    </LocalizedClientLink>
                  ))}

                  {loggedIn && (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-[#51443c] hover:bg-[#f6f3ee] hover:text-[#1c1c19] transition-colors w-full text-left"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '20px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}
                      >
                        logout
                      </span>
                      <span className="text-sm">Sign Out</span>
                    </button>
                  )}
                </div>

                {/* Artisan Club footer */}
                <div className="pt-4 border-t border-[#d5c3b8]/10">
                  <p className="text-[10px] uppercase tracking-widest text-[#83746b] font-bold">
                    The Artisan Club
                  </p>
                  <p className="text-xs text-[#51443c] mt-1">
                    Join for exclusive early access to new collections.
                  </p>
                </div>

              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default ProfileDropdown
