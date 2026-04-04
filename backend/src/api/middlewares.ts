import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      // Increase body size limit for file uploads (default is 100kb)
      matcher: "/admin/cms/upload",
      bodyParser: { sizeLimit: "20mb" },
    },
  ],
})
