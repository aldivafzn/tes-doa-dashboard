/*
  Warnings:

  - The primary key for the `ncr_followresult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ncr_reply` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ncr_followresult" DROP CONSTRAINT "ncr_followresult_ncr_init_id_fkey";

-- DropForeignKey
ALTER TABLE "ncr_reply" DROP CONSTRAINT "ncr_reply_ncr_init_id_fkey";

-- AlterTable
ALTER TABLE "ncr_followresult" DROP CONSTRAINT "ncr_followresult_pkey",
ADD COLUMN     "id_ncr_result" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "ncr_followresult_pkey" PRIMARY KEY ("id_ncr_result");

-- AlterTable
ALTER TABLE "ncr_reply" DROP CONSTRAINT "ncr_reply_pkey",
ADD COLUMN     "id_ncr_reply" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "ncr_reply_pkey" PRIMARY KEY ("id_ncr_reply");

-- AddForeignKey
ALTER TABLE "ncr_followresult" ADD CONSTRAINT "ncr_followresult_ncr_init_id_fkey" FOREIGN KEY ("ncr_init_id") REFERENCES "ncr_initial"("ncr_init_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ncr_reply" ADD CONSTRAINT "ncr_reply_ncr_init_id_fkey" FOREIGN KEY ("ncr_init_id") REFERENCES "ncr_initial"("ncr_init_id") ON DELETE RESTRICT ON UPDATE CASCADE;
