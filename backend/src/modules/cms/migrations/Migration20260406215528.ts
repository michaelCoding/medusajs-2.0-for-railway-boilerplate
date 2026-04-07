import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260406215528 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "cms_video" ("id" text not null, "key" text not null, "url" text not null, "title" text not null, "text" text not null, "tag" text not null, "duration" text not null, "poster_url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_video_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_video_key_unique" ON "cms_video" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_video_deleted_at" ON "cms_video" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_video" cascade;`);
  }

}
