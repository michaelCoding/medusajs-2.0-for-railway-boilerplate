"use client"

import { CheckCircleSolid } from "@medusajs/icons"
import { useToggleState } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Spinner } from "@modules/common/icons/spinner"
import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const StepBadge = ({
  num,
  active,
  completed,
}: {
  num: string
  active: boolean
  completed: boolean
}) => (
  <div
    className={[
      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold transition-all",
      completed
        ? "bg-[#d4ede4] text-[#2d6b4f]"
        : active
        ? "bg-[#6f4627] text-white"
        : "bg-[#e8e4dc] text-[#9b9590]",
    ].join(" ")}
  >
    {completed ? (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      num
    )}
  </div>
)

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"
  const completed = !!(cart?.shipping_address && !isOpen)

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div>
      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StepBadge num="01" active={isOpen} completed={completed} />
          <h2
            className={[
              "font-lora text-[20px] leading-none transition-colors",
              isOpen || completed ? "text-[#1c1c1a]" : "text-[#9b9590]",
            ].join(" ")}
          >
            Shipping Address
          </h2>
        </div>
        {completed && (
          <button
            onClick={handleEdit}
            className="text-xs text-[#6f4627] hover:underline transition-colors"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>

      {/* ── Open (form) state ── */}
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <div className="flex items-center gap-3 pb-6 pt-8">
                  <div className="w-7 h-7 rounded-full bg-[#e8e4dc] flex items-center justify-center text-xs font-semibold text-[#9b9590]">
                    ↳
                  </div>
                  <h2 className="font-lora text-[18px] text-[#1c1c1a]">
                    Billing Address
                  </h2>
                </div>
                <BillingAddress cart={cart} />
              </div>
            )}

            <SubmitButton className="mt-6" data-testid="submit-address-button">
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        /* ── Closed (summary) state ── */
        <div className="text-sm text-[#6b6860]">
          {cart && cart.shipping_address ? (
            <div className="flex items-start gap-8">
              <div className="flex flex-col gap-0.5" data-testid="shipping-address-summary">
                <p className="text-xs font-semibold text-[#1c1c1a] uppercase tracking-wider mb-1.5">
                  Ship to
                </p>
                <p>{cart.shipping_address.first_name} {cart.shipping_address.last_name}</p>
                <p>{cart.shipping_address.address_1} {cart.shipping_address.address_2}</p>
                <p>{cart.shipping_address.postal_code}, {cart.shipping_address.city}</p>
                <p>{cart.shipping_address.country_code?.toUpperCase()}</p>
              </div>

              <div className="flex flex-col gap-0.5" data-testid="shipping-contact-summary">
                <p className="text-xs font-semibold text-[#1c1c1a] uppercase tracking-wider mb-1.5">
                  Contact
                </p>
                <p>{cart.shipping_address.phone}</p>
                <p>{cart.email}</p>
              </div>

              <div className="flex flex-col gap-0.5" data-testid="billing-address-summary">
                <p className="text-xs font-semibold text-[#1c1c1a] uppercase tracking-wider mb-1.5">
                  Billing
                </p>
                {sameAsBilling ? (
                  <p className="text-[#9b9590]">Same as shipping</p>
                ) : (
                  <>
                    <p>{cart.billing_address?.first_name} {cart.billing_address?.last_name}</p>
                    <p>{cart.billing_address?.address_1} {cart.billing_address?.address_2}</p>
                    <p>{cart.billing_address?.postal_code}, {cart.billing_address?.city}</p>
                    <p>{cart.billing_address?.country_code?.toUpperCase()}</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      )}

      <div className="h-px bg-[#e8e4dc] mt-8" />
    </div>
  )
}

export default Addresses
