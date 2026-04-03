import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const banners = await cmsService.listBanners()
  res.json({ banners })
}
