import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const CmsIndexPage = () => {
  const navigate = useNavigate()
  useEffect(() => { navigate("/cms/blog") }, [])
  return null
}

export const config = defineRouteConfig({
  label: "内容管理",
  icon: ArrowUpRightOnBox,
})

export default CmsIndexPage
