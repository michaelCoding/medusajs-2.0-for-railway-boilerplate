import { MedusaService } from "@medusajs/framework/utils"
import BlogPost from "./models/blog-post"
import Banner from "./models/banner"
import StaticPage from "./models/static-page"
import ProductExtra from "./models/product-extra"
import Video from "./models/video"

class CmsModuleService extends MedusaService({
  BlogPost,
  Banner,
  StaticPage,
  ProductExtra,
  Video,
}) {}

export default CmsModuleService
