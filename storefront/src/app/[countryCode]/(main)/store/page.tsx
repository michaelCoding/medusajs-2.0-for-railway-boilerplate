import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getBanner } from "@lib/data/cms"

export const metadata: Metadata = {
  title: "Store | The Woodenly",
  description: "Explore our collection of handcrafted wooden wares for the intentional home.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const { sortBy, page } = searchParams
  const banner = await getBanner('store')

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      banner={banner}
    />
  )
}
