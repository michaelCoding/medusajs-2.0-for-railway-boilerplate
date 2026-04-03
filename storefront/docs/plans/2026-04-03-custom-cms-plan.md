# Custom CMS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a database-backed CMS module inside Medusa (v2.12.1) to manage blog posts, homepage banners, static pages, and product extras — with a custom Admin UI and storefront API integration.

**Architecture:** A Medusa custom service module (`src/modules/cms`) owns four models (BlogPost, Banner, StaticPage, ProductExtra) backed by PostgreSQL. Admin CRUD is exposed via `src/api/admin/cms/` routes and a custom Admin UI (`src/admin/routes/cms/`). The storefront reads public data from `src/api/store/cms/` routes instead of local MDX files.

**Tech Stack:** Medusa v2.12.1, `@medusajs/framework/utils` (MedusaService, model builder, Module), `@medusajs/admin-sdk` (defineRouteConfig), `@medusajs/ui` (admin components), Next.js 15 App Router (storefront)

**Reference:** `D:/workspace/standalone-website/e-commerce/backend/src/`

---

## Task 1: CMS module — models

**Files:**
- Create: `backend/src/modules/cms/models/blog-post.ts`
- Create: `backend/src/modules/cms/models/banner.ts`
- Create: `backend/src/modules/cms/models/static-page.ts`
- Create: `backend/src/modules/cms/models/product-extra.ts`

**Step 1: Create blog-post model**

```typescript
// backend/src/modules/cms/models/blog-post.ts
import { model } from "@medusajs/framework/utils"

const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text().unique(),
  excerpt: model.text(),
  content: model.text(),
  cover_image_url: model.text().nullable(),
  author: model.text().nullable(),
  status: model.enum(["draft", "published"]).default("draft"),
  published_at: model.dateTime().nullable(),
  tags: model.json().nullable(),
})

export default BlogPost
```

**Step 2: Create banner model**

```typescript
// backend/src/modules/cms/models/banner.ts
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
```

**Step 3: Create static-page model**

```typescript
// backend/src/modules/cms/models/static-page.ts
import { model } from "@medusajs/framework/utils"

const StaticPage = model.define("cms_static_page", {
  id: model.id().primaryKey(),
  slug: model.text().unique(),
  title: model.text(),
  content: model.text(),
})

export default StaticPage
```

**Step 4: Create product-extra model**

```typescript
// backend/src/modules/cms/models/product-extra.ts
import { model } from "@medusajs/framework/utils"

const ProductExtra = model.define("cms_product_extra", {
  id: model.id().primaryKey(),
  product_id: model.text().unique(),
  highlights: model.json().nullable(),
  story: model.text().nullable(),
  care_instructions: model.text().nullable(),
})

export default ProductExtra
```

**Step 5: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/modules/cms/models/
git commit -m "feat(cms): add cms module models"
```

---

## Task 2: CMS module — service and registration

**Files:**
- Create: `backend/src/modules/cms/service.ts`
- Create: `backend/src/modules/cms/index.ts`
- Modify: `backend/medusa-config.js`

**Step 1: Create service.ts**

```typescript
// backend/src/modules/cms/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import BlogPost from "./models/blog-post"
import Banner from "./models/banner"
import StaticPage from "./models/static-page"
import ProductExtra from "./models/product-extra"

class CmsModuleService extends MedusaService({
  BlogPost,
  Banner,
  StaticPage,
  ProductExtra,
}) {}

export default CmsModuleService
```

**Step 2: Create index.ts**

```typescript
// backend/src/modules/cms/index.ts
import { Module } from "@medusajs/framework/utils"
import CmsModuleService from "./service"

export const CMS_MODULE = "cms"

export default Module(CMS_MODULE, {
  service: CmsModuleService,
})
```

**Step 3: Register module in medusa-config.js**

Read current `backend/medusa-config.js`. Find the `modules:` array and add before the closing `]`:

```js
// At the top of medusa-config.js, add this import:
import CmsModule from "./src/modules/cms"

// In the modules array, add:
{
  resolve: "./src/modules/cms",
},
```

The import goes with the other imports at the top. The module entry goes at the END of the `modules` array in `defineConfig`.

**Step 4: Generate and run database migration**

```bash
cd /d/workspace/standalone-website/e-commerce/backend
npx medusa db:generate cms
npx medusa db:migrate
```

Expected: 4 new tables created (`blog_post`, `cms_banner`, `cms_static_page`, `cms_product_extra`)

**Step 5: Verify server starts**

```bash
npx medusa develop
# Wait for "Medusa started on port 9000"
# Press Ctrl+C
```

**Step 6: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/modules/cms/service.ts backend/src/modules/cms/index.ts backend/medusa-config.js backend/src/migrations/
git commit -m "feat(cms): register cms module with service and db migration"
```

