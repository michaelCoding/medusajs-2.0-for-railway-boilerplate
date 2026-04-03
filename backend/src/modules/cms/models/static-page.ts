import { model } from "@medusajs/framework/utils"

const StaticPage = model.define("cms_static_page", {
  id: model.id().primaryKey(),
  slug: model.text().unique(),
  title: model.text(),
  content: model.text(),
})

export default StaticPage
