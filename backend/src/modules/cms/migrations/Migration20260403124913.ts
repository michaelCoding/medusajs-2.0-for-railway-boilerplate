import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260403124913 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cms_static_page" drop constraint if exists "cms_static_page_slug_unique";`);
    this.addSql(`alter table if exists "cms_product_extra" drop constraint if exists "cms_product_extra_product_id_unique";`);
    this.addSql(`alter table if exists "cms_blog_post" drop constraint if exists "cms_blog_post_slug_unique";`);
    this.addSql(`alter table if exists "cms_banner" drop constraint if exists "cms_banner_key_unique";`);
    this.addSql(`create table if not exists "cms_banner" ("id" text not null, "key" text not null, "headline" text not null, "text" text not null, "cta_text" text not null, "cta_link" text not null, "image_url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_banner_key_unique" ON "cms_banner" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_banner_deleted_at" ON "cms_banner" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "cms_blog_post" ("id" text not null, "title" text not null, "slug" text not null, "excerpt" text not null, "content" text not null, "cover_image_url" text null, "author" text null, "status" text check ("status" in ('draft', 'published')) not null default 'draft', "published_at" timestamptz null, "tags" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_blog_post_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_blog_post_slug_unique" ON "cms_blog_post" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_blog_post_deleted_at" ON "cms_blog_post" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "cms_product_extra" ("id" text not null, "product_id" text not null, "highlights" jsonb null, "story" text null, "care_instructions" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_product_extra_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_product_extra_product_id_unique" ON "cms_product_extra" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_product_extra_deleted_at" ON "cms_product_extra" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "cms_static_page" ("id" text not null, "slug" text not null, "title" text not null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_static_page_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_static_page_slug_unique" ON "cms_static_page" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_static_page_deleted_at" ON "cms_static_page" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_banner" cascade;`);

    this.addSql(`drop table if exists "cms_blog_post" cascade;`);

    this.addSql(`drop table if exists "cms_product_extra" cascade;`);

    this.addSql(`drop table if exists "cms_static_page" cascade;`);
  }

}
