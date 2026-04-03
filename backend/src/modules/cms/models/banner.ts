import { model } from "@medusajs/framework/utils"

const Banner = model.define("cms_banner", {
  id: model.id().primaryKey(),
  key: model.text().unique(),
  headline: model.text(),
  text: model.text(),
  cta_text: model.text(),
  cta_link: model.text(),
  image_url: model.text(),
})

export default Banner
