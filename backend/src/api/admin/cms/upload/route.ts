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

  try {
    const [uploaded] = await fileService.createFiles([
      {
        filename,
        mimeType,
        content: data,
        access: "public",
      },
    ])

    if (!uploaded) {
      res.status(500).json({ message: "File upload failed: no result returned" })
      return
    }

    res.json({ url: uploaded.url, id: uploaded.id })
  } catch (err: any) {
    console.error("[CMS Upload] fileService.createFiles error:", err?.message ?? err)
    res.status(500).json({ message: err?.message ?? "File upload failed" })
  }
}
