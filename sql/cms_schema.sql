-- ============================================================
-- CMS Module — Table Definitions
-- Generated from migrations: Migration20260403124913, Migration20260406215528
-- ============================================================

-- ── cms_banner ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "cms_banner" (
  "id"         text        NOT NULL,
  "key"        text        NOT NULL,
  "headline"   text        NOT NULL,
  "text"       text        NOT NULL,
  "cta_text"   text        NOT NULL,
  "cta_link"   text        NOT NULL,
  "image_url"  text        NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "cms_banner_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_banner_key_unique"
  ON "cms_banner" ("key") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_cms_banner_deleted_at"
  ON "cms_banner" ("deleted_at") WHERE deleted_at IS NULL;

-- ── cms_video ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "cms_video" (
  "id"         text        NOT NULL,
  "key"        text        NOT NULL,
  "url"        text        NOT NULL,
  "title"      text        NOT NULL,
  "text"       text        NOT NULL,
  "tag"        text        NOT NULL,
  "duration"   text        NOT NULL,
  "poster_url" text        NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "cms_video_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "IDX_cms_video_key"
  ON "cms_video" ("key") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_cms_video_deleted_at"
  ON "cms_video" ("deleted_at") WHERE deleted_at IS NULL;

-- ── cms_blog_post ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "cms_blog_post" (
  "id"              text        NOT NULL,
  "title"           text        NOT NULL,
  "slug"            text        NOT NULL,
  "excerpt"         text        NOT NULL,
  "content"         text        NOT NULL,
  "cover_image_url" text        NULL,
  "author"          text        NULL,
  "status"          text        NOT NULL DEFAULT 'draft'
                    CHECK ("status" IN ('draft', 'published')),
  "published_at"    timestamptz NULL,
  "tags"            jsonb       NULL,
  "created_at"      timestamptz NOT NULL DEFAULT now(),
  "updated_at"      timestamptz NOT NULL DEFAULT now(),
  "deleted_at"      timestamptz NULL,
  CONSTRAINT "cms_blog_post_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_blog_post_slug_unique"
  ON "cms_blog_post" ("slug") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_cms_blog_post_deleted_at"
  ON "cms_blog_post" ("deleted_at") WHERE deleted_at IS NULL;

-- ── cms_static_page ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "cms_static_page" (
  "id"         text        NOT NULL,
  "slug"       text        NOT NULL,
  "title"      text        NOT NULL,
  "content"    text        NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "cms_static_page_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_static_page_slug_unique"
  ON "cms_static_page" ("slug") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_cms_static_page_deleted_at"
  ON "cms_static_page" ("deleted_at") WHERE deleted_at IS NULL;

-- ── cms_product_extra ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "cms_product_extra" (
  "id"                 text        NOT NULL,
  "product_id"         text        NOT NULL,
  "highlights"         jsonb       NULL,
  "story"              text        NULL,
  "care_instructions"  text        NULL,
  "created_at"         timestamptz NOT NULL DEFAULT now(),
  "updated_at"         timestamptz NOT NULL DEFAULT now(),
  "deleted_at"         timestamptz NULL,
  CONSTRAINT "cms_product_extra_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_product_extra_product_id_unique"
  ON "cms_product_extra" ("product_id") WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS "IDX_cms_product_extra_deleted_at"
  ON "cms_product_extra" ("deleted_at") WHERE deleted_at IS NULL;