---

## Task 3: Store API routes (public, read-only)

**Files:**
- Create: `backend/src/api/store/cms/blog-posts/route.ts`
- Create: `backend/src/api/store/cms/blog-posts/[slug]/route.ts`
- Create: `backend/src/api/store/cms/banners/[key]/route.ts`
- Create: `backend/src/api/store/cms/pages/[slug]/route.ts`

**Step 1: Blog posts list route**

```typescript
// backend/src/api/store/cms/blog-posts/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)

  const posts = await cmsService.listBlogPosts(
    { status: "published" },
    { order: { published_at: "DESC" } }
  )

  res.json({ posts })
}
```

**Step 2: Blog post detail route**

```typescript
// backend/src/api/store/cms/blog-posts/[slug]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(
  req: MedusaRequest<unknown, { slug: string }>,
  res: MedusaResponse
) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)

  const [post] = await cmsService.listBlogPosts({
    slug: req.params.slug,
    status: "published",
  })

  if (!post) {
    res.status(404).json({ message: "Post not found" })
    return
  }

  res.json({ post })
}
```

**Step 3: Banner by key route**

```typescript
// backend/src/api/store/cms/banners/[key]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(
  req: MedusaRequest<unknown, { key: string }>,
  res: MedusaResponse
) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)

  const [banner] = await cmsService.listBanners({ key: req.params.key })

  if (!banner) {
    res.status(404).json({ message: "Banner not found" })
    return
  }

  res.json({ banner })
}
```

**Step 4: Static page by slug route**

```typescript
// backend/src/api/store/cms/pages/[slug]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(
  req: MedusaRequest<unknown, { slug: string }>,
  res: MedusaResponse
) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)

  const [page] = await cmsService.listStaticPages({ slug: req.params.slug })

  if (!page) {
    res.status(404).json({ message: "Page not found" })
    return
  }

  res.json({ page })
}
```

**Step 5: Test routes with curl**

```bash
# Start the dev server first: npx medusa develop

# Test blog posts (empty list is fine)
curl http://localhost:9000/store/cms/blog-posts
# Expected: {"posts":[]}

# Test banner (not found is fine)
curl http://localhost:9000/store/cms/banners/hero
# Expected: {"message":"Banner not found"} with 404
```

**Step 6: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/api/store/cms/
git commit -m "feat(cms): add public store API routes for blog, banners, pages"
```

---

## Task 4: Admin API routes (CRUD)

**Files:**
- Create: `backend/src/api/admin/cms/blog-posts/route.ts`
- Create: `backend/src/api/admin/cms/blog-posts/[id]/route.ts`
- Create: `backend/src/api/admin/cms/banners/route.ts`
- Create: `backend/src/api/admin/cms/banners/[id]/route.ts`
- Create: `backend/src/api/admin/cms/pages/route.ts`
- Create: `backend/src/api/admin/cms/pages/[id]/route.ts`

**Step 1: Blog posts admin list + create**

```typescript
// backend/src/api/admin/cms/blog-posts/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const posts = await cmsService.listBlogPosts({}, { order: { created_at: "DESC" } })
  res.json({ posts })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any

  if (!body.title || !body.slug) {
    res.status(400).json({ message: "title and slug are required" })
    return
  }

  const post = await cmsService.createBlogPosts({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt ?? "",
    content: body.content ?? "",
    cover_image_url: body.cover_image_url ?? null,
    author: body.author ?? null,
    status: body.status ?? "draft",
    published_at: body.status === "published" ? new Date() : null,
    tags: body.tags ?? null,
  })

  res.status(201).json({ post })
}
```

**Step 2: Blog post admin detail + update + delete**

```typescript
// backend/src/api/admin/cms/blog-posts/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function GET(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const post = await cmsService.retrieveBlogPost(req.params.id)
  res.json({ post })
}

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any

  const update: any = {
    id: req.params.id,
    ...body,
  }

  if (body.status === "published" && !body.published_at) {
    update.published_at = new Date()
  }

  const post = await cmsService.updateBlogPosts(update)
  res.json({ post })
}

