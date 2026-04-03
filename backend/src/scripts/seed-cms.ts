import { ExecArgs } from "@medusajs/framework/types"
import { CMS_MODULE } from "../modules/cms"
import CmsModuleService from "../modules/cms/service"

export default async function seedCms({ container }: ExecArgs) {
  const cmsService: CmsModuleService = container.resolve(CMS_MODULE)

  // Seed banners
  const existingHero = await cmsService.listBanners({ key: "hero" })
  if (!existingHero.length) {
    await cmsService.createBanners({
      key: "hero",
      headline: "Discover Your Style",
      text: "Explore our curated collection of premium essentials designed for everyday comfort and timeless style.",
      cta_text: "Shop Now",
      cta_link: "/store",
      image_url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
    })
    console.log("Created hero banner")
  }

  const existingMid = await cmsService.listBanners({ key: "mid" })
  if (!existingMid.length) {
    await cmsService.createBanners({
      key: "mid",
      headline: "New Arrivals",
      text: "Fresh styles just landed. Be the first to explore our latest collection.",
      cta_text: "Explore",
      cta_link: "/store",
      image_url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
    })
    console.log("Created mid banner")
  }

  // Seed static pages
  const pages = [
    {
      slug: "about-us",
      title: "About Us",
      content: "# About Us\n\nWe are a premium essentials brand dedicated to quality and style.",
    },
    {
      slug: "faq",
      title: "FAQ",
      content: "# Frequently Asked Questions\n\n## Shipping\n\nWe ship worldwide within 5-7 business days.",
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: "# Privacy Policy\n\nYour privacy is important to us.",
    },
    {
      slug: "terms-and-conditions",
      title: "Terms & Conditions",
      content: "# Terms & Conditions\n\nBy using our store, you agree to these terms.",
    },
  ]

  for (const page of pages) {
    const existing = await cmsService.listStaticPages({ slug: page.slug })
    if (!existing.length) {
      await cmsService.createStaticPages(page)
      console.log(`Created static page: ${page.slug}`)
    }
  }

  console.log("CMS seed complete")
}
