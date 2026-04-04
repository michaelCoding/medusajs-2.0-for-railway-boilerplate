import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(
  req: MedusaRequest<unknown, { slug: string }>,
  res: MedusaResponse
) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)

  const [post] = await cmsService.listBlogPosts({
    slug: req.params.slug,
    status: "published",
  })

  if (!post) {
    res.status(404).json({ message: "Post not found" })
    return
  }

  res.json({ post })
}
