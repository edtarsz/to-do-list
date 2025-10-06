/*
  Warnings:

  - You are about to drop the column `listid` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_listid_fkey";

-- AlterTable
ALTER TABLE "public"."tasks" DROP COLUMN "listid",
ADD COLUMN     "listId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_listId_fkey" FOREIGN KEY ("listId") REFERENCES "public"."lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
