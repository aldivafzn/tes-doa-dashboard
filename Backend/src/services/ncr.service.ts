import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateNCRDto, UpdateNCRDto, DeleteNCRDto } from '../dtos/ncr.dto';

@Injectable()
export class NcrService {
  constructor(private prisma: PrismaService) {}

  async addNcr(
    createNcrDto: Omit<CreateNCRDto, 'accountid'>,
    accountid: string,
  ) {
    const ncr = await this.prisma.ncr_initial.create({
      data: {
        accountid, // Use the accountid directly
        regulationbased: createNcrDto.regulationbased,
        subject: createNcrDto.subject,
        audit_plan_no: createNcrDto.audit_plan_no,
        ncr_no: createNcrDto.ncr_no,
        issued_date: createNcrDto.issued_date,
        responsibility_office: createNcrDto.responsibility_office,
        audit_type: createNcrDto.audit_type,
        audit_scope: createNcrDto.audit_scope,
        to_uic: createNcrDto.to_uic,
        attention: createNcrDto.attention,
        require_condition_reference: createNcrDto.require_condition_reference,
        level_finding: createNcrDto.level_finding,
        problem_analysis: createNcrDto.problem_analysis,
        answer_due_date: createNcrDto.answer_due_date,
        issue_ian: createNcrDto.issue_ian,
        ian_no: createNcrDto.ian_no,
        encountered_condition: createNcrDto.encountered_condition,
        audit_by: createNcrDto.audit_by,
        audit_date: createNcrDto.audit_date,
        acknowledge_by: createNcrDto.acknowledge_by,
        acknowledge_date: createNcrDto.acknowledge_date,
        status: createNcrDto.status,
        temporarylink: createNcrDto.temporarylink,
      },
    });
    return {
      status: 200,
      message: 'NCR Initial Created',
      ncr,
    };
  }

  async deleteNcr(deleteNcrDto: DeleteNCRDto) {
    await this.prisma.ncr_initial.delete({
      where: { ncr_init_id: deleteNcrDto.ncr_init_id },
    });
    return {
      status: 200,
      message: 'NCR Initial deleted',
    };
  }

  async updateNcr(
    updateNcrDto: Omit<UpdateNCRDto, 'accountid'>,
    accountid: string,
  ) {
    const ncr = await this.prisma.ncr_initial.update({
      where: { ncr_init_id: updateNcrDto.ncr_init_id },
      data: {
        accountid, // Use the accountid directly
        regulationbased: updateNcrDto.regulationbased,
        subject: updateNcrDto.subject,
        audit_plan_no: updateNcrDto.audit_plan_no,
        ncr_no: updateNcrDto.ncr_no,
        issued_date: updateNcrDto.issued_date,
        responsibility_office: updateNcrDto.responsibility_office,
        audit_type: updateNcrDto.audit_type,
        audit_scope: updateNcrDto.audit_scope,
        to_uic: updateNcrDto.to_uic,
        attention: updateNcrDto.attention,
        require_condition_reference: updateNcrDto.require_condition_reference,
        level_finding: updateNcrDto.level_finding,
        problem_analysis: updateNcrDto.problem_analysis,
        answer_due_date: updateNcrDto.answer_due_date,
        issue_ian: updateNcrDto.issue_ian,
        ian_no: updateNcrDto.ian_no,
        encountered_condition: updateNcrDto.encountered_condition,
        audit_by: updateNcrDto.audit_by,
        audit_date: updateNcrDto.audit_date,
        acknowledge_by: updateNcrDto.acknowledge_by,
        acknowledge_date: updateNcrDto.acknowledge_date,
        status: updateNcrDto.status,
        temporarylink: updateNcrDto.temporarylink,
      },
    });
    return {
      status: 200,
      message: 'NCR Initial Updated',
      ncr,
    };
  }

  async showAllNcrs() {
    const ncrs = await this.prisma.ncr_initial.findMany();
    return {
      status: 200,
      message: 'Showing NCR Initials',
      ncrs,
    };
  }
}
