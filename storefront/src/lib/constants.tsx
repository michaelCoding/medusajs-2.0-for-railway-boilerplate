import React from "react"
import { CreditCard } from "@medusajs/icons"
import { StoreCollection, StoreProductCategory } from '@medusajs/types'

import { IdealIcon as Ideal } from "@modules/common/icons/ideal"
import { BancontactIcon as Bancontact } from "@modules/common/icons/bancontact"
import { PayPalIcon as PayPal } from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_")
}
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

export const createNavigation = (
  productCategories: StoreProductCategory[],
  collections?: StoreCollection[]
) => [
  {
    name: 'Shop',
    handle: '/shop',
    category_children: productCategories
      .filter((category) => !category.parent_category)
      .map((category) => ({
        name: category.name,
        type: 'parent_category',
        handle: `/categories/${category.handle}`,
        category_children: (category.category_children ?? []).map((sub) => ({
          name: sub.name,
          handle: `/categories/${sub.handle}`,
          icon: null,
          category_children: null,
        })),
      })),
  },
  {
    name: 'Collections',
    handle: '/shop',
    category_children: !collections
      ? null
      : collections.map((collection) => ({
          name: collection.title,
          type: 'collection',
          handle: `/collections/${collection.handle}`,
          handle_id: collection.handle,
          category_children: null,
        })),
  },
  {
    name: 'Blog',
    handle: '/blog',
    category_children: null,
  },
]

export const checkoutFooterNavigation = [
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Terms of Use', href: '/terms' },
  { title: 'Cookie Policy', href: '/cookies' },
]

export const passwordRequirements = [
  'At least 8 characters',
  'At least one uppercase letter',
  'At least one lowercase letter',
  'At least one number',
]
