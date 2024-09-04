/*
  Warnings:

  - Made the column `implementation_date` on table `ncr_followresult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ncr_followresult" ALTER COLUMN "implementation_date" SET NOT NULL;
