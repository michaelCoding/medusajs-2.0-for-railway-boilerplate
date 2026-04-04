import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const banner = await cmsService.retrieveBanner(req.params.id)
  res.json({ banner })
}

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as Record<string, unknown>
  const update: Record<string, unknown> = { id: req.params.id }
  if (body.headline !== undefined) update.headline = body.headline
  if (body.text !== undefined) update.text = body.text
  if (body.cta_text !== undefined) update.cta_text = body.cta_text
  if (body.cta_link !== undefined) update.cta_link = body.cta_link
  if (body.image_url !== undefined) update.image_url = body.image_url
  const banner = await cmsService.updateBanners(update as any)
  res.json({ banner })
}

export async function DELETE(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteBanners(req.params.id)
  res.json({ id: req.params.id, deleted: true })
}
