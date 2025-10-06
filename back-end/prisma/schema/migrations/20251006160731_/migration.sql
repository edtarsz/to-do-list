/*
  Warnings:

  - Made the column `startDate` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dueDate` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dueTime` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."tasks" ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "dueDate" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "dueTime" SET NOT NULL;
