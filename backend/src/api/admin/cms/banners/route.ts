import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const banners = await cmsService.listBanners()
  res.json({ banners })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as Record<string, unknown>

  if (!body.key || !body.headline) {
    res.status(400).json({ message: "key and headline are required" })
    return
  }

  const banner = await cmsService.createBanners({
    key: body.key as string,
    headline: body.headline as string,
    text: (body.text as string) ?? "",
    cta_text: (body.cta_text as string) ?? "",
    cta_link: (body.cta_link as string) ?? "",
    image_url: (body.image_url as string) ?? "",
  })

  res.status(201).json({ banner })
}
