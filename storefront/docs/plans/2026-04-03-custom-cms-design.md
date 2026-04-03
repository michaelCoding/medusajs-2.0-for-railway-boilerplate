# Custom CMS Design

## Goal

Replace static MDX files and hardcoded config with a database-backed CMS integrated into the Medusa backend. Manage blog posts, homepage banners, static pages, and product extras from the Medusa Admin UI.

## Approach

Build a `cms` Medusa custom module with four models. Expose public store API routes for the storefront and protected admin API routes for the Admin UI. Add three custom pages to Medusa Admin for content management. Images upload to the existing MinIO deployment.

---

## Data Models

### BlogPost

| Field | Type | Notes |
|-------|------|-------|
| id | string (ulid) | PK |
| title | string | |
| slug | string (unique) | URL slug |
| excerpt | string | |
| content | text | Markdown |
| cover_image_url | string? | |
| author | string? | |
| status | enum: draft / published | |
| published_at | datetime? | |
| tags | string[]? | stored as JSON array |

### Banner

| Field | Type | Notes |
|-------|------|-------|
| id | string | PK |
| key | string (unique) | `hero` or `mid` |
| headline | string | |
| text | string | |
| cta_text | string | |
| cta_link | string | |
| image_url | string | |

### StaticPage

| Field | Type | Notes |
|-------|------|-------|
| id | string | PK |
| slug | string (unique) | e.g. `about-us`, `faq` |
| title | string | |
| content | text | Markdown |

### ProductExtra

| Field | Type | Notes |
|-------|------|-------|
| id | string | PK |
| product_id | string | Medusa product ID |
| highlights | jsonb | string[] |
| story | text | Markdown |
| care_instructions | text | |

---

## Backend Architecture

```
backend/src/
  modules/cms/
    models/
      blog-post.ts
      banner.ts
      static-page.ts
      product-extra.ts
    service.ts           # CmsModuleService — CRUD methods
    index.ts             # module registration

  api/
    store/cms/
      blog-posts/route.ts              # GET list (published only)
      blog-posts/[slug]/route.ts       # GET detail
      banners/[key]/route.ts           # GET banner by key
      pages/[slug]/route.ts            # GET static page
      products/[id]/extra/route.ts     # GET product extra
    admin/cms/
      blog-posts/route.ts              # GET list + POST create
      blog-posts/[id]/route.ts         # GET + PUT + DELETE
      banners/route.ts                 # GET list
      banners/[id]/route.ts            # PUT update
      pages/route.ts                   # GET list + POST create
      pages/[id]/route.ts              # PUT + DELETE
      product-extras/route.ts          # GET + POST
      product-extras/[id]/route.ts     # PUT + DELETE
      upload/route.ts                  # POST image → MinIO, returns URL

  admin/
    routes/cms/page.tsx    # CMS admin page entry
    routes/cms/blog/
      page.tsx             # Blog list
      [id]/page.tsx        # Blog edit form
    routes/cms/banners/
      page.tsx             # Banner list + edit
    routes/cms/pages/
      page.tsx             # Static page list
      [id]/page.tsx        # Static page edit
```

Database migrations generated via `npx medusa db:generate cms`.

---

## Storefront Changes

| Current | New |
|---------|-----|
| `src/lib/data/blog.ts` reads MDX files | Fetch from `/store/cms/blog-posts` |
| `src/lib/config/home.ts` hardcoded banners | Fetch from `/store/cms/banners/:key` |
| MDX static pages (about-us etc.) | Fetch from `/store/cms/pages/:slug` |
| `src/lib/data/cms.ts` — does not exist | New file for banner + page + product extra fetching |

---

## Admin UI (3 pages)

### Blog management (`/admin/cms/blog`)
- List: title, status, published_at, Edit / Delete buttons
- Edit form: title, slug (auto-generated from title, editable), excerpt, author, Markdown textarea, cover image upload, status toggle (draft / published)

### Banner management (`/admin/cms/banners`)
- Two fixed records: `hero` and `mid`
- Edit form per banner: headline, text, CTA text, CTA link, image upload

### Static page management (`/admin/cms/pages`)
- List: slug, title, Edit button
- Edit form: title, Markdown textarea

### Image upload flow
- Upload button calls `POST /admin/cms/upload`
- Backend uses existing Medusa MinIO file provider
- Returns public URL, inserted into image_url field

---

## Out of Scope

- Rich text / WYSIWYG editor (Markdown textarea is sufficient)
- ProductExtra admin UI (can be added later as a product widget)
- Tag filtering / full-text search in admin
- Content scheduling / draft preview
