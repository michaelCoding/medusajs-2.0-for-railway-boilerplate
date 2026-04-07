"use client"

import { RadioGroup } from "@headlessui/react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { setShippingMethod } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

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

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const selectedShippingMethod = availableShippingMethods?.find(
    (method) => method.id === cart.shipping_methods?.at(-1)?.shipping_option_id
  )

  const completed = !isOpen && (cart.shipping_methods?.length ?? 0) > 0

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = async (id: string) => {
    setIsLoading(true)
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const locked = !isOpen && (cart.shipping_methods?.length ?? 0) === 0

  return (
    <div>
      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StepBadge num="02" active={isOpen} completed={completed} />
          <h2
            className={[
              "font-lora text-[20px] leading-none transition-colors",
              isOpen || completed ? "text-[#1c1c1a]" : "text-[#9b9590]",
            ].join(" ")}
          >
            Delivery
          </h2>
        </div>
        {completed && (
          <button
            onClick={handleEdit}
            className="text-xs text-[#6f4627] hover:underline transition-colors"
            data-testid="edit-delivery-button"
          >
            Edit
          </button>
        )}
      </div>

      {/* ── Open state ── */}
      {isOpen ? (
        <div data-testid="delivery-options-container">
          <div className="pb-6">
            <RadioGroup value={selectedShippingMethod?.id ?? ""} onChange={set}>
              <div className="flex flex-col gap-2">
                {availableShippingMethods?.map((option) => (
                  <RadioGroup.Option
                    key={option.id}
                    value={option.id}
                    data-testid="delivery-option-radio"
                    className={({ checked }) =>
                      [
                        "flex items-center justify-between px-4 py-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                        checked
                          ? "border-[#6f4627] bg-[#fef9f5]"
                          : "border-[#e8e4dc] bg-white hover:border-[#c4b89a]",
                      ].join(" ")
                    }
                  >
                    {({ checked }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              checked
                                ? "border-[#6f4627]"
                                : "border-[#d4cfc7]",
                            ].join(" ")}
                          >
                            {checked && (
                              <div className="w-2 h-2 rounded-full bg-[#6f4627]" />
                            )}
                          </div>
                          <span className="text-sm text-[#1c1c1a]">{option.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1c1c1a]">
                          {convertToLocale({
                            amount: option.amount!,
                            currency_code: cart?.currency_code,
                          })}
                        </span>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>

          <ErrorMessage error={error} data-testid="delivery-option-error-message" />

          <button
            onClick={handleSubmit}
            disabled={isLoading || !cart.shipping_methods?.[0]}
            className="w-full py-3.5 bg-[#1c1c1a] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2d2a] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            data-testid="submit-delivery-option-button"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Continue to payment
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      ) : (
        /* ── Closed (summary) state ── */
        <div className="text-sm text-[#6b6860]">
          {(cart.shipping_methods?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-[#1c1c1a] uppercase tracking-wider mb-1.5">
                Method
              </p>
              <p>
                {selectedShippingMethod?.name}{" "}
                <span className="text-[#9b9590]">
                  (
                  {convertToLocale({
                    amount: selectedShippingMethod?.amount!,
                    currency_code: cart?.currency_code,
                  })}
                  )
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="h-px bg-[#e8e4dc] mt-8" />
    </div>
  )
}

export default Shipping
