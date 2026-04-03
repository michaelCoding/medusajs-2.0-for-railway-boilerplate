import { model } from "@medusajs/framework/utils"

const ProductExtra = model.define("cms_product_extra", {
  id: model.id().primaryKey(),
  product_id: model.text().unique(),
  highlights: model.json().nullable(),
  story: model.text().nullable(),
  care_instructions: model.text().nullable(),
})

export default ProductExtra