export async function DELETE(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteBlogPosts([req.params.id])
  res.json({ success: true })
}
```

**Step 3: Banners admin list + update**

```typescript
// backend/src/api/admin/cms/banners/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const banners = await cmsService.listBanners()
  res.json({ banners })
}
```

```typescript
// backend/src/api/admin/cms/banners/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any
  const banner = await cmsService.updateBanners({ id: req.params.id, ...body })
  res.json({ banner })
}
```

**Step 4: Static pages admin CRUD**

```typescript
// backend/src/api/admin/cms/pages/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsModuleService from "../../../../modules/cms/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const pages = await cmsService.listStaticPages()
  res.json({ pages })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any

  if (!body.slug || !body.title) {
    res.status(400).json({ message: "slug and title are required" })
    return
  }

  const page = await cmsService.createStaticPages({
    slug: body.slug,
    title: body.title,
    content: body.content ?? "",
  })

  res.status(201).json({ page })
}
```

```typescript
// backend/src/api/admin/cms/pages/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CMS_MODULE } from "../../../../../modules/cms"
import CmsModuleService from "../../../../../modules/cms/service"

export async function PUT(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  const body = req.body as any
  const page = await cmsService.updateStaticPages({ id: req.params.id, ...body })
  res.json({ page })
}

export async function DELETE(req: MedusaRequest<unknown, { id: string }>, res: MedusaResponse) {
  const cmsService: CmsModuleService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteStaticPages([req.params.id])
  res.json({ success: true })
}
```

**Step 5: Test with curl (requires admin JWT)**

```bash
# Get admin token first (use your admin credentials)
TOKEN=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourmail.com","password":"supersecret"}' \
  | jq -r '.token')

# List blog posts
curl -H "Authorization: Bearer $TOKEN" http://localhost:9000/admin/cms/blog-posts
# Expected: {"posts":[]}

# Create a test post
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Test","slug":"test","excerpt":"Test post","content":"# Hello","status":"published"}' \
  http://localhost:9000/admin/cms/blog-posts
# Expected: {"post":{...}} with 201
```

**Step 6: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/api/admin/cms/
git commit -m "feat(cms): add admin CRUD API routes for blog, banners, pages"
```

---

## Task 5: Image upload route

**Files:**
- Create: `backend/src/api/admin/cms/upload/route.ts`

**Step 1: Create upload route**

```typescript
// backend/src/api/admin/cms/upload/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { IFileModuleService } from "@medusajs/framework/types"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fileService: IFileModuleService = req.scope.resolve(Modules.FILE)

  // Medusa middleware parses multipart — files are in req.files
  const files = (req as any).files as Express.Multer.File[]

  if (!files || files.length === 0) {
    res.status(400).json({ message: "No file uploaded" })
    return
  }

  const file = files[0]

  const [uploaded] = await fileService.uploadFiles([
    {
      filename: file.originalname,
      mimeType: file.mimetype,
      content: file.buffer,
      access: "public",
    },
  ])

  res.json({ url: uploaded.url, key: uploaded.key })
}
```

**Step 2: Test upload**

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/test-image.jpg" \
  http://localhost:9000/admin/cms/upload
# Expected: {"url":"https://minio.../medusa-media/test-image-01JXX...jpg","key":"..."}
```

**Step 3: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/api/admin/cms/upload/
git commit -m "feat(cms): add image upload route via Medusa file module"
```

---

## Task 6: Seed initial CMS data (banners + static pages)

**Files:**
- Create: `backend/src/scripts/seed-cms.ts`

**Step 1: Create seed script**

