-- AlterTable
ALTER TABLE "certification" ADD CONSTRAINT "certification_pkey" PRIMARY KEY ("cert_id");

-- AlterTable
ALTER TABLE "education" ADD CONSTRAINT "education_pkey" PRIMARY KEY ("edu_id");

-- AlterTable
ALTER TABLE "experience_record" ADD CONSTRAINT "experience_record_pkey" PRIMARY KEY ("experience_id");

-- AlterTable
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_pkey" PRIMARY KEY ("training_id");
