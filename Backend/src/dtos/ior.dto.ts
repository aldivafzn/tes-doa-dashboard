import {
  IsString,
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateOccurrenceDto {
  @IsString()
  readonly subject_ior: string;

  @IsString()
  readonly category_occur: string;

  @IsString()
  readonly occur_nbr: string;

  @IsDate()
  @IsOptional()
  readonly occur_date?: Date;

  @IsString()
  @IsOptional()
  readonly reference_ior?: string;

  @IsString()
  @IsOptional()
  readonly type_or_pnbr?: string;

  @IsString()
  @IsOptional()
  readonly to_uic?: string;

  @IsString()
  @IsOptional()
  readonly cc_uic?: string;

  @IsString()
  @IsOptional()
  readonly level_type?: string;

  @IsString()
  @IsOptional()
  readonly detail_occurance?: string;

  @IsString()
  readonly ReportedBy: string;

  @IsString()
  @IsOptional()
  readonly reporter_uic?: string;

  @IsDate()
  @IsOptional()
  readonly report_date?: Date;

  @IsString()
  @IsOptional()
  readonly reporter_identity?: string;

  @IsString()
  @IsOptional()
  readonly Data_reference?: string;

  @IsString()
  @IsOptional()
  readonly hirac_process?: string;

  @IsString()
  @IsOptional()
  readonly initial_probability?: string;

  @IsString()
  @IsOptional()
  readonly initial_severity?: string;

  @IsString()
  @IsOptional()
  readonly initial_riskindex?: string;
}

export class ShowOccurrenceDto {
  @IsString()
  readonly id_IOR: string;
}

export class ShowAllOccurrencesDto {
  // Define any optional filters or parameters for showing all occurrences
}

// DTO for searching IORs
export class SearchIORDto {
  @IsString()
  readonly input: string;
}

// DTO for updating an occurrence
export class UpdateOccurrenceDto {
  @IsString()
  readonly id_ior: string;

  @IsString()
  @IsOptional()
  readonly subject_ior?: string;

  @IsString()
  @IsOptional()
  readonly occur_nbr?: string;

  @IsDate()
  @IsOptional()
  readonly occur_date?: Date;

  @IsString()
  @IsOptional()
  readonly reference_ior?: string;

  @IsString()
  @IsOptional()
  readonly to_uic?: string;

  @IsString()
  @IsOptional()
  readonly cc_uic?: string;

  @IsString()
  @IsOptional()
  readonly category_occur?: string;

  @IsString()
  @IsOptional()
  readonly type_or_pnbr?: string;

  @IsString()
  @IsOptional()
  readonly level_type?: string;

  @IsString()
  @IsOptional()
  readonly detail_occurance?: string;

  @IsString()
  @IsOptional()
  readonly ReportedBy?: string;

  @IsString()
  @IsOptional()
  readonly reporter_uic?: string;

  @IsDate()
  @IsOptional()
  readonly report_date?: Date;

  @IsString()
  @IsOptional()
  readonly reporter_identity?: string;

  @IsString()
  @IsOptional()
  readonly Data_reference?: string;

  @IsString()
  @IsOptional()
  readonly hirac_process?: string;

  @IsString()
  @IsOptional()
  readonly initial_probability?: string;

  @IsString()
  @IsOptional()
  readonly initial_severity?: string;

  @IsString()
  @IsOptional()
  readonly initial_riskindex?: string;
}

// DTO for deleting an occurrence
export class DeleteOccurrenceDto {
  @IsString()
  readonly id_ior: string;
}

export class AddCategoryIORDto {
  @IsNotEmpty()
  @IsString()
  readonly id_IOR: string;

  @IsOptional()
  @IsString()
  readonly number_cat?: string;

  @IsOptional()
  @IsString()
  readonly occur_nbr?: string;
}

export class AddFollowUpOccurrenceDto {
  @IsNotEmpty()
  @IsString()
  readonly id_IOR: string;

  @IsOptional()
  @IsString()
  readonly follup_detail?: string;

  @IsOptional()
  @IsString()
  readonly follupby?: string;

  @IsOptional()
  @IsString()
  readonly follup_uic?: string;

  @IsOptional()
  @IsDate()
  readonly follup_date?: Date;

  @IsOptional()
  @IsBoolean()
  readonly follup_datarefer?: boolean;

  @IsOptional()
  @IsString()
  readonly follup_status?: string;

  @IsOptional()
  @IsString()
  readonly nextuic_follup?: string;

  @IsOptional()
  @IsString()
  readonly current_probability?: string;

  @IsOptional()
  @IsString()
  readonly current_severity?: string;

  @IsOptional()
  @IsString()
  readonly current_riskindex?: string;
}

export class ShowFollowUpOccurrenceDto {
  @IsString()
  readonly id_follup: string;
}

export class UpdateFollowUpOccurrenceDto extends AddFollowUpOccurrenceDto {}
