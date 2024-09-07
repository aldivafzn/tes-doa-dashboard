import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateNCRDto,
  UpdateNCRDto,
  DeleteNCRDto,
  ShowNCRDto,
  SearchNCRDto,
  UpdateNcrReplyDto,
  CreateNcrReplyDto,
  CreateNcrResultDto,
  UpdateNcrResultDto,
} from '../dtos/ncr.dto';
import { uic } from '@prisma/client';
import { GoogleApiService } from './googleapi.service';
@Injectable()
export class NcrService {
  private readonly logger = new Logger(NcrService.name);

  constructor(
    private prisma: PrismaService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  async addNcr(
    createNcrDto: Omit<CreateNCRDto, 'accountid'>,
    accountid: string,
  ) {
    const issuedYear = new Date(createNcrDto.issued_date).getFullYear();

    let ncrCount: number;
    let ncrNo: string;

    // Determine the format based on regulationbased
    if (createNcrDto.regulationbased === 'DGCA') {
      // Count how many NCRs have been created for this year
      ncrCount = await this.prisma.ncr_initial.count({
        where: {
          regulationbased: 'DGCA',
          issued_date: {
            gte: new Date(`${issuedYear}-01-01`),
            lt: new Date(`${issuedYear + 1}-01-01`),
          },
        },
      });

      // Generate NCR number in the format NCR-XXX-YEAR-R0
      const formattedCount = (ncrCount + 1).toString().padStart(3, '0');
      ncrNo = `NCR-${formattedCount}-${issuedYear}`;
    } else if (createNcrDto.regulationbased === 'EASA') {
      // Count how many EASA NCRs have been created for this year
      ncrCount = await this.prisma.ncr_initial.count({
        where: {
          regulationbased: 'EASA',
          issued_date: {
            gte: new Date(`${issuedYear}-01-01`),
            lt: new Date(`${issuedYear + 1}-01-01`),
          },
        },
      });

      // Generate EASA NCR number in the format NCR/E-XX
      const formattedCount = (ncrCount + 1).toString().padStart(3, '0');
      ncrNo = `NCR/E-${formattedCount}`;
    }

    const ncr = await this.prisma.ncr_initial.create({
      data: {
        accountid,
        regulationbased: createNcrDto.regulationbased,
        subject: createNcrDto.subject,
        audit_plan_no: createNcrDto.audit_plan_no,
        ncr_no: ncrNo,
        issued_date: createNcrDto.issued_date,
        responsibility_office: createNcrDto.responsibility_office,
        audit_type: createNcrDto.audit_type,
        audit_scope: createNcrDto.audit_scope,
        to_uic: createNcrDto.to_uic,
        attention: createNcrDto.attention,
        require_condition_reference: createNcrDto.require_condition_reference,
        level_finding: createNcrDto.level_finding,
        pa_requirement: createNcrDto.pa_requirement,
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
        accountid,
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
        pa_requirement: updateNcrDto.pa_requirement,
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

  // async showNcrById(showNcrDto: ShowNCRDto) {
  //   const { ncr_init_id } = showNcrDto;
  //   // Step 1: Retrieve data from ncr_initial, ncr_reply, and ncr_followresult
  //   let ncrInitial = await this.prisma.ncr_initial.findUnique({
  //     where: { ncr_init_id },
  //     include: {
  //       ncr_reply: true,
  //       ncr_followresult: true,
  //     },
  //   });

  //   if (!ncrInitial) {
  //     throw new Error('NCR Initial record not found');
  //   }

  //   const firstNcrReply = ncrInitial.ncr_reply[0];
  //   const firstFollowResult = ncrInitial.ncr_followresult[0];

  //   // Step 2: Copy the Google Doc Template
  //   const templateDocId = process.env.TEMPLATE_DOCUMENT_NCR; // Replace with your actual template document ID
  //   const documentTitle = `NCR_${ncrInitial.ncr_no}`;
  //   const userEmailAddress = process.env.USER_EMAIL;

  //   const copiedDocumentId = await this.googleApiService.copyGoogleDoc(
  //     templateDocId,
  //     documentTitle,
  //     userEmailAddress,
  //   );

  //   // Step 3: Prepare Placeholders
  //   const placeholders = {
  //     '{AuditPlan}': ncrInitial.audit_plan_no || '',
  //     '{NCR_No}': ncrInitial.ncr_no || '',
  //     '{IssuedDate}': ncrInitial.issued_date.toISOString().split('T')[0] || '',
  //     '{Responsibility_Office}': ncrInitial.responsibility_office || '',
  //     '{Audit_Type}': ncrInitial.audit_type || '',
  //     '{to_uic}': ncrInitial.to_uic || '',
  //     '{attention}': ncrInitial.attention || '',
  //     '{regulationbased}': ncrInitial.regulationbased || '',
  //     '{Level_Finding}': ncrInitial.level_finding || '',
  //     '{Problem_Analysis}': ncrInitial.pa_requirement || '',
  //     '{Due_Date}':
  //       ncrInitial.answer_due_date.toISOString().split('T')[0] || '',
  //     '{IAN}': ncrInitial.issue_ian ? 'Yes' : 'No',
  //     '{No}': ncrInitial.ian_no || '',
  //     '{Encountered_Condition}': ncrInitial.encountered_condition || '',
  //     '{Audit_by}': ncrInitial.audit_by || '',
  //     '{Audit_Date}': ncrInitial.audit_date.toISOString().split('T')[0] || '',
  //     '{Acknowledge_by}': ncrInitial.acknowledge_by || '',
  //     '{Acknowledge_date}':
  //       ncrInitial.acknowledge_date.toISOString().split('T')[0] || '',
  //     // Additional placeholders for the reply section
  //     '{Root_Cause}': firstNcrReply?.rca_problem || '',
  //     '{Identified_by}': firstNcrReply?.identified_by_auditee || '',
  //     '{Identified_Date}':
  //       firstNcrReply?.identified_date?.toISOString().split('T')[0] || '',
  //     '{Accept_by}': firstNcrReply?.accept_by_auditor || '',
  //     '{Accept_date}':
  //       firstNcrReply?.auditor_accept_date?.toISOString().split('T')[0] || '',
  //     '{Recommended_Action}': firstNcrReply?.recommend_corrective_action || '',
  //     '{Auditee_by}': firstFollowResult?.proposed_close_auditee || '',
  //     '{Auditee_Date}':
  //       firstFollowResult?.proposed_close_date.toISOString().split('T')[0] ||
  //       '',
  //     '{Accepted_IM}': firstFollowResult?.verified_chief_im || '',
  //     '{Accepted_IM_Date}':
  //       firstFollowResult?.verified_date.toISOString().split('T')[0] || '',
  //     // Additional placeholders for follow-up results
  //     '{Close_Corrective_Action}':
  //       firstFollowResult?.close_corrective_actions || '',
  //     '{Close_Approved_Date}':
  //       firstFollowResult?.close_approved_date?.toISOString().split('T')[0] ||
  //       '',
  //     '{Verified_by}': firstFollowResult?.verified_chief_im || '',
  //     '{Verified_Date}':
  //       firstFollowResult?.verified_date?.toISOString().split('T')[0] || '',
  //   };

  //   // Step 4: Replace placeholders in the document
  //   for (const [placeholder, value] of Object.entries(placeholders)) {
  //     await this.googleApiService.replaceTextInGoogleDocs(
  //       copiedDocumentId,
  //       placeholder,
  //       value,
  //     );
  //   }

  //   // Step 5: Move the document to a specific folder and generate PDF
  //   const targetFolderId = process.env.TARGET_FOLDER;
  //   await this.googleApiService.moveFileToFolder(
  //     copiedDocumentId,
  //     targetFolderId,
  //   );

  //   const pdfResult = await this.googleApiService.getPDFDrive(
  //     copiedDocumentId,
  //     targetFolderId,
  //   );

  //   if (pdfResult.status !== 200) {
  //     throw new Error('Failed to generate and upload PDF to Google Drive');
  //   }

  //   // Step 6: Update ncr_initial with the PDF link
  //   await this.prisma.ncr_initial.update({
  //     where: { ncr_init_id: ncrInitial.ncr_init_id },
  //     data: {
  //       document_id: pdfResult.message,
  //     },
  //   });

  //   // Step 7: Re-fetch the updated NCR data to include the new document_id
  //   ncrInitial = await this.prisma.ncr_initial.findUnique({
  //     where: { ncr_init_id },
  //     include: {
  //       ncr_reply: true,
  //       ncr_followresult: true,
  //     },
  //   });

  //   // Step 8: Return the final response including the updated NCR data
  //   return {
  //     status: 200,
  //     message: 'NCR Retrieved and Documents Generated Successfully',
  //     data: ncrInitial,
  //   };
  // }

  async showNcrById(showNcrDto: ShowNCRDto) {
    const { ncr_init_id } = showNcrDto;
    // Step 1: Retrieve data from ncr_initial, ncr_reply, and ncr_followresult
    let ncrInitial = await this.prisma.ncr_initial.findUnique({
      where: { ncr_init_id },
      include: {
        ncr_reply: true,
        ncr_followresult: true,
      },
    });

    if (!ncrInitial) {
      throw new Error('NCR Initial record not found');
    }

    const firstNcrReply = ncrInitial.ncr_reply[0];
    const firstFollowResult = ncrInitial.ncr_followresult[0];

    // Determine the template to use based on regulationbased value
    let templateDocId;
    let documentTitle;

    if (ncrInitial.regulationbased === 'DGCA') {
      templateDocId = process.env.TEMPLATE_DOCUMENT_NCR_DGCA;
      documentTitle = `NCR_${ncrInitial.ncr_no}`;
    } else if (ncrInitial.regulationbased === 'EASA') {
      templateDocId = process.env.TEMPLATE_DOCUMENT_NCR_EASA;
      documentTitle = `NCR_${ncrInitial.ncr_no}`;
    } else {
      throw new Error('Unknown regulationbased value');
    }

    const userEmailAddress = process.env.USER_EMAIL;

    // Step 2: Copy the Google Doc Template
    const copiedDocumentId = await this.googleApiService.copyGoogleDoc(
      templateDocId,
      documentTitle,
      userEmailAddress,
    );

    // Step 3: Prepare Placeholders
    const placeholders = {
      '{AuditPlan}': ncrInitial.audit_plan_no || '',
      '{NCR_No}': ncrInitial.ncr_no || '',
      '{IssuedDate}': ncrInitial.issued_date.toISOString().split('T')[0] || '',
      '{Responsibility_Office}': ncrInitial.responsibility_office || '',
      '{Audit_Type}': ncrInitial.audit_type || '',
      '{to_uic}': ncrInitial.to_uic || '',
      '{attention}': ncrInitial.attention || '',
      '{require_condition_reference}':
        ncrInitial.require_condition_reference || '',
      '{Level_Finding}': ncrInitial.level_finding || '',
      '{Problem_Analysis}': ncrInitial.pa_requirement || '',
      '{Due_Date}':
        ncrInitial.answer_due_date?.toISOString().split('T')[0] || '',
      '{IAN}': ncrInitial.issue_ian ? 'Yes' : 'No',
      '{No}': ncrInitial.ian_no || '',
      '{Encountered_Condition}': ncrInitial.encountered_condition || '',
      '{Audit_by}': ncrInitial.audit_by || '',
      '{Audit_Date}': ncrInitial.audit_date?.toISOString().split('T')[0] || '',
      '{Acknowledge_by}': ncrInitial.acknowledge_by || '',
      '{Acknowledge_date}':
        ncrInitial.acknowledge_date?.toISOString().split('T')[0] || '',
      // Additional placeholders for the reply section
      '{Root_Cause}': firstNcrReply?.rca_problem || '',
      '{Identified_by}': firstNcrReply?.identified_by_auditee || '',
      '{Identified_Date}':
        firstNcrReply?.identified_date?.toISOString().split('T')[0] || '',
      '{Accept_by}': firstNcrReply?.accept_by_auditor || '',
      '{Accept_date}':
        firstNcrReply?.auditor_accept_date?.toISOString().split('T')[0] || '',
      '{Recommended_Action}': firstNcrReply?.recommend_corrective_action || '',
      '{Auditee_by}': firstFollowResult?.proposed_close_auditee || '',
      '{Auditee_Date}':
        firstFollowResult?.proposed_close_date?.toISOString().split('T')[0] ||
        '',
      '{Accepted_IM}': firstFollowResult?.verified_chief_im || '',
      '{Accepted_IM_Date}':
        firstFollowResult?.verified_date?.toISOString().split('T')[0] || '',
      '{Close_Corrective_Action}':
        firstFollowResult?.close_corrective_actions || '',
      '{Close_Approved_Date}':
        firstFollowResult?.close_approved_date?.toISOString().split('T')[0] ||
        '',
      '{Verified_by}': firstFollowResult?.verified_chief_im || '',
      '{Verified_Date}':
        firstFollowResult?.verified_date?.toISOString().split('T')[0] || '',
    };

    // Add DGCA-specific placeholders
    if (ncrInitial.regulationbased === 'DGCA') {
      Object.assign(placeholders, {
        '{audit_plan_no}': ncrInitial.audit_plan_no || '',
        '{ncr_no}': ncrInitial.ncr_no || '',
        '{issued_date}':
          ncrInitial.issued_date.toISOString().split('T')[0] || '',
        '{responsibility_Office}': ncrInitial.responsibility_office || '',
        '{audit_type}': ncrInitial.audit_type || '',
        '{to_uic}': ncrInitial.to_uic || '',
        '{attention}': ncrInitial.attention || '',
        '{require_condition_reference}':
          ncrInitial.require_condition_reference || '',
        '{level_Finding}': ncrInitial.level_finding || '',
        '{pa_requirement}': ncrInitial.pa_requirement || '',
        '{ncr_due_date}':
          ncrInitial.answer_due_date?.toISOString().split('T')[0] || '',
        '{issue_ian}': ncrInitial.issue_ian ? 'Yes' : 'No',
        '{ian_no}': ncrInitial.ian_no || '',
        '{encountered_condition}': ncrInitial.encountered_condition || '',
        '{audit_by}': ncrInitial.audit_by || '',
        '{audit_Date}':
          ncrInitial.audit_date?.toISOString().split('T')[0] || '',
        '{implementation_date}':
          firstFollowResult?.implementation_date?.toISOString().split('T')[0] ||
          '',
        '{acknowledge_by}': ncrInitial.acknowledge_by || '',
        '{acknowledge_date}':
          ncrInitial.acknowledge_date?.toISOString().split('T')[0] || '',
        '{rca_problem}': firstNcrReply?.rca_problem || '',
        '{identified_Date}':
          firstNcrReply?.identified_date?.toISOString().split('T')[0] || '',
        '{identified_by}': firstNcrReply?.identified_by_auditee || '',
        '{accept_by_auditor}': firstNcrReply?.accept_by_auditor || '',
        '{auditor_accept_date}':
          firstNcrReply?.auditor_accept_date?.toISOString().split('T')[0] || '',
        '{recommend_corrective_action}':
          firstNcrReply?.recommend_corrective_action || '',
        '{proposed_close_auditee}':
          firstFollowResult?.proposed_close_auditee || '',
        '{proposed_close_date}':
          firstFollowResult?.proposed_close_date?.toISOString().split('T')[0] ||
          '',
        '{close_approved_by}': firstFollowResult?.close_approved_by || '',
        '{close_approved_date}':
          firstFollowResult?.proposed_close_date?.toISOString().split('T')[0] ||
          '',
        '{close_corrective_action}':
          firstFollowResult?.close_corrective_actions || '',
        '{verified_chief_im}': firstFollowResult?.verified_chief_im || '',
        '{verified_date}':
          firstFollowResult?.verified_date?.toISOString().split('T')[0] || '',
      });
    }

    // Add EASA-specific placeholders
    if (ncrInitial.regulationbased === 'EASA') {
      Object.assign(placeholders, {
        '{audit_plan_no}': ncrInitial.audit_plan_no || '',
        '{ncr_no}': ncrInitial.ncr_no || '',
        '{issued_date}':
          ncrInitial.issued_date.toISOString().split('T')[0] || '',
        '{responsibility_Office}': ncrInitial.responsibility_office || '',
        '{audit_type}': ncrInitial.audit_type || '',
        '{require_condition_reference}':
          ncrInitial.require_condition_reference || '',
        '{level_finding}': ncrInitial.level_finding || '',
        '{pa_requirement}': ncrInitial.pa_requirement || '',
        '{answer_due_date}':
          ncrInitial.answer_due_date?.toISOString().split('T')[0] || '',
        '{encountered_condition}': ncrInitial.encountered_condition || '',
        '{audit_by}': ncrInitial.audit_by || '',
        '{audit_date}':
          ncrInitial.audit_date?.toISOString().split('T')[0] || '',
        '{acknowledge_by}': ncrInitial.acknowledge_by || '',
        '{acknowledge_date}':
          ncrInitial.acknowledge_date?.toISOString().split('T')[0] || '',
        '{rca_problem}': firstNcrReply?.rca_problem || '',
        '{corrective_action}': firstNcrReply?.corrective_action || '',
        '{preventive_action}': firstNcrReply?.preventive_action || '',
        '{identified_date}':
          firstNcrReply?.identified_date?.toISOString().split('T')[0] || '',
        '{identified_by_auditee}': firstNcrReply?.identified_by_auditee || '',
        '{accept_by_auditor}': firstNcrReply?.accept_by_auditor || '',
        '{auditor_accept_date}':
          firstNcrReply?.auditor_accept_date?.toISOString().split('T')[0] || '',
        '{yes_close}':
          firstFollowResult?.is_close === true ? '☑ Close' : '☐ Open',
        '{no_close}':
          firstFollowResult?.is_close === false ? '☑ Open' : '☐ Open',
        '{yes_effective}':
          firstFollowResult?.effectiveness === 'Effective'
            ? '☑ Effective'
            : '☐ Not Effective',
        '{no_effective}':
          firstFollowResult?.effectiveness === 'Not_Effective'
            ? '☑ No Effective'
            : '☐ No Effective',
        '{refer_verification}': firstFollowResult?.refer_verification || '',
        '{sheet_no}': firstFollowResult?.sheet_no || '',
        '{new_ncr_issue_nbr}': firstFollowResult?.new_ncr_issue_nbr || '',
        '{close_approved_by}': firstFollowResult?.close_approved_by || '',
        '{close_approved_date}':
          firstFollowResult?.close_approved_date?.toISOString().split('T')[0] ||
          '',
      });
    }

    // Step 4: Replace placeholders in the document
    for (const [placeholder, value] of Object.entries(placeholders)) {
      await this.googleApiService.replaceTextInGoogleDocs(
        copiedDocumentId,
        placeholder,
        value,
      );
    }

    // Step 5: Move the document to a specific folder and generate PDF
    const targetFolderId = process.env.TARGET_FOLDER_NCR;
    await this.googleApiService.moveFileToFolder(
      copiedDocumentId,
      targetFolderId,
    );

    const pdfResult = await this.googleApiService.getPDFDrive(
      copiedDocumentId,
      targetFolderId,
    );

    if (pdfResult.status !== 200) {
      throw new Error('Failed to generate and upload PDF to Google Drive');
    }

    // Step 6: Update ncr_initial with the PDF link
    await this.prisma.ncr_initial.update({
      where: { ncr_init_id: ncrInitial.ncr_init_id },
      data: {
        document_id: pdfResult.message,
      },
    });

    // Step 7: Re-fetch the updated NCR data to include the new document_id
    ncrInitial = await this.prisma.ncr_initial.findUnique({
      where: { ncr_init_id },
      include: {
        ncr_reply: true,
        ncr_followresult: true,
      },
    });

    // Step 8: Return the final response including the updated NCR data
    return {
      status: 200,
      message: 'NCR Retrieved and Documents Generated Successfully',
      data: ncrInitial,
    };
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

  async deleteNcrReply(id_ncr_reply: string) {
    const result = await this.prisma.ncr_reply.delete({
      where: { id_ncr_reply },
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
      where: { id_ncr_reply: data.id_ncr_reply },
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
    const result = await this.prisma.ncr_reply.findMany({
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

  async createNcrResult(data: CreateNcrResultDto, accountid: string) {
    const result = await this.prisma.ncr_followresult.create({
      data: {
        accountid,
        ncr_init_id: data.ncr_init_id,
        close_corrective_actions: data.close_corrective_actions,
        proposed_close_auditee: data.proposed_close_auditee,
        proposed_close_date: data.proposed_close_date,
        is_close: data.is_close,
        effectiveness: data.effectiveness,
        refer_verification: data.refer_verification,
        sheet_no: data.sheet_no,
        new_ncr_issue_nbr: data.new_ncr_issue_nbr,
        close_approved_by: data.close_approved_by,
        close_approved_date: data.close_approved_date,
        verified_chief_im: data.verified_chief_im,
        verified_date: data.verified_date,
        implementation_date: data.implementation_date,
        temporarylink: data.temporarylink,
      },
    });
    return {
      status: 200,
      message: 'NCR Follow Result Created',
      result,
    };
  }

  async deleteNcrResult(id_ncr_result: string) {
    const result = await this.prisma.ncr_followresult.delete({
      where: { id_ncr_result },
    });
    return {
      message: 'NCR Follow Result deleted',
      result,
    };
  }

  async updateNcrResult(data: UpdateNcrResultDto, accountid: string) {
    const result = await this.prisma.ncr_followresult.update({
      where: { id_ncr_result: data.id_ncr_result },
      data: {
        accountid,
        close_corrective_actions: data.close_corrective_actions,
        proposed_close_auditee: data.proposed_close_auditee,
        proposed_close_date: data.proposed_close_date,
        is_close: data.is_close,
        effectiveness: data.effectiveness,
        refer_verification: data.refer_verification,
        sheet_no: data.sheet_no,
        new_ncr_issue_nbr: data.new_ncr_issue_nbr,
        close_approved_by: data.close_approved_by,
        close_approved_date: data.close_approved_date,
        verified_chief_im: data.verified_chief_im,
        verified_date: data.verified_date,
        temporarylink: data.temporarylink,
      },
    });
    return {
      status: 200,
      message: 'Update NCR Follow Result successful',
      result,
    };
  }

  async showNcrResult(ncr_init_id: string) {
    const result = await this.prisma.ncr_followresult.findMany({
      where: { ncr_init_id },
    });
    if (result.length > 0) {
      return {
        message: 'Showing NCR Follow Result',
        result,
      };
    } else {
      return {
        message: 'No NCR Follow Result',
      };
    }
  }
}
