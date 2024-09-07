import { office_code } from '@prisma/client';
import { IsString, IsDate, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

/* 
    Personnel
*/
export class CreatePersonnelDto {
  @IsNotEmpty()
  @IsString()
  readonly person_name: string;

  @IsNotEmpty()
  @IsString()
  readonly person_no: string;

  @IsNotEmpty()
  @IsString()
  readonly job_title: string;

  @IsNotEmpty()
  @IsEnum(office_code)
  readonly department: office_code;

  @IsNotEmpty()
  @IsString()
  readonly email_address: string;

  @IsDate()
  @IsNotEmpty()
  readonly birth_date: Date;

  @IsDate()
  @IsNotEmpty()
  readonly employment_date: Date;

  @IsString()
  @IsNotEmpty()
  readonly job_desc: string;

  @IsString()
  @IsNotEmpty()
  readonly design_exp: string;
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
  readonly edu_id: string;

  @IsNotEmpty()
  @IsString()
  readonly major: string;

  @IsNotEmpty()
  @IsInt()
  readonly graduation_year: number;
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

export class ShowAllEducationDto {}

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
  readonly edu_id: string;

  @IsNotEmpty()
  @IsString()
  readonly major: string;

  @IsNotEmpty()
  @IsInt()
  readonly graduation_year: number;
}

export class UpdateExperienceDto extends AddExperienceDto {
  @IsString()
  @IsNotEmpty()
  edu_id: string;
}

export class DeleteExperienceDto {
  @IsString()
  @IsNotEmpty()
  readonly edu_id: string;
}

export class ShowAllExperienceDto {}

export class ShowExperienceByIdDto {
  @IsString()
  @IsNotEmpty()
  person_id: string;
}

/* 
    Personnel Training Records
*/

/* 
    Personnel Certification Records
*/
