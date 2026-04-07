import { isStripe, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

import Divider from "@modules/common/components/divider"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  if (!payment) return null

  return (
    <div className="mb-9">
      <p className="font-headline text-[1.15rem] text-[var(--scandi-fg,#1C1C1A)] mb-7 tracking-wide">
        Payment
      </p>

      <div className="grid grid-cols-3 gap-6 font-body text-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--scandi-fg-muted,#6B6860)] mb-2">
            Method
          </p>
          <p
            className="text-[var(--scandi-fg-muted,#6B6860)]"
            data-testid="payment-method"
          >
            {paymentInfoMap[payment.provider_id]?.title ?? payment.provider_id}
          </p>
        </div>

        <div className="col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--scandi-fg-muted,#6B6860)] mb-2">
            Details
          </p>
          <div
            className="flex items-center gap-2 text-[var(--scandi-fg-muted,#6B6860)]"
            data-testid="payment-amount"
          >
            {paymentInfoMap[payment.provider_id]?.icon && (
              <span className="flex items-center justify-center h-6 w-9 bg-[var(--scandi-bg-card,#F0EDE6)] rounded">
                {paymentInfoMap[payment.provider_id].icon}
              </span>
            )}
            <span>
              {isStripe(payment.provider_id) && payment.data?.card_last4
                ? `**** **** **** ${payment.data.card_last4}`
                : `${convertToLocale({
                    amount: payment.amount,
                    currency_code: order.currency_code,
                  })} paid ${new Date(payment.created_at ?? "").toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}`}
            </span>
          </div>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
