"use client"

import { Popover, Transition } from "@headlessui/react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="relative z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative">
        <Popover.Button
          className="relative p-2 rounded-full hover:bg-[#f0ede8] transition-colors duration-200 outline-none"
          data-testid="nav-cart-link"
          aria-label="Shopping bag"
        >
          <span
            className="material-symbols-outlined text-[#6f4627]"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24", fontSize: '22px' }}
          >
            shopping_bag
          </span>
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-[#6f4627] text-white rounded-full text-[10px] font-semibold flex items-center justify-center leading-none">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Popover.Button>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+12px)] right-0 w-[400px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(28,28,25,0.12)] border border-[#d5c3b8]/20 overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ede8]">
              <h3 className="font-lora text-lg text-[#1c1c19]">Your Bag</h3>
              {totalItems > 0 && (
                <span className="text-xs text-[#83746b] tracking-widest uppercase">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-auto max-h-[360px] px-6 py-4 space-y-5 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                    .map((item) => (
                      <div
                        className="flex gap-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.variant?.product?.handle}`}
                          className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#f0ede8]"
                        >
                          <Thumbnail
                            thumbnail={item.variant?.product?.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-[#1c1c19] truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.variant?.product?.handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h4>
                              <LineItemPrice item={item} style="tight" />
                            </div>
                            <LineItemOptions
                              variant={item.variant}
                              data-testid="cart-item-variant"
                              data-value={item.variant}
                            />
                            <p className="text-xs text-[#83746b] mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="text-xs text-[#6f4627]/60 hover:text-[#6f4627] transition-colors w-fit"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="px-6 py-5 border-t border-[#f0ede8] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#51443c]">
                      Subtotal <span className="text-xs text-[#83746b]">(excl. taxes)</span>
                    </span>
                    <span
                      className="font-semibold text-[#1c1c19]"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink
                    href="/cart"
                    className="block w-full text-center py-3.5 bg-gradient-to-r from-[#6f4627] to-[#8b5e3c] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                    data-testid="go-to-cart-button"
                  >
                    View Bag →
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <span
                  className="material-symbols-outlined text-[#d5c3b8] mb-4"
                  style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}
                >
                  shopping_bag
                </span>
                <p className="font-lora text-lg text-[#1c1c19] mb-1">Your bag is empty</p>
                <p className="text-sm text-[#83746b] mb-6">Discover handcrafted pieces for your space</p>
                <LocalizedClientLink
                  href="/store"
                  className="px-6 py-2.5 border border-[#6f4627] text-[#6f4627] rounded-full text-sm font-semibold hover:bg-[#6f4627] hover:text-white transition-all duration-200"
                  onClick={close}
                >
                  Explore the Store
                </LocalizedClientLink>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
