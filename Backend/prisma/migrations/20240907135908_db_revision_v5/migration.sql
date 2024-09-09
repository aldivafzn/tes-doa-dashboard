-- CreateEnum
CREATE TYPE "cert_type" AS ENUM ('Authorization', 'License');

-- CreateEnum
CREATE TYPE "training_category" AS ENUM ('Regulatory Mandatory', 'Regulatory Non-Mandatory', 'Competence Requirement', 'Additional');

-- CreateTable
CREATE TABLE "certification" (
    "cert_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "regulation_based" "reg_based" NOT NULL,
    "cert_type" "cert_type" NOT NULL,
    "cert_number" VARCHAR(255) NOT NULL,
    "cert_first_date" DATE NOT NULL,
    "cert_expire_date" DATE NOT NULL,
    "cert_letter_nbr" VARCHAR(255) NOT NULL,
    "cert_scope" VARCHAR(255) NOT NULL,
    "person_id" UUID
);

-- CreateTable
CREATE TABLE "education" (
    "edu_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "university" VARCHAR(255) NOT NULL,
    "major" VARCHAR(50) NOT NULL,
    "graduation_year" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "person_id" UUID
);

-- CreateTable
CREATE TABLE "experience_record" (
    "experience_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_title" VARCHAR(255) NOT NULL,
    "since_date" DATE NOT NULL,
    "until_date" DATE NOT NULL,
    "assignment" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "person_id" UUID
);

-- CreateTable
CREATE TABLE "tbl_personnel" (
    "person_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "person_name" VARCHAR(255) NOT NULL,
    "person_no" VARCHAR(50) NOT NULL,
    "job_title" VARCHAR(255) NOT NULL,
    "department" "office_code" NOT NULL,
    "email_address" VARCHAR(70) NOT NULL,
    "birth_date" DATE NOT NULL,
    "employment_date" DATE NOT NULL,
    "job_desc" TEXT NOT NULL,
    "design_exp" TEXT NOT NULL,

    CONSTRAINT "tbl_personnel_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "training_record" (
    "training_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "training_title" VARCHAR(255) NOT NULL,
    "training_category" "training_category" NOT NULL,
    "start_date" DATE NOT NULL,
    "finish_date" DATE NOT NULL,
    "interval_recurrent" INTEGER NOT NULL,
    "next_date" DATE NOT NULL,
    "place" VARCHAR(255) NOT NULL,
    "result" VARCHAR(255) NOT NULL,
    "remark" VARCHAR(255) NOT NULL,
    "person_id" UUID
);

-- AddForeignKey
ALTER TABLE "certification" ADD CONSTRAINT "certification_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "tbl_personnel"("person_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "tbl_personnel"("person_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "experience_record" ADD CONSTRAINT "experience_record_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "tbl_personnel"("person_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "tbl_personnel"("person_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
