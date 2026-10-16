import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "periods" ADD COLUMN IF NOT EXISTS "language" varchar DEFAULT 'both';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "periods" DROP COLUMN IF EXISTS "language";
  `)
}
