import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateNCRDto,
  UpdateNCRDto,
  DeleteNCRDto,
  ShowNCRDto,
  SearchNCRDto,
  UpdateNcrReplyDto,
  CreateNcrReplyDto,
} from '../dtos/ncr.dto';
import { uic } from '@prisma/client';

@Injectable()
export class NcrService {
  constructor(private prisma: PrismaService) {}

  async addNcr(
    createNcrDto: Omit<CreateNCRDto, 'accountid'>,
    accountid: string,
  ) {
    const ncr = await this.prisma.ncr_initial.create({
      data: {
        accountid,
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

  async searchNcr(searchNcrDto: SearchNCRDto) {
    const { input } = searchNcrDto;
    const numberRegex = /^\d+$/;
    let ncrs;

    if (numberRegex.test(input)) {
      ncrs = await this.prisma.ncr_initial.findMany({
        where: { ncr_init_id: input },
      });
    } else {
      // Attempt to map input to a uic enum value
      const toUicValue = Object.keys(uic).find((key) =>
        uic[key].replace(/_/g, ' ').toLowerCase().includes(input.toLowerCase()),
      );

      ncrs = await this.prisma.ncr_initial.findMany({
        where: {
          OR: [
            { audit_by: { contains: input, mode: 'insensitive' } },
            ...(toUicValue ? [{ to_uic: toUicValue as uic }] : []),
          ],
        },
      });
    }

    return {
      status: 200,
      message: ncrs.length > 0 ? 'Showing result of NCR' : 'No Data NCR',
      showProduct: ncrs,
    };
  }

  async showNcrById(showNcrDto: ShowNCRDto) {
    const { ncr_init_id } = showNcrDto;
    const ncr = await this.prisma.ncr_initial.findUnique({
      where: { ncr_init_id },
    });

    if (ncr) {
      return {
        status: 200,
        message: 'Showing NCR Initial by ID',
        showProduct: [ncr],
      };
    } else {
      return {
        status: 200,
        message: 'No Data NCR Initial by ID',
        showProduct: [],
      };
    }
  }

  async addNcrReply(data: CreateNcrReplyDto, accountid: string) {
    const result = await this.prisma.ncr_reply.create({
      data: {
        accountid,
        ncr_init_id: data.ncr_init_id,
        rca_problem: data.rca_problem,
        corrective_action: data.corrective_action,
        preventive_action: data.preventive_act,
        identified_by_auditee: data.identified_by,
        identified_date: data.identified_date,
        accept_by_auditor: data.accept_by,
        auditor_accept_date: data.audit_accept,
        temporarylink: data.temporarylink,
        recommend_corrective_action: data.recommend_corrective_action,
      },
    });

    return {
      status: 200,
      message: 'NCR Reply Created',
      result,
    };
  }

  async deleteNcrReply(ncr_init_id: string) {
    const result = await this.prisma.ncr_reply.delete({
      where: { ncr_init_id },
    });

    if (result) {
      return {
        message: 'NCR Reply deleted',
      };
    } else {
      return {
        message: 'NCR Reply not found',
      };
    }
  }

  async updateNcrReply(data: UpdateNcrReplyDto, accountid: string) {
    const result = await this.prisma.ncr_reply.update({
      where: { ncr_init_id: data.ncr_init_id },
      data: {
        accountid,
        rca_problem: data.rca_problem,
        corrective_action: data.corrective_act,
        preventive_action: data.preventive_act,
        identified_by_auditee: data.identified_by,
        identified_date: data.identified_date,
        accept_by_auditor: data.accept_by,
        auditor_accept_date: data.audit_accept,
        temporarylink: data.temporarylink,
      },
    });

    return {
      status: 200,
      message: 'Update NCR Reply successful',
      result,
    };
  }

  async showNcrReply(ncr_init_id: string) {
    const result = await this.prisma.ncr_reply.findUnique({
      where: { ncr_init_id },
    });

    if (result) {
      return {
        message: 'Showing NCR Reply',
        showProduct: result,
      };
    } else {
      return {
        message: 'No NCR Reply',
      };
    }
  }
}
