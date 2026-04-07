import { RadioGroup } from "@headlessui/react"
import React from "react"

import PaymentTest from "../payment-test"
import { isManual } from "@lib/constants"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isSelected = selectedPaymentOptionId === paymentProviderId

  return (
    <>
      <RadioGroup.Option
        key={paymentProviderId}
        value={paymentProviderId}
        disabled={disabled}
        className={[
          "flex flex-col gap-y-2 cursor-pointer rounded-xl border px-4 py-3.5 mb-2 transition-all duration-200",
          isSelected
            ? "border-[#6f4627] bg-[#fef9f5]"
            : "border-[#e8e4dc] bg-white hover:border-[#c4b89a]",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Custom radio dot */}
            <div
              className={[
                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                isSelected ? "border-[#6f4627]" : "border-[#d4cfc7]",
              ].join(" ")}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-[#6f4627]" />
              )}
            </div>

            <span className="text-sm text-[#1c1c1a]">
              {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
            </span>

            {isManual(paymentProviderId) && isDevelopment && (
              <PaymentTest className="hidden small:block" />
            )}
          </div>

          <span className="text-[#9b9590]">
            {paymentInfoMap[paymentProviderId]?.icon}
          </span>
        </div>

        {isManual(paymentProviderId) && isDevelopment && (
          <PaymentTest className="small:hidden text-[10px]" />
        )}
      </RadioGroup.Option>
    </>
  )
}

export default PaymentContainer
