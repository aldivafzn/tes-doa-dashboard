/*
  Warnings:

  - Made the column `ncr_init_id` on table `ncr_followresult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ncr_followresult" ALTER COLUMN "ncr_init_id" SET NOT NULL,
ADD CONSTRAINT "ncr_followresult_pkey" PRIMARY KEY ("ncr_init_id");
