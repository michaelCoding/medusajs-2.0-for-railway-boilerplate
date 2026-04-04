import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(
  req: MedusaRequest<unknown, { key: string }>,
  res: MedusaResponse
) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)

  const [banner] = await cmsService.listBanners({ key: req.params.key })

  if (!banner) {
    res.status(404).json({ message: "Banner not found" })
    return
  }

  res.json({ banner })
}
