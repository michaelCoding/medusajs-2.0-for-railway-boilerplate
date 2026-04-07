"use client"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div>
      {/* ── Section header ── */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={[
            "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold",
            isOpen ? "bg-[#6f4627] text-white" : "bg-[#e8e4dc] text-[#9b9590]",
          ].join(" ")}
        >
          04
        </div>
        <h2
          className={[
            "font-lora text-[20px] leading-none transition-colors",
            isOpen ? "text-[#1c1c1a]" : "text-[#9b9590]",
          ].join(" ")}
        >
          Review &amp; Place Order
        </h2>
      </div>

      {isOpen && previousStepsCompleted && (
        <div className="pb-8">
          <p className="text-xs text-[#9b9590] leading-relaxed mb-6 max-w-md">
            By placing your order, you confirm that you have read, understand and
            accept our Terms of Use, Terms of Sale and Returns Policy, and
            acknowledge that you have read The Woodenly&apos;s Privacy Policy.
          </p>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </div>
      )}
    </div>
  )
}

export default Review
