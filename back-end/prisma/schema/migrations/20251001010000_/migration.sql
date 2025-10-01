/*
  Warnings:

  - You are about to drop the column `createdAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `dueDateTime` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tasks" DROP COLUMN "createdAt",
DROP COLUMN "dueDateTime",
ADD COLUMN     "dueDate" TEXT,
ADD COLUMN     "dueTime" TEXT,
ADD COLUMN     "startDate" TEXT,
ADD COLUMN     "startTime" TEXT;