```typescript
// backend/src/scripts/seed-cms.ts
import { ExecArgs } from "@medusajs/framework/types"
import { CMS_MODULE } from "../modules/cms"
import CmsModuleService from "../modules/cms/service"

export default async function seedCms({ container }: ExecArgs) {
  const cmsService: CmsModuleService = container.resolve(CMS_MODULE)

  // Seed banners
  const existingHero = await cmsService.listBanners({ key: "hero" })
  if (!existingHero.length) {
    await cmsService.createBanners({
      key: "hero",
      headline: "Discover Your Style",
      text: "Explore our curated collection of premium essentials designed for everyday comfort and timeless style.",
      cta_text: "Shop Now",
      cta_link: "/store",
      image_url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
    })
    console.log("Created hero banner")
  }

  const existingMid = await cmsService.listBanners({ key: "mid" })
  if (!existingMid.length) {
    await cmsService.createBanners({
      key: "mid",
      headline: "New Arrivals",
      text: "Fresh styles just landed. Be the first to explore our latest collection.",
      cta_text: "Explore",
      cta_link: "/store",
      image_url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
    })
    console.log("Created mid banner")
  }

  // Seed static pages
  const pages = [
    {
      slug: "about-us",
      title: "About Us",
      content: "# About Us\n\nWe are a premium essentials brand dedicated to quality and style.",
    },
    {
      slug: "faq",
      title: "FAQ",
      content: "# Frequently Asked Questions\n\n## Shipping\n\nWe ship worldwide within 5-7 business days.",
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: "# Privacy Policy\n\nYour privacy is important to us.",
    },
    {
      slug: "terms-and-conditions",
      title: "Terms & Conditions",
      content: "# Terms & Conditions\n\nBy using our store, you agree to these terms.",
    },
  ]

  for (const page of pages) {
    const existing = await cmsService.listStaticPages({ slug: page.slug })
    if (!existing.length) {
      await cmsService.createStaticPages(page)
      console.log(`Created static page: ${page.slug}`)
    }
  }

  console.log("CMS seed complete")
}
```

**Step 2: Run seed**

```bash
cd /d/workspace/standalone-website/e-commerce/backend
npx medusa exec ./src/scripts/seed-cms.ts
```

Expected output:
```
Created hero banner
Created mid banner
Created static page: about-us
...
CMS seed complete
```

**Step 3: Verify via API**

```bash
curl http://localhost:9000/store/cms/banners/hero
# Expected: {"banner":{"key":"hero","headline":"Discover Your Style",...}}
```

**Step 4: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/scripts/seed-cms.ts
git commit -m "feat(cms): add seed script for initial banners and static pages"
```

---

## Task 7: Admin UI — Blog management page

**Files:**
- Create: `backend/src/admin/routes/cms/page.tsx`
- Create: `backend/src/admin/routes/cms/blog/page.tsx`
- Create: `backend/src/admin/routes/cms/blog/[id]/page.tsx`

**Step 1: CMS index route (redirects to blog)**

```tsx
// backend/src/admin/routes/cms/page.tsx
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
  label: "CMS",
  icon: ArrowUpRightOnBox,
})

export default CmsIndexPage
```

**Step 2: Blog list page**

```tsx
// backend/src/admin/routes/cms/blog/page.tsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Container, Heading, Table, Badge, Text } from "@medusajs/ui"

type Post = {
  id: string
  title: string
  slug: string
  status: "draft" | "published"
  published_at: string | null
  author: string | null
}

