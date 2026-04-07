import { model } from "@medusajs/framework/utils"

const Video = model.define("cms_video", {
  id: model.id().primaryKey(),
  key: model.text(),
  url: model.text(),
  title: model.text(),
  text: model.text(),
  tag: model.text(),
  duration: model.text(),
  poster_url: model.text(),
})

export default Video
