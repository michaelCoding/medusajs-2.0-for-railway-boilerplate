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
  const body = req.body as any

  const update: any = {
    id: req.params.id,
    ...body,
  }

  if (body.status === "published" && !body.published_at) {
    update.published_at = new Date()
  }

  const post = await cmsService.updateBlogPosts(update)
  res.json({ post })
}

export async function DELETE(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteBlogPosts([req.params.id])
  res.json({ success: true })
}
