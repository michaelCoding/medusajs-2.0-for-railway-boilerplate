import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(
  req: MedusaRequest<unknown, { slug: string }>,
  res: MedusaResponse
) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)

  const [page] = await cmsService.listStaticPages({ slug: req.params.slug })

  if (!page) {
    res.status(404).json({ message: "Page not found" })
    return
  }

  res.json({ page })
}
