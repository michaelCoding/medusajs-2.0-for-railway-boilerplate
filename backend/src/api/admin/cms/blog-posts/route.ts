import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const posts = await cmsService.listBlogPosts({}, { order: { created_at: "DESC" } })
  res.json({ posts })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any

  if (!body.title || !body.slug) {
    res.status(400).json({ message: "title and slug are required" })
    return
  }

  const post = await cmsService.createBlogPosts({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt ?? "",
    content: body.content ?? "",
    cover_image_url: body.cover_image_url ?? null,
    author: body.author ?? null,
    status: body.status ?? "draft",
    published_at: body.status === "published" ? new Date() : null,
    tags: body.tags ?? null,
  })

  res.status(201).json({ post })
}
