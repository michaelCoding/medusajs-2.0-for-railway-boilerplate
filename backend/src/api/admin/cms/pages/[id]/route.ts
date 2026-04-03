import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as Record<string, unknown>
  const update: Record<string, unknown> = { id: req.params.id }
  if (body.slug !== undefined) update.slug = body.slug
  if (body.title !== undefined) update.title = body.title
  if (body.content !== undefined) update.content = body.content
  const page = await cmsService.updateStaticPages(update as any)
  res.json({ page })
}

export async function DELETE(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteStaticPages([req.params.id])
  res.json({ success: true })
}
