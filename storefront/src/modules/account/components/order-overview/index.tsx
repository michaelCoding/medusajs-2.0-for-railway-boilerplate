"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center py-16 px-8 text-center"
      data-testid="no-orders-container"
    >
      {/* Decorative icon */}
      <div className="w-16 h-16 rounded-full bg-[#f0ede8] flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="9" width="20" height="15" rx="2" stroke="#9b9590" strokeWidth="1.4"/>
          <path d="M9 9V7a5 5 0 0 1 10 0v2" stroke="#9b9590" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M14 15v3M12.5 16.5h3" stroke="#c4b89a" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>

      <h2 className="font-lora text-[20px] text-[#1c1c1a] mb-2">
        No orders yet
      </h2>
      <p className="text-sm text-[#9b9590] max-w-xs leading-relaxed mb-8">
        Your collection awaits. Browse our handcrafted pieces and find something made to stay.
      </p>

      <LocalizedClientLink
        href="/store"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1c1a] text-white text-sm rounded-xl hover:bg-[#2d2d2a] transition-all duration-200"
        data-testid="continue-shopping-button"
      >
        Explore the Store
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
