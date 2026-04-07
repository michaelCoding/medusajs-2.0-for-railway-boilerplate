import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(
  req: MedusaRequest<unknown, { key: string }>,
  res: MedusaResponse
) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const videos = await cmsService.listVideos({ key: req.params.key })

  if (!videos.length) {
    res.status(404).json({ message: "No videos found" })
    return
  }

  res.json({ videos })
}
