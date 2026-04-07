import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const videos = await cmsService.listVideos()
  res.json({ videos })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as Record<string, unknown>

  if (!body.key || !body.url || !body.title) {
    res.status(400).json({ message: "key, url and title are required" })
    return
  }

  const video = await cmsService.createVideos({
    key: body.key as string,
    url: body.url as string,
    title: body.title as string,
    text: (body.text as string) ?? "",
    tag: (body.tag as string) ?? "",
    duration: (body.duration as string) ?? "",
    poster_url: (body.poster_url as string) ?? "",
  })

  res.status(201).json({ video })
}
