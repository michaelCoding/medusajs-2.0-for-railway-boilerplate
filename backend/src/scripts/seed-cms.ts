import { ExecArgs } from "@medusajs/framework/types"
import { CMS_MODULE } from "../modules/cms"
import CmsModuleService from "../modules/cms/service"

const blogPosts = [
  {
    slug: "quiet-ritual-of-morning-tea",
    title: "The Quiet Ritual of Morning Tea",
    excerpt: "Before the world wakes to its noise, there is a span of time where the only movement is the slow climb of steam and the warming of wood against a cold palm.",
    author: "Elias Thorne",
    cover_image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
    status: "published" as const,
    published_at: new Date("2024-09-22"),
    tags: ["ritual", "morning", "tea", "wood"],
    content: `The wooden bowl is a conductor of heat, but unlike ceramic, it is a gentle negotiator. It allows the liquid within to breathe while keeping the exterior soft, never scalding. This morning, as the first light filters through the cedar trees outside my window, I find myself tracing the grain of the white oak. Each ring is a year of a tree's life, now serving as a vessel for my own brief moment of reflection.

There is a tactile honesty in wood. It changes over time, absorbing the oils of your hands, darkening where it is held most often. To drink tea from a bowl carved by hand is to engage in a conversation between two lives — the life of the wood and the life of the person holding it.

Crafting these vessels requires a deep understanding of tension and moisture. Our artisans at The Atelier select wood that has aged for three seasons before the first cut is even made. The bowl used in this ritual was turned slowly, keeping the walls thick enough for insulation but thin enough to feel light, almost weightless, when empty.

It is not just about the object; it is about the stillness it demands. You cannot rush a tea bowl. It requires two hands to hold properly. It requires you to sit, to breathe, and to wait for the tea to reach the temperature the wood suggests. In this waiting, the day begins to take shape — not with anxiety, but with intention.

## The Grain Remembers

Every bowl we turn tells the story of where the tree stood. An oak grown on a south-facing slope shows tighter rings — it worked harder against the wind and leaned into the light with deliberate patience. A walnut from a forest floor grows with wider rings, unhurried, nourished by deep roots and fallen leaves. When you hold such a bowl, you are holding that particular history.

We believe this matters. Not as a marketing story, but as a lived experience. The objects we surround ourselves with shape the quality of our attention. A bowl that carries history invites you to slow down. It asks you to notice.

## A Practice, Not a Product

The morning tea ritual is not about the tea. It is about the pause before the day begins. The bowl is a prop in a small daily ceremony — a reminder that you have chosen, at least for this moment, to be present.

This is why we make what we make. Not to fill homes with objects, but to offer tools for a quieter kind of living.`,
  },
  {
    slug: "understanding-oak",
    title: "Understanding Oak",
    excerpt: "A material that ages with you — the touch of the chisel, deep and enduring durability.",
    author: "Maren Lindqvist",
    cover_image_url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1600&q=80",
    status: "published" as const,
    published_at: new Date("2024-08-15"),
    tags: ["materials", "oak", "craft", "atelier"],
    content: `Oak is perhaps the most storied of all woods used in the craft of object-making. Its grain is pronounced, its weight reassuring, and its durability legendary. But to work with oak is to accept a partnership — the wood has opinions, and the maker must listen.

When we select an oak board at The Atelier, we spend time with it before we begin. We look at how the grain runs, where the knots live, how the figure catches the light. This is not sentimentality. It is practical wisdom. A piece of oak that is forced into a form it resists will eventually tell you — through crack, through movement, through a surface that never quite settles.

## The Patience of the Material

Oak requires patience in curing. We air-dry our timber for a minimum of two years per inch of thickness before it comes near a lathe or a plane. This slow drying allows the wood to release its tension gradually, to settle into its own nature. Rushed drying causes the internal stresses to express themselves catastrophically — in splits, in warps, in surfaces that cup and twist.

This is a lesson the wood teaches the maker: you cannot abbreviate the essential processes. Time is part of the material.

## How Oak Ages

Unlike many materials, oak does not simply wear — it develops. The surface of an oak bowl used daily for a year will show a patina that no finishing process can replicate. The areas held most often will darken first. The grain will begin to emerge more clearly as the surface is worked by touch.

This is the promise of quality wood objects: they become more themselves over time, not less. They carry the record of their use without embarrassment.`,
  },
  {
    slug: "restoring-the-grove",
    title: "Restoring the Grove",
    excerpt: "Planting more than we harvest — our circular commitment to the forests that sustain our craft.",
    author: "The Woodenly Atelier",
    cover_image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    status: "published" as const,
    published_at: new Date("2024-07-01"),
    tags: ["sustainability", "forest", "circular", "commitment"],
    content: `Every piece of wood we turn was once a living tree. This is not a fact we take lightly, nor is it one we allow to become abstract in the business of making things. The forest is not a warehouse. It is a community of organisms with its own logic, its own timescale, its own memory.

Our sourcing policy is simple in principle and demanding in practice: we only use timber from forests managed with a strict replanting programme, and we plant three trees for every one we consume. This is our minimum commitment. In practice, through our partnerships with reforestation initiatives across Scandinavia and Central Europe, the ratio is considerably higher.

## Why This Matters to Us

There is no craft without material. And there is no material without the land that produced it. We are not neutral parties in this relationship — we are active participants, and we want to be beneficial ones.

But beyond the practical necessity, there is something more: we believe that objects made from trees that were grown and harvested responsibly carry a different quality. We cannot prove this scientifically. We believe it as craftspeople, as makers who have spent time in both the forest and the workshop.

## The Long View

A tree planted today will not be harvested for timber in our lifetimes. Perhaps not in our children's lifetimes. This is an act of faith — a commitment to a future we will not see.

This is, we think, the spirit of slow living made material. To plant a tree is to acknowledge that the world does not begin and end with you. It is an optimistic act, a statement of trust in the continuation of things.

We are a small atelier. But small actions, repeated faithfully, accumulate.

## What You Can Do

When you choose an object made from traceable, certified timber, you are voting for this approach. You are telling the market that the story of the material matters to you.

Thank you for that. It matters to us too.`,
  },
]