async function fetchPosts(token: string): Promise<Post[]> {
  const res = await fetch("/admin/cms/blog-posts", {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  return data.posts ?? []
}

async function deletePost(id: string, token: string) {
  await fetch(`/admin/cms/blog-posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const token = (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

  const load = async () => {
    setLoading(true)
    const data = await fetchPosts(token)
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    await deletePost(id, token)
    await load()
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Blog Posts</Heading>
        <Button asChild size="small">
          <Link to="/cms/blog/new">New Post</Link>
        </Button>
      </div>
      {loading ? (
        <Text>Loading...</Text>
      ) : posts.length === 0 ? (
        <Text>No posts yet.</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Published</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {posts.map((post) => (
              <Table.Row key={post.id}>
                <Table.Cell>{post.title}</Table.Cell>
                <Table.Cell>{post.slug}</Table.Cell>
                <Table.Cell>
                  <Badge color={post.status === "published" ? "green" : "grey"}>
                    {post.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : "—"}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="small" asChild>
                      <Link to={`/cms/blog/${post.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}
```

**Step 3: Blog edit/create page**

```tsx
// backend/src/admin/routes/cms/blog/[id]/page.tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Container, Heading, Input, Label, Select, Textarea } from "@medusajs/ui"

const isNew = (id: string) => id === "new"

const token = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!isNew(id!))
  const [saving, setSaving] = useState(false)
  const [coverUrl, setCoverUrl] = useState("")
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    author: "",
    content: "",
    status: "draft" as "draft" | "published",
    cover_image_url: "",
  })

  useEffect(() => {
    if (isNew(id!)) return
    fetch(`/admin/cms/blog-posts/${id}`, {
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then((r) => r.json())
      .then(({ post }) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          author: post.author ?? "",
          content: post.content ?? "",
          status: post.status,
          cover_image_url: post.cover_image_url ?? "",
        })
        setCoverUrl(post.cover_image_url ?? "")
        setLoading(false)
      })
  }, [id])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === "title" && isNew(id!)) {
      setForm((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/admin/cms/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: formData,
    })
    const { url } = await res.json()
    setCoverUrl(url)
    setForm((prev) => ({ ...prev, cover_image_url: url }))
  }

  const handleSave = async () => {
    setSaving(true)
    const method = isNew(id!) ? "POST" : "PUT"
    const url = isNew(id!)
      ? "/admin/cms/blog-posts"
      : `/admin/cms/blog-posts/${id}`

    await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })

    setSaving(false)
    navigate("/cms/blog")
  }

  if (loading) return <Container><p>Loading...</p></Container>

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">{isNew(id!) ? "New Post" : "Edit Post"}</Heading>
        <div className="flex gap-2">
          <Button variant="secondary" size="small" onClick={() => navigate("/cms/blog")}>
            Cancel
          </Button>
          <Button size="small" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl">
        <div>
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
        </div>
        <div>
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} />
        </div>
        <div>
          <Label>Author</Label>
          <Input value={form.author} onChange={(e) => handleChange("author", e.target.value)} />
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea
            value={form.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <Label>Content (Markdown)</Label>
          <Textarea
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => handleChange("status", v)}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="draft">Draft</Select.Item>
              <Select.Item value="published">Published</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div>
          <Label>Cover Image</Label>
          {coverUrl && (
            <img src={coverUrl} alt="cover" className="w-full max-h-48 object-cover mb-2 rounded" />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.cover_image_url && (
            <p className="text-xs text-gray-500 mt-1">{form.cover_image_url}</p>
          )}
        </div>
      </div>
    </Container>
  )
}
```

**Step 4: Verify in browser**

Navigate to `http://localhost:9000/app/cms/blog` — should show Blog Posts page with New Post button.

**Step 5: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/admin/routes/cms/
git commit -m "feat(cms): add admin UI blog management pages"
```

---

## Task 8: Admin UI — Banner + Static Page management

**Files:**
- Create: `backend/src/admin/routes/cms/banners/page.tsx`
- Create: `backend/src/admin/routes/cms/pages/page.tsx`
- Create: `backend/src/admin/routes/cms/pages/[id]/page.tsx`

**Step 1: Banner management page** (edit-in-place, two banners max)

```tsx
// backend/src/admin/routes/cms/banners/page.tsx
import { useEffect, useState } from "react"
import { Button, Container, Heading, Input, Label, Textarea } from "@medusajs/ui"

type Banner = {
  id: string
  key: string
  headline: string
  text: string
  cta_text: string
  cta_link: string
  image_url: string
}

