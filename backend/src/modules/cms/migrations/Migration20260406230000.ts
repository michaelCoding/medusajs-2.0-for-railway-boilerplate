import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260406230000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "IDX_cms_video_key_unique";`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_video_key" ON "cms_video" ("key") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "IDX_cms_video_key";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_video_key_unique" ON "cms_video" ("key") WHERE deleted_at IS NULL;`);
  }

}