export default async function seedCms({ container }: ExecArgs) {
  const cmsService: CmsModuleService = container.resolve(CMS_MODULE)

  // ── Banners (one per page position) ─────────────────────────────────────
  const bannerSeeds = [
    {
      key: "home",
      headline: "Live gently. Live woodenly.",
      text: "Handcrafted wooden objects for a quieter, more intentional life.",
      cta_text: "Enter the moment →",
      cta_link: "/store",
      image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
    },
    {
      key: "store",
      headline: "Every object, a quiet intention.",
      text: "Browse our collection of hand-turned wooden pieces.",
      cta_text: "Shop all →",
      cta_link: "/store",
      image_url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1600&q=80",
    },
    {
      key: "journal",
      headline: "Stories from the atelier.",
      text: "Notes on craft, material, and the slow life.",
      cta_text: "Read more →",
      cta_link: "/journal",
      image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    },
  ]

  for (const seed of bannerSeeds) {
    const existing = await cmsService.listBanners({ key: seed.key })
    if (existing.length) {
      await cmsService.updateBanners(existing[0].id, seed)
      console.log(`Updated banner: ${seed.key}`)
    } else {
      await cmsService.createBanners(seed)
      console.log(`Created banner: ${seed.key}`)
    }
  }

  // ── Videos ───────────────────────────────────────────────────────────────
  const videoSeeds = [
    {
      key: "home",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "The Woodenly Atelier",
      text: "A glimpse into our workshop — where wood meets intention.",
      tag: "Brand Film",
      duration: "2:30",
      poster_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
    },
    {
      key: "store",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Objects Made to Last",
      text: "Every piece, hand-turned and finished for a lifetime.",
      tag: "Craft Story",
      duration: "1:45",
      poster_url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1600&q=80",
    },
    {
      key: "journal",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "The Slow Living Archive",
      text: "Conversations on material, craft, and the art of slowing down.",
      tag: "Journal",
      duration: "4:12",
      poster_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    },
  ]

  for (const seed of videoSeeds) {
    const existing = await cmsService.listVideos({ key: seed.key })
    if (!existing.length) {
      await cmsService.createVideos(seed)
      console.log(`Created video: ${seed.key}`)
    } else {
      console.log(`Video already exists: ${seed.key}`)
    }
  }

  // ── Static pages ─────────────────────────────────────────────────────────
  const pages = [
    {
      slug: "about-us",
      title: "About The Woodenly",
      content: `# About The Woodenly

We are an atelier dedicated to the craft of slow-made wooden objects. Every piece we create is designed to last a lifetime — and to become more beautiful as it does.

## Our Belief

We believe in objects that breathe with you. Not just tools, but companions that carry the history of the earth and the touch of the artisan.

## Our Process

Every object begins as a conversation with the material. We select timber from certified, responsibly managed forests. We air-dry it for months. We turn, carve, and finish each piece by hand, using only food-safe natural oils.

## Our Commitment

100% traceable timber. Hand turned and finished. 20+ year guarantee on every piece.`,
    },
    {
      slug: "shipping-returns",
      title: "Shipping & Returns",
      content: `# Shipping & Returns

## Shipping

We ship worldwide. Orders are dispatched within 3–5 business days. Each piece is wrapped in recycled paper and placed in a handmade linen pouch.

**Delivery times:**
- UK & Europe: 5–8 business days
- North America: 8–12 business days
- Rest of World: 10–16 business days

## Returns

We stand behind every piece we make. If you are not completely satisfied, we offer a 30-day return window for unused items in their original condition.

For pieces that develop a fault within the first 12 months of normal use, we will repair or replace at no cost to you.

## Our 20-Year Guarantee

Every piece comes with our 20-year structural guarantee. Wood moves. It lives. If a joint loosens or a crack develops through normal use, send it back to us. We will make it right.`,
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: `# Privacy Policy

Your privacy matters to us. We collect only what we need to process your order and communicate with you.

We never sell your data. We never share it with third parties except as required to fulfil your order (shipping carriers, payment processors).

You may request deletion of your data at any time by writing to us at privacy@thewoodenly.com.`,
    },
    {
      slug: "terms-and-conditions",
      title: "Terms & Conditions",
      content: `# Terms & Conditions

By placing an order with The Woodenly, you agree to these terms.

## Pricing

All prices are shown in USD and include any applicable taxes. Shipping costs are calculated at checkout.

## Ownership

Ownership of goods passes to the customer upon full payment. Risk of loss passes upon delivery.

## Disputes

We hope you love every piece. If something goes wrong, please contact us before initiating a dispute — we will always do our best to make it right.`,
    },
  ]

  for (const page of pages) {
    const existing = await cmsService.listStaticPages({ slug: page.slug })
    if (!existing.length) {
      await cmsService.createStaticPages(page)
      console.log(`Created static page: ${page.slug}`)
    } else {
      await cmsService.updateStaticPages(existing[0].id, {
        title: page.title,
        content: page.content,
      })
      console.log(`Updated static page: ${page.slug}`)
    }
  }

  // ── Blog posts ────────────────────────────────────────────────────────────
  for (const post of blogPosts) {
    const existing = await cmsService.listBlogPosts({ slug: post.slug })
    if (!existing.length) {
      await cmsService.createBlogPosts(post)
      console.log(`Created blog post: ${post.slug}`)
    } else {
      console.log(`Blog post already exists: ${post.slug}`)
    }
  }

  console.log("CMS seed complete")
}