const token = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, Banner>>({})

  useEffect(() => {
    fetch("/admin/cms/banners", {
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then((r) => r.json())
      .then(({ banners }) => {
        setBanners(banners)
        const init: Record<string, Banner> = {}
        banners.forEach((b: Banner) => (init[b.id] = { ...b }))
        setForms(init)
      })
  }, [])

  const handleChange = (id: string, field: string, value: string) => {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/admin/cms/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: formData,
    })
    const { url } = await res.json()
    handleChange(id, "image_url", url)
  }

  const handleSave = async (id: string) => {
    setSaving(id)
    await fetch(`/admin/cms/banners/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forms[id]),
    })
    setSaving(null)
    alert("Saved!")
  }

  return (
    <Container>
      <Heading level="h1" className="mb-6">Banners</Heading>
      <div className="flex flex-col gap-8">
        {banners.map((banner) => {
          const form = forms[banner.id]
          if (!form) return null
          return (
            <div key={banner.id} className="border rounded p-6">
              <Heading level="h2" className="mb-4 capitalize">{banner.key} Banner</Heading>
              <div className="flex flex-col gap-3 max-w-2xl">
                <div>
                  <Label>Headline</Label>
                  <Input value={form.headline} onChange={(e) => handleChange(banner.id, "headline", e.target.value)} />
                </div>
                <div>
                  <Label>Text</Label>
                  <Textarea value={form.text} onChange={(e) => handleChange(banner.id, "text", e.target.value)} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>CTA Text</Label>
                    <Input value={form.cta_text} onChange={(e) => handleChange(banner.id, "cta_text", e.target.value)} />
                  </div>
                  <div>
                    <Label>CTA Link</Label>
                    <Input value={form.cta_link} onChange={(e) => handleChange(banner.id, "cta_link", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Image</Label>
                  {form.image_url && (
                    <img src={form.image_url} alt="banner" className="w-full max-h-48 object-cover mb-2 rounded" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(banner.id, e)} className="mb-1" />
                  <Input
                    value={form.image_url}
                    onChange={(e) => handleChange(banner.id, "image_url", e.target.value)}
                    placeholder="Or enter URL directly"
                  />
                </div>
                <Button
                  size="small"
                  onClick={() => handleSave(banner.id)}
                  disabled={saving === banner.id}
                >
                  {saving === banner.id ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
```

**Step 2: Static pages list page**

```tsx
// backend/src/admin/routes/cms/pages/page.tsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Container, Heading, Table, Text } from "@medusajs/ui"

type Page = { id: string; slug: string; title: string }

const token = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/admin/cms/pages", { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then(({ pages }) => { setPages(pages); setLoading(false) })
  }, [])

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Static Pages</Heading>
        <Button asChild size="small"><Link to="/cms/pages/new">New Page</Link></Button>
      </div>
      {loading ? <Text>Loading...</Text> : pages.length === 0 ? <Text>No pages.</Text> : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {pages.map((page) => (
              <Table.Row key={page.id}>
                <Table.Cell>{page.slug}</Table.Cell>
                <Table.Cell>{page.title}</Table.Cell>
                <Table.Cell>
                  <Button variant="secondary" size="small" asChild>
                    <Link to={`/cms/pages/${page.id}`}>Edit</Link>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}
```

**Step 3: Static page edit page**

```tsx
// backend/src/admin/routes/cms/pages/[id]/page.tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Container, Heading, Input, Label, Textarea } from "@medusajs/ui"

const isNew = (id: string) => id === "new"
const token = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function PageEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!isNew(id!))
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ slug: "", title: "", content: "" })

  useEffect(() => {
    if (isNew(id!)) return
    fetch(`/admin/cms/pages/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then(({ page }) => { setForm({ slug: page.slug, title: page.title, content: page.content ?? "" }); setLoading(false) })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    const method = isNew(id!) ? "POST" : "PUT"
    const url = isNew(id!) ? "/admin/cms/pages" : `/admin/cms/pages/${id}`
    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    navigate("/cms/pages")
  }

  if (loading) return <Container><p>Loading...</p></Container>

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">{isNew(id!) ? "New Page" : "Edit Page"}</Heading>
        <div className="flex gap-2">
          <Button variant="secondary" size="small" onClick={() => navigate("/cms/pages")}>Cancel</Button>
          <Button size="small" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 max-w-2xl">
        <div><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
        <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} /></div>
        <div><Label>Content (Markdown)</Label><Textarea value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} rows={20} className="font-mono text-sm" /></div>
      </div>
    </Container>
  )
}
```

**Step 4: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add backend/src/admin/routes/cms/banners/ backend/src/admin/routes/cms/pages/
git commit -m "feat(cms): add admin UI for banner and static page management"
```

---

## Task 9: Storefront — replace blog data fetching

**Files:**
- Modify: `storefront/src/lib/data/blog.ts`
- Modify: `storefront/src/modules/blog/templates/blog-detail/index.tsx`
- Modify: `storefront/src/app/[countryCode]/(main)/blog/page.tsx`
- Modify: `storefront/src/app/[countryCode]/(main)/blog/[slug]/page.tsx`

**Step 1: Replace `src/lib/data/blog.ts` with API-based fetching**

Read current file first, then replace entirely:

```typescript
// storefront/src/lib/data/blog.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string | null
  cover_image_url: string | null
  published_at: string | null
  content: string
  tags: string[] | null
}

export async function getAllPosts(): Promise<Omit<BlogPost, "content">[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms/blog-posts`, {
      next: { tags: ["cms-blog"] },
    })
    if (!res.ok) return []
    const { posts } = await res.json()
    return posts ?? []
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms/blog-posts/${slug}`, {
      next: { tags: [`cms-blog-${slug}`] },
    })
    if (!res.ok) return null
    const { post } = await res.json()
    return post ?? null
  } catch {
    return null
  }
}
```

**Step 2: Update blog-list template** — it currently calls `getAllPosts()` synchronously; it now needs to be async.

