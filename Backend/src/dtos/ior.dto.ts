import {
  category_occur,
  follups_status,
  level_type,
  uic,
} from '@prisma/client';
import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
} from 'class-validator';

/* 
    IOR DTO 
*/
export class CreateOccurrenceDto {
  @IsNotEmpty()
  @IsString()
  readonly subject_ior: string;

  @IsNotEmpty()
  @IsEnum(category_occur)
  readonly category_occur: category_occur;

  @IsNotEmpty()
  @IsString()
  readonly occur_nbr: string;

  @IsDate()
  @IsNotEmpty()
  readonly occur_date?: Date;

  @IsString()
  @IsNotEmpty()
  readonly reference_ior?: string;

  @IsString()
  @IsNotEmpty()
  readonly type_or_pnbr?: string;

  @IsEnum(uic)
  @IsNotEmpty()
  readonly to_uic?: uic;

  @IsEnum(uic)
  @IsNotEmpty()
  readonly cc_uic?: uic;

  @IsEnum(level_type)
  @IsNotEmpty()
  readonly level_type?: level_type;

  @IsString()
  @IsNotEmpty()
  readonly detail_occurance?: string;

  @IsString()
  @IsNotEmpty()
  readonly ReportedBy: string;

  @IsEnum(uic)
  @IsNotEmpty()
  readonly reporter_uic?: uic;

  @IsDate()
  @IsNotEmpty()
  readonly report_date?: Date;

  @IsString()
  @IsNotEmpty()
  readonly reporter_identity?: string;

  @IsString()
  @IsNotEmpty()
  readonly Data_reference?: string;

  @IsString()
  @IsNotEmpty()
  readonly hirac_process?: string;

  @IsString()
  @IsNotEmpty()
  readonly initial_probability?: string;

  @IsString()
  @IsNotEmpty()
  readonly initial_severity?: string;

  @IsString()
  @IsNotEmpty()
  readonly initial_riskindex?: string;

  @IsNotEmpty()
  @IsString()
  readonly attachment: string;
}

export class ShowOccurrenceDto {
  @IsString()
  @IsNotEmpty()
  readonly id_IOR: string;
}

export class ShowAllOccurrencesDto {
  // Define any optional filters or parameters for showing all occurrences
}

// DTO for searching IORs
export class SearchIORDto {
  @IsString()
  @IsNotEmpty()
  readonly input: string;
}

// DTO for updating an occurrence
export class UpdateOccurrenceDto extends CreateOccurrenceDto {
  @IsString()
  @IsNotEmpty()
  id_ior: string;
}

// DTO for deleting an occurrence
export class DeleteOccurrenceDto {
  @IsString()
  @IsNotEmpty()
  readonly id_ior: string;
}

/* 
    IOR Follow Up DTO 
*/
export class AddFollowUpOccurrenceDto {
  @IsNotEmpty()
  @IsString()
  readonly id_IOR: string;

  @IsNotEmpty()
  @IsString()
  readonly follup_detail?: string;

  @IsNotEmpty()
  @IsString()
  readonly follupby?: string;

  @IsNotEmpty()
  @IsEnum(uic)
  readonly follup_uic?: uic;

  @IsNotEmpty()
  @IsDate()
  readonly follup_date?: Date;

  @IsNotEmpty()
  @IsBoolean()
  readonly follup_datarefer?: boolean;

  @IsNotEmpty()
  @IsEnum(follups_status)
  readonly follup_status?: follups_status;

  @IsNotEmpty()
  @IsEnum(uic)
  readonly nextuic_follup?: uic;

  @IsNotEmpty()
  @IsString()
  readonly current_probability?: string;

  @IsNotEmpty()
  @IsString()
  readonly current_severity?: string;

  @IsNotEmpty()
  @IsString()
  readonly current_riskindex?: string;
}

export class ShowFollowUpOccurrenceDto {
  @IsNotEmpty()
  @IsString()
  readonly id_follup: string;
}

export class UpdateFollowUpOccurrenceDto extends AddFollowUpOccurrenceDto {}
