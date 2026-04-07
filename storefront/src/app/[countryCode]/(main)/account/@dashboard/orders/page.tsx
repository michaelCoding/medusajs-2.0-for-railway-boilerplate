import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8">
        <h1 className="font-lora text-2xl text-[#1c1c1a] mb-2">Orders</h1>
        <p className="text-sm text-[#9b9590]">
          Your purchase history — each piece a part of your collection.
        </p>
      </div>
      <OrderOverview orders={orders} />
    </div>
  )
}
