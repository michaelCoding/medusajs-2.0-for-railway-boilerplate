import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const video = await cmsService.retrieveVideo(req.params.id)
  res.json({ video })
}

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as Record<string, unknown>
  const update: Record<string, unknown> = { id: req.params.id }
  if (body.url !== undefined) update.url = body.url
  if (body.title !== undefined) update.title = body.title
  if (body.text !== undefined) update.text = body.text
  if (body.tag !== undefined) update.tag = body.tag
  if (body.duration !== undefined) update.duration = body.duration
  if (body.poster_url !== undefined) update.poster_url = body.poster_url
  const video = await cmsService.updateVideoes(update as any)
  res.json({ video })
}

export async function DELETE(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteVideoes(req.params.id)
  res.json({ id: req.params.id, deleted: true })
}
