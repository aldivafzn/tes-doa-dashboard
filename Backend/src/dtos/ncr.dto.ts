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
} from '@prisma/client'; // Adjust import based on your setup

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
