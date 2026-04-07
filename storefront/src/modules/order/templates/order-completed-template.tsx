import { cookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const isOnboarding = cookies().get("_medusa_onboarding")?.value === "true"

  return (
    <div
      className="min-h-[calc(100vh-64px)]"
      style={{ background: "var(--scandi-bg, #F7F4EF)" }}
    >
      <style>{`
        @keyframes oc-draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes oc-draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes oc-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .oc-circle {
          stroke-dasharray: 188;
          stroke-dashoffset: 188;
          animation: oc-draw-circle 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }
        .oc-check {
          stroke-dasharray: 44;
          stroke-dashoffset: 44;
          animation: oc-draw-check 0.45s cubic-bezier(0.4, 0, 0.2, 1) 0.85s forwards;
        }
        .oc-1 { opacity: 0; animation: oc-fade-up 0.65s ease-out 0.3s forwards; }
        .oc-2 { opacity: 0; animation: oc-fade-up 0.65s ease-out 0.5s forwards; }
        .oc-3 { opacity: 0; animation: oc-fade-up 0.65s ease-out 0.7s forwards; }
        .oc-4 { opacity: 0; animation: oc-fade-up 0.65s ease-out 0.9s forwards; }
        .oc-5 { opacity: 0; animation: oc-fade-up 0.65s ease-out 1.1s forwards; }
        .oc-6 { opacity: 0; animation: oc-fade-up 0.65s ease-out 1.3s forwards; }
        .oc-7 { opacity: 0; animation: oc-fade-up 0.65s ease-out 1.5s forwards; }
      `}</style>

      <div className="content-container max-w-[680px] py-16 mx-auto">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        {/* ── Confirmation header ── */}
        <div
          className="flex flex-col items-center text-center mb-14"
          data-testid="order-complete-container"
        >
          <div className="mb-8">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="oc-circle"
                cx="30"
                cy="30"
                r="28"
                stroke="#6f4627"
                strokeWidth="1.25"
              />
              <polyline
                className="oc-check"
                points="19,31 27,39 42,22"
                stroke="#6f4627"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="oc-1 font-body text-[11px] tracking-[0.22em] uppercase text-[var(--scandi-fg-muted,#6B6860)] mb-4">
            Order confirmed
          </p>

          <h1 className="oc-2 font-headline text-[2rem] leading-[1.18] text-[var(--scandi-fg,#1C1C1A)] mb-6 max-w-sm">
            Thank you for choosing a quieter way to live.
          </h1>

          <div className="oc-3 w-full max-w-md">
            <OrderDetails order={order} />
          </div>
        </div>

        {/* ── Items ── */}
        <div className="oc-4">
          <div className="border-t border-[var(--scandi-border,#E8E4DC)] pt-9 mb-9">
            <p className="font-headline text-[1.15rem] text-[var(--scandi-fg,#1C1C1A)] mb-7 tracking-wide">
              Your Items
            </p>
            <Items items={order.items} />
          </div>
        </div>

        {/* ── Totals ── */}
        <div className="oc-5 mb-9">
          <CartTotals totals={order} />
        </div>

        {/* ── Delivery + Payment ── */}
        <div className="oc-6">
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
        </div>

        {/* ── Help ── */}
        <div className="oc-7 pt-8">
          <Help />
        </div>
      </div>
    </div>
  )
}
