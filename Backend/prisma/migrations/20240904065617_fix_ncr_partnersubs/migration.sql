/*
  Warnings:

  - The values [Partner of Subcontractor] on the enum `category_occur` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "category_occur_new" AS ENUM ('DOA Management', 'Procedure', 'Document', 'Personnel', 'Facility', 'Partner or Subcontractor', 'Material', 'Information Technology', 'Training', 'Others');
ALTER TABLE "tbl_occurrence" ALTER COLUMN "category_occur" TYPE "category_occur_new" USING ("category_occur"::text::"category_occur_new");
ALTER TYPE "category_occur" RENAME TO "category_occur_old";
ALTER TYPE "category_occur_new" RENAME TO "category_occur";
DROP TYPE "category_occur_old";
COMMIT;
