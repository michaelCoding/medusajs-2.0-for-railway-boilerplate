import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { getCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await getCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8">
        <h1 className="font-lora text-2xl text-[#1c1c1a] mb-2">Shipping Addresses</h1>
        <p className="text-sm text-[#9b9590]">
          Your saved addresses are available during checkout for faster ordering.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