Read `storefront/src/modules/blog/templates/blog-list/index.tsx`. If it calls `getAllPosts()` without `await`, add `await`:

The template should look like:
```tsx
// storefront/src/modules/blog/templates/blog-list/index.tsx
import { getAllPosts } from '@lib/data/blog'
import BlogCard from '@modules/blog/components/blog-card'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'

export default async function BlogListTemplate() {
  const posts = await getAllPosts()

  return (
    <Container className="py-12">
      <Heading className="mb-8 text-basic-primary text-3xl">Blog</Heading>
      {posts.length === 0 ? (
        <p className="text-secondary">No posts yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 medium:grid-cols-2 large:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={post.published_at ?? ""}
              excerpt={post.excerpt}
              author={post.author ?? ""}
            />
          ))}
        </div>
      )}
    </Container>
  )
}
```

**Step 3: Update homepage to use async getAllPosts**

Read `storefront/src/app/[countryCode]/(main)/page.tsx`. Change:
```typescript
// OLD:
const posts = getAllPosts().slice(0, 3)

// NEW:
const [postsAll] = await Promise.all([getAllPosts()])  // add to existing Promise.all
const posts = postsAll.slice(0, 3)
```

Actually, simpler — add `getAllPosts()` to the existing `Promise.all`:
```typescript
const [{ collections }, { response: { products } }, region, posts] = await Promise.all([
  getCollectionsList(),
  getProductsList({ pageParam: 0, queryParams: { limit: 9 }, countryCode }),
  getRegion(countryCode),
  getAllPosts(),
])
// then use posts.slice(0, 3) directly
```

**Step 4: Verify blog page works**

```bash
cd /d/workspace/standalone-website/e-commerce/storefront
npm run dev
# Visit http://localhost:8000/us/blog
# Expected: blog posts list from database
```

**Step 5: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add storefront/src/lib/data/blog.ts storefront/src/modules/blog/ storefront/src/app/
git commit -m "feat(cms): replace MDX blog fetching with CMS API"
```

---

## Task 10: Storefront — replace banners with API data

**Files:**
- Create: `storefront/src/lib/data/cms.ts`
- Modify: `storefront/src/app/[countryCode]/(main)/page.tsx`
- Delete: `storefront/src/lib/config/home.ts` (optional — can keep as fallback)

**Step 1: Create `src/lib/data/cms.ts`**

```typescript
// storefront/src/lib/data/cms.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type BannerData = {
  id: string
  key: string
  headline: string
  text: string
  cta_text: string
  cta_link: string
  image_url: string
}

export type StaticPageData = {
  id: string
  slug: string
  title: string
  content: string
}

export async function getBanner(key: string): Promise<BannerData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms/banners/${key}`, {
      next: { tags: [`cms-banner-${key}`] },
    })
    if (!res.ok) return null
    const { banner } = await res.json()
    return banner ?? null
  } catch {
    return null
  }
}

export async function getStaticPage(slug: string): Promise<StaticPageData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms/pages/${slug}`, {
      next: { tags: [`cms-page-${slug}`] },
    })
    if (!res.ok) return null
    const { page } = await res.json()
    return page ?? null
  } catch {
    return null
  }
}
```

**Step 2: Update homepage to use dynamic banners**

Read `storefront/src/app/[countryCode]/(main)/page.tsx`. Replace `heroBannerConfig` / `midBannerConfig` with API data:

```typescript
// Add to imports:
import { getBanner } from '@lib/data/cms'

// In the component, add banners to Promise.all:
const [{ collections }, { response: { products } }, region, posts, heroBanner, midBanner] =
  await Promise.all([
    getCollectionsList(),
    getProductsList({ pageParam: 0, queryParams: { limit: 9 }, countryCode }),
    getRegion(countryCode),
    getAllPosts(),
    getBanner("hero"),
    getBanner("mid"),
  ])

// Fallback config in case CMS isn't seeded yet:
import { heroBannerConfig, midBannerConfig } from '@lib/config/home'

const heroData = heroBanner
  ? { headline: heroBanner.headline, text: heroBanner.text, cta: { text: heroBanner.cta_text, link: heroBanner.cta_link }, image: { url: heroBanner.image_url, alt: "Hero banner" } }
  : heroBannerConfig

const midData = midBanner
  ? { headline: midBanner.headline, text: midBanner.text, cta: { text: midBanner.cta_text, link: midBanner.cta_link }, image: { url: midBanner.image_url, alt: "Mid banner" } }
  : midBannerConfig

