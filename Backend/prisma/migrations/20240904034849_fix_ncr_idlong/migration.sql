-- AlterTable
ALTER TABLE "ncr_initial" ADD COLUMN     "document_id" VARCHAR(255),
ALTER COLUMN "audit_plan_no" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "ncr_no" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "tbl_occurrence" ADD COLUMN     "document_id" VARCHAR(255);
