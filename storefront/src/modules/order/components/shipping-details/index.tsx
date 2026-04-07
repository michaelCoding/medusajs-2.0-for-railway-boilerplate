import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="mb-9">
      <p className="font-headline text-[1.15rem] text-[var(--scandi-fg,#1C1C1A)] mb-7 tracking-wide">
        Delivery
      </p>

      <div className="grid grid-cols-3 gap-6 font-body text-sm">
        <div data-testid="shipping-address-summary">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--scandi-fg-muted,#6B6860)] mb-2">
            Address
          </p>
          <p className="text-[var(--scandi-fg,#1C1C1A)] leading-relaxed">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </p>
          <p className="text-[var(--scandi-fg-muted,#6B6860)] leading-relaxed">
            {order.shipping_address?.address_1}
            {order.shipping_address?.address_2
              ? `, ${order.shipping_address.address_2}`
              : ""}
          </p>
          <p className="text-[var(--scandi-fg-muted,#6B6860)] leading-relaxed">
            {order.shipping_address?.postal_code} {order.shipping_address?.city}
          </p>
          <p className="text-[var(--scandi-fg-muted,#6B6860)] leading-relaxed">
            {order.shipping_address?.country_code?.toUpperCase()}
          </p>
        </div>

        <div data-testid="shipping-contact-summary">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--scandi-fg-muted,#6B6860)] mb-2">
            Contact
          </p>
          {order.shipping_address?.phone && (
            <p className="text-[var(--scandi-fg-muted,#6B6860)] leading-relaxed">
              {order.shipping_address.phone}
            </p>
          )}
          <p className="text-[var(--scandi-fg-muted,#6B6860)] leading-relaxed">
            {order.email}
          </p>
        </div>

        <div data-testid="shipping-method-summary">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--scandi-fg-muted,#6B6860)] mb-2">
            Method
          </p>
          <p className="text-[var(--scandi-fg-muted,#6B6860)] leading-relaxed">
            {order.shipping_methods?.[0]?.name}
            {order.shipping_methods?.[0]?.total != null && (
              <>
                {" "}
                (
                {convertToLocale({
                  amount: order.shipping_methods[0].total ?? 0,
                  currency_code: order.currency_code,
                })}
                )
              </>
            )}
          </p>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