// Replace <Hero data={heroBannerConfig} /> with <Hero data={heroData} />
// Replace <Banner data={midBannerConfig} /> with <Banner data={midData} />
```

**Step 3: Verify homepage banners come from DB**

```bash
# Visit http://localhost:8000/us
# Hero and mid-banner text should match what was seeded in Task 6
# Change via admin: http://localhost:9000/app/cms/banners — update headline — reload homepage
```

**Step 4: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add storefront/src/lib/data/cms.ts storefront/src/app/
git commit -m "feat(cms): replace hardcoded banners with CMS API data"
```

---

## Task 11: Storefront — replace static pages with API data

**Files:**
- Modify: `storefront/src/modules/content/templates/content-page/index.tsx`

**Step 1: Read current content-page template**

```bash
cat storefront/src/modules/content/templates/content-page/index.tsx
```

**Step 2: Update to fetch from CMS API**

The current template reads MDX files. Replace it to fetch from the CMS:

```tsx
// storefront/src/modules/content/templates/content-page/index.tsx
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { getStaticPage } from '@lib/data/cms'
import { notFound } from 'next/navigation'

async function renderMarkdown(content: string) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
  const mdast = processor.parse(content)
  const hast = await processor.run(mdast)
  return toJsxRuntime(hast, { Fragment, jsx: jsx as any, jsxs: jsxs as any })
}

export default async function ContentPageTemplate({ slug }: { slug: string }) {
  const page = await getStaticPage(slug)
  if (!page) notFound()

  const content = await renderMarkdown(page.content)

  return (
    <div className="content-container py-12 max-w-3xl">
      <h1 className="mb-8 text-basic-primary">{page.title}</h1>
      <article className="prose prose-neutral dark:prose-invert max-w-none text-basic-primary">
        {content}
      </article>
    </div>
  )
}
```

**Step 3: Update each static page to pass slug**

Read one of the static pages, e.g. `storefront/src/app/[countryCode]/(main)/about-us/page.tsx`. It probably calls `<ContentPageTemplate />` with some content. Update to pass `slug="about-us"`.

Repeat for `faq`, `privacy-policy`, `terms-and-conditions`.

Each page should look like:
```tsx
export const dynamic = 'force-dynamic'

export default function AboutUsPage() {
  return <ContentPageTemplate slug="about-us" />
}
```

**Step 4: Verify static pages**

```bash
# Visit http://localhost:8000/us/about-us
# Should show content from CMS database
# Edit via admin: http://localhost:9000/app/cms/pages — update content — reload page
```

**Step 5: Commit**

```bash
cd /d/workspace/standalone-website/e-commerce
git add storefront/src/modules/content/ storefront/src/app/
git commit -m "feat(cms): replace static MDX pages with CMS API data"
```

---

## Task 12: Final verification + push

**Step 1: TypeScript check on backend**

```bash
cd /d/workspace/standalone-website/e-commerce/backend
npx tsc --noEmit 2>&1 | head -30
```

Fix any errors (wrong import paths, type mismatches in route handlers).

**Step 2: TypeScript check on storefront**

```bash
cd /d/workspace/standalone-website/e-commerce/storefront
npx tsc --noEmit 2>&1 | head -30
```

**Step 3: Full end-to-end smoke test**

- [ ] Backend runs: `npx medusa develop` → no errors
- [ ] `GET /store/cms/blog-posts` → `{"posts":[]}`
- [ ] `GET /store/cms/banners/hero` → returns hero banner data
- [ ] `GET /store/cms/pages/about-us` → returns about-us page data
- [ ] Admin UI: `http://localhost:9000/app/cms/blog` → blog list renders
- [ ] Create a blog post in admin → appears at `GET /store/cms/blog-posts`
- [ ] Storefront homepage: `http://localhost:8000/us` → banners load from DB
- [ ] Blog page: `http://localhost:8000/us/blog` → posts from DB
- [ ] About Us page: `http://localhost:8000/us/about-us` → content from DB

**Step 4: Push to Railway**

```bash
cd /d/workspace/standalone-website/e-commerce
git push
```

Railway auto-deploys. After deploy:
- Run seed on prod: connect to Railway backend and run `npx medusa exec ./src/scripts/seed-cms.ts`
- Or create banners/pages via Admin UI after deploy
