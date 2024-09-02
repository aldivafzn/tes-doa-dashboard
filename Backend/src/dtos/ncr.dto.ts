import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import {
  enum_stat,
  reg_based,
  responoffice,
  audittype,
  auditscope,
  uic,
  level,
  probanalis,
  effective,
} from '@prisma/client';

/* 
    NCR REPLY DTO 
*/
export class CreateNCRDto {
  @IsString()
  @IsNotEmpty()
  accountid: string;

  @IsEnum(reg_based)
  @IsNotEmpty()
  regulationbased: reg_based;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  audit_plan_no: string;

  @IsString()
  @IsNotEmpty()
  ncr_no: string;

  @IsDate()
  @IsNotEmpty()
  issued_date: Date;

  @IsEnum(responoffice)
  @IsNotEmpty()
  responsibility_office: responoffice;

  @IsEnum(audittype)
  @IsNotEmpty()
  audit_type: audittype;

  @IsEnum(auditscope)
  @IsNotEmpty()
  audit_scope: auditscope;

  @IsEnum(uic)
  @IsNotEmpty()
  to_uic: uic;

  @IsString()
  @IsNotEmpty()
  attention: string;

  @IsString()
  @IsNotEmpty()
  require_condition_reference: string;

  @IsEnum(level)
  @IsNotEmpty()
  level_finding: level;

  @IsEnum(probanalis)
  @IsNotEmpty()
  problem_analysis: probanalis;

  @IsDate()
  @IsNotEmpty()
  answer_due_date: Date;

  @IsBoolean()
  @IsOptional()
  issue_ian?: boolean;

  @IsString()
  @IsOptional()
  ian_no?: string;

  @IsString()
  @IsNotEmpty()
  encountered_condition: string;

  @IsString()
  @IsNotEmpty()
  audit_by: string;

  @IsDate()
  @IsNotEmpty()
  audit_date: Date;

  @IsString()
  @IsNotEmpty()
  acknowledge_by: string;

  @IsDate()
  @IsNotEmpty()
  acknowledge_date: Date;

  @IsEnum(enum_stat)
  @IsNotEmpty()
  status: enum_stat;

  @IsString()
  @IsOptional()
  temporarylink?: string;
}

export class UpdateNCRDto extends CreateNCRDto {
  @IsString()
  @IsNotEmpty()
  ncr_init_id: string;
}

export class DeleteNCRDto {
  @IsString()
  @IsNotEmpty()
  ncr_init_id: string;
}

export class SearchNCRDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}

export class ShowNCRDto {
  @IsString()
  @IsNotEmpty()
  ncr_init_id: string;
}

/* 
    NCR REPLY DTO 
*/
export class CreateNcrReplyDto {
  @IsString()
  accountid: string;

  @IsString()
  ncr_init_id: string;

  @IsString()
  @IsNotEmpty()
  rca_problem: string;

  @IsString()
  @IsNotEmpty()
  corrective_action: string;

  @IsString()
  @IsNotEmpty()
  preventive_act: string;

  @IsString()
  @IsNotEmpty()
  identified_by: string;

  @IsDate()
  @IsNotEmpty()
  identified_date: Date;

  @IsString()
  @IsNotEmpty()
  accept_by?: string;

  @IsDate()
  @IsNotEmpty()
  audit_accept?: Date;

  @IsString()
  @IsOptional()
  temporarylink?: string;

  @IsString()
  @IsOptional()
  recommend_corrective_action?: string;
}

export class UpdateNcrReplyDto {
  @IsString()
  accountid: string;

  @IsString()
  id_ncr_reply: string;

  @IsString()
  rca_problem: string;

  @IsString()
  corrective_act: string;

  @IsString()
  preventive_act: string;

  @IsString()
  identified_by: string;

  @IsDate()
  identified_date: Date;

  @IsString()
  @IsOptional()
  accept_by?: string;

  @IsDate()
  @IsOptional()
  audit_accept?: Date;

  @IsString()
  @IsOptional()
  temporarylink?: string;
}

export class ShowNcrReplyDto {
  @IsString()
  ncr_init_id: string;
}

export class CreateNcrResultDto {
  @IsOptional()
  @IsString()
  accountid?: string;

  @IsString()
  @IsNotEmpty()
  ncr_init_id: string;

  @IsString()
  @IsOptional()
  close_corrective_actions?: string;

  @IsString()
  @IsNotEmpty()
  proposed_close_auditee: string;

  @IsDate()
  @IsNotEmpty()
  proposed_close_date: Date;

  @IsBoolean()
  @IsNotEmpty()
  is_close: boolean;

  @IsEnum(effective)
  @IsNotEmpty()
  effectiveness: effective;

  @IsString()
  @IsOptional()
  refer_verification?: string;

  @IsString()
  @IsOptional()
  sheet_no?: string;

  @IsString()
  @IsOptional()
  new_ncr_issue_nbr?: string;

  @IsString()
  @IsNotEmpty()
  close_approved_by: string;

  @IsDate()
  @IsNotEmpty()
  close_approved_date: Date;

  @IsString()
  @IsNotEmpty()
  verified_chief_im: string;

  @IsDate()
  @IsNotEmpty()
  verified_date: Date;

  @IsString()
  @IsOptional()
  temporarylink?: string;
}

export class UpdateNcrResultDto extends CreateNcrResultDto {
  @IsNotEmpty()
  @IsString()
  id_ncr_result: string;
}

export class ShowNcrResultDto {
  @IsNotEmpty()
  @IsString()
  ncr_init_id: string;
}
