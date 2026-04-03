import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const pages = await cmsService.listStaticPages()
  res.json({ pages })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any

  if (!body.slug || !body.title) {
    res.status(400).json({ message: "slug and title are required" })
    return
  }

  const page = await cmsService.createStaticPages({
    slug: body.slug,
    title: body.title,
    content: body.content ?? "",
  })

  res.status(201).json({ page })
}
