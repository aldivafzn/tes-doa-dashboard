/*
  Warnings:

  - You are about to drop the column `problem_analysis` on the `ncr_initial` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "pa_req" AS ENUM ('Required', 'Not Required');

-- AlterTable
ALTER TABLE "ncr_followresult" ADD COLUMN     "implementation_date" DATE;

-- AlterTable
ALTER TABLE "ncr_initial" DROP COLUMN "problem_analysis",
ADD COLUMN     "pa_requirement" "pa_req";
