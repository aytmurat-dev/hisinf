import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "language" varchar DEFAULT 'both';
    ALTER TABLE "readers" ADD COLUMN IF NOT EXISTS "role" varchar DEFAULT 'reader';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "language";
    ALTER TABLE "readers" DROP COLUMN IF EXISTS "role";
  `)
}
