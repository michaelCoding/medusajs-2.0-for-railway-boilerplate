import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { IFileModuleService } from "@medusajs/framework/types"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fileService: IFileModuleService = req.scope.resolve(Modules.FILE)
  const body = req.body as Record<string, unknown>

  const filename = body.filename as string | undefined
  const mimeType = body.mimeType as string | undefined
  const data = body.data as string | undefined // base64-encoded file content

  if (!filename || !mimeType || !data) {
    res.status(400).json({ message: "filename, mimeType, and data are required" })
    return
  }

  const [uploaded] = await fileService.createFiles([
    {
      filename,
      mimeType,
      content: data,
      access: "public",
    },
  ])

  res.json({ url: uploaded.url, id: uploaded.id })
}
