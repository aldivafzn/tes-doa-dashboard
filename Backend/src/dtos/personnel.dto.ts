import {
  cert_type,
  office_code,
  reg_based,
  training_category,
} from '@prisma/client';
import { IsString, IsDate, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

/* 
    Personnel
*/
export class CreatePersonnelDto {
  @IsNotEmpty()
  @IsString()
  person_name: string;

  @IsNotEmpty()
  @IsString()
  person_no: string;

  @IsNotEmpty()
  @IsString()
  job_title: string;

  @IsNotEmpty()
  @IsEnum(office_code)
  department: office_code;

  @IsNotEmpty()
  @IsString()
  email_address: string;

  @IsDate()
  @IsNotEmpty()
  birth_date: Date;

  @IsDate()
  @IsNotEmpty()
  employment_date: Date;

  @IsString()
  @IsNotEmpty()
  job_desc: string;

  @IsString()
  @IsNotEmpty()
  design_exp: string;
}

export class ShowAllPersonnelDto {}

export class ShowPersonnelByIdDto {
  @IsString()
  @IsNotEmpty()
  person_id: string;
}

export class SearchPersonnelDto {
  @IsString()
  @IsNotEmpty()
  readonly input: string;
}

export class UpdatePersonnelDto extends CreatePersonnelDto {
  @IsString()
  @IsNotEmpty()
  person_id: string;
}

export class DeletePersonnelDto {
  @IsString()
  @IsNotEmpty()
  readonly person_id: string;
}

/* 
    Personnel Education Records
*/
export class AddEducationDto {
  @IsNotEmpty()
  @IsString()
  readonly person_id: string;

  @IsNotEmpty()
  @IsString()
  readonly university: string;

  @IsNotEmpty()
  @IsString()
  readonly major: string;

  @IsNotEmpty()
  @IsInt()
  readonly graduation_year: number;

  @IsNotEmpty()
  @IsString()
  readonly remark: string;
}

export class UpdateEducationDto extends AddEducationDto {
  @IsString()
  @IsNotEmpty()
  edu_id: string;
}

export class DeleteEducationDto {
  @IsString()
  @IsNotEmpty()
  readonly edu_id: string;
}

export class ShowEducationByIdDto {
  @IsString()
  @IsNotEmpty()
  person_id: string;
}

/* 
    Personnel Experience Records
*/
export class AddExperienceDto {
  @IsNotEmpty()
  @IsString()
  readonly person_id: string;

  @IsNotEmpty()
  @IsString()
  readonly job_title: string;

  @IsDate()
  @IsNotEmpty()
  readonly since_date: Date;

  @IsDate()
  @IsNotEmpty()
  readonly until_date: Date;

  @IsNotEmpty()
  @IsString()
  readonly assignment: string;

  @IsNotEmpty()
  @IsString()
  readonly remark: string;
}

export class UpdateExperienceDto extends AddExperienceDto {
  @IsString()
  @IsNotEmpty()
  experience_id: string;
}

export class DeleteExperienceDto {
  @IsString()
  @IsNotEmpty()
  readonly experience_id: string;
}

export class ShowExperienceByIdDto {
  @IsString()
  @IsNotEmpty()
  person_id: string;
}

/* 
    Personnel Training Records
*/
export class AddTrainingDto {
  @IsNotEmpty()
  @IsString()
  readonly person_id: string;

  @IsNotEmpty()
  @IsString()
  readonly training_title: string;

  @IsNotEmpty()
  @IsEnum(training_category)
  readonly training_category: training_category;

  @IsDate()
  @IsNotEmpty()
  readonly start_date: Date;

  @IsDate()
  @IsNotEmpty()
  readonly finish_date: Date;

  @IsNotEmpty()
  @IsInt()
  readonly interval_recurrent: number;

  @IsDate()
  @IsNotEmpty()
  readonly next_date: Date;

  @IsNotEmpty()
  @IsString()
  readonly place: string;

  @IsNotEmpty()
  @IsString()
  readonly result: string;

  @IsNotEmpty()
  @IsString()
  readonly remark: string;
}

export class UpdateTrainingDto extends AddTrainingDto {
  @IsString()
  @IsNotEmpty()
  training_id: string;
}

export class DeleteTrainingDto {
  @IsString()
  @IsNotEmpty()
  readonly training_id: string;
}

export class ShowTrainingByIdDto {
  @IsString()
  @IsNotEmpty()
  person_id: string;
}

/* 
    Personnel Certification Records
*/
export class AddCertDto {
  @IsNotEmpty()
  @IsString()
  readonly person_id: string;

  @IsNotEmpty()
  @IsEnum(reg_based)
  readonly regulation_based: reg_based;

  @IsNotEmpty()
  @IsEnum(cert_type)
  readonly cert_type: cert_type;

  @IsNotEmpty()
  @IsString()
  readonly cert_number: string;

  @IsDate()
  @IsNotEmpty()
  readonly cert_first_date: Date;

  @IsDate()
  @IsNotEmpty()
  readonly cert_expire_date: Date;

  @IsNotEmpty()
  @IsString()
  readonly cert_letter_nbr: string;

  @IsNotEmpty()
  @IsString()
  readonly cert_scope: string;
}

export class UpdateCertDto extends AddCertDto {
  @IsString()
  @IsNotEmpty()
  cert_id: string;
}

export class DeleteCertDto {
  @IsString()
  @IsNotEmpty()
  readonly cert_id: string;
}

export class ShowCertByIdDto {
  @IsString()
  @IsNotEmpty()
  person_id: string;
}
