"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) return "address"
  else if (cart?.shipping_methods?.length === 0) return "delivery"
  else return "payment"
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="bg-[#faf7f3] rounded-2xl border border-[#e8e4dc] p-6 flex flex-col gap-5">
      <h2 className="font-lora text-[20px] text-[#1c1c1a]">Order Summary</h2>

      <CartTotals totals={cart} />

      <DiscountCode cart={cart} />

      <LocalizedClientLink href={"/checkout?step=" + step} data-testid="checkout-button">
        <button className="w-full py-3.5 bg-[#1c1c1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2a] transition-all duration-200 flex items-center justify-center gap-2">
          Proceed to Checkout
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </LocalizedClientLink>

      <p className="text-[11px] text-[#9b9590] text-center leading-relaxed">
        Secure checkout — your information is always protected
      </p>
    </div>
  )
}

export default Summary
