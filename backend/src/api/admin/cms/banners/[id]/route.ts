import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any
  const banner = await cmsService.updateBanners({ id: req.params.id, ...body })
  res.json({ banner })
}
