import { Link, useLocation } from "react-router-dom"

const tabs = [
  { label: "Blog Posts", path: "/cms/blog" },
  { label: "Banners",    path: "/cms/banners" },
  { label: "Pages",      path: "/cms/pages" },
]

export default function CmsNav() {
  const { pathname } = useLocation()
  const active = tabs.find((t) => pathname.startsWith(t.path))?.path ?? ""

  return (
    <div style={{
      display: "flex", gap: 4,
      borderBottom: "1px solid #e8e4dc", background: "#fff",
      marginBottom: 24,
    }}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          style={{
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: active === tab.path ? 600 : 400,
            color: active === tab.path ? "#1c1c1a" : "#9b9590",
            textDecoration: "none",
            borderBottom: `2px solid ${active === tab.path ? "#1c1c1a" : "transparent"}`,
            marginBottom: -1,
            transition: "color 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
