import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const post = await cmsService.retrieveBlogPost(req.params.id)
  res.json({ post })
}

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as Record<string, unknown>

  const update: Record<string, unknown> = { id: req.params.id }
  if (body.title !== undefined) update.title = body.title
  if (body.slug !== undefined) update.slug = body.slug
  if (body.excerpt !== undefined) update.excerpt = body.excerpt
  if (body.content !== undefined) update.content = body.content
  if (body.cover_image_url !== undefined) update.cover_image_url = body.cover_image_url
  if (body.author !== undefined) update.author = body.author
  if (body.status !== undefined) update.status = body.status
  if (body.tags !== undefined) update.tags = body.tags
  if (body.status === "published" && !body.published_at) {
    update.published_at = new Date()
  } else if (body.published_at !== undefined) {
    update.published_at = body.published_at
  }

  const post = await cmsService.updateBlogPosts(update)
  res.json({ post })
}

export async function DELETE(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteBlogPosts([req.params.id])
  res.json({ success: true })
}
