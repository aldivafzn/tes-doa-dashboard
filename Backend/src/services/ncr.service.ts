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

  // async addNcr(
  //   createNcrDto: Omit<CreateNCRDto, 'accountid'>,
  //   accountid: string,
  // ) {
  //   const ncr = await this.prisma.ncr_initial.create({
  //     data: {
  //       accountid,
  //       regulationbased: createNcrDto.regulationbased,
  //       subject: createNcrDto.subject,
  //       audit_plan_no: createNcrDto.audit_plan_no,
  //       ncr_no: createNcrDto.ncr_no,
  //       issued_date: createNcrDto.issued_date,
  //       responsibility_office: createNcrDto.responsibility_office,
  //       audit_type: createNcrDto.audit_type,
  //       audit_scope: createNcrDto.audit_scope,
  //       to_uic: createNcrDto.to_uic,
  //       attention: createNcrDto.attention,
  //       require_condition_reference: createNcrDto.require_condition_reference,
  //       level_finding: createNcrDto.level_finding,
  //       problem_analysis: createNcrDto.problem_analysis,
  //       answer_due_date: createNcrDto.answer_due_date,
  //       issue_ian: createNcrDto.issue_ian,
  //       ian_no: createNcrDto.ian_no,
  //       encountered_condition: createNcrDto.encountered_condition,
  //       audit_by: createNcrDto.audit_by,
  //       audit_date: createNcrDto.audit_date,
  //       acknowledge_by: createNcrDto.acknowledge_by,
  //       acknowledge_date: createNcrDto.acknowledge_date,
  //       status: createNcrDto.status,
  //       temporarylink: createNcrDto.temporarylink,
  //     },
  //   });

  //   this.logger.log(`NCR initial record created with ID: ${ncr.ncr_init_id}`);

  //   const templateDocId = process.env.TEMPLATE_DOCUMENT;
  //   const documentTitle = `NCR_${ncr.ncr_no}`;
  //   const userEmailAddress = process.env.USER_EMAIL;

  //   const copiedDocumentId = await this.googleApiService.copyGoogleDoc(
  //     templateDocId,
  //     documentTitle,
  //     userEmailAddress,
  //   );

  //   this.logger.log(
  //     `Google Doc copied successfully with ID: ${copiedDocumentId}`,
  //   );

  //   const placeholders = {
  //     '{AuditPlan}': ncr.audit_plan_no || '',
  //     '{NCR_No}': ncr.ncr_no || '',
  //     '{IssuedDate}': ncr.issued_date.toISOString().split('T')[0] || '',
  //     '{Responsibility_Office}': ncr.responsibility_office || '',
  //     '{Audit_Type}': ncr.audit_type || '',
  //     '{to_uic}': ncr.to_uic || '',
  //     '{attention}': ncr.attention || '',
  //     '{regulationbased}': ncr.regulationbased || '',
  //     '{Level_Finding}': ncr.level_finding || '',
  //     '{Problem_Analysis}': ncr.problem_analysis || '',
  //     '{Due_Date}': ncr.answer_due_date.toISOString().split('T')[0] || '',
  //     '{IAN}': ncr.issue_ian ? 'Yes' : 'No',
  //     '{No}': ncr.ian_no || '',
  //     '{Encountered_Condition}': ncr.encountered_condition || '',
  //     '{Audit_by}': ncr.audit_by || '',
  //     '{Audit_Date}': ncr.audit_date.toISOString().split('T')[0] || '',
  //     '{Acknowledge_by}': ncr.acknowledge_by || '',
  //     '{Acknowledge_date}':
  //       ncr.acknowledge_date.toISOString().split('T')[0] || '',
  //   };

  //   for (const [placeholder, value] of Object.entries(placeholders)) {
  //     await this.googleApiService.replaceTextInGoogleDocs(
  //       copiedDocumentId,
  //       placeholder,
  //       value,
  //     );
  //   }

  //   this.logger.log(
  //     `Placeholders replaced successfully in document ID: ${copiedDocumentId}`,
  //   );

  //   const targetFolderId = process.env.TARGET_FOLDER;
  //   await this.googleApiService.moveFileToFolder(
  //     copiedDocumentId,
  //     targetFolderId,
  //   );

  //   this.logger.log(
  //     `Document ID: ${copiedDocumentId} moved to folder ID: ${targetFolderId}`,
  //   );

  //   const pdfResult = await this.googleApiService.getPDFDrive(
  //     copiedDocumentId,
  //     targetFolderId,
  //   );

  //   if (pdfResult.status !== 200) {
  //     throw new Error('Failed to generate and upload PDF to Google Drive');
  //   }

  //   this.logger.log(
  //     `PDF generated and uploaded successfully: ${pdfResult.message}`,
  //   );

  //   const updatedNcr = await this.prisma.ncr_initial.update({
  //     where: { ncr_init_id: ncr.ncr_init_id },
  //     data: {
  //       document_id: pdfResult.message,
  //     },
  //   });

  //   this.logger.log(
  //     `NCR initial record updated with document links for ID: ${ncr.ncr_init_id}`,
  //   );

  //   return {
  //     status: 200,
  //     message: 'NCR Initial Created and Documents Generated Successfully',
  //     data: updatedNcr,
  //   };
  // }

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

  // async showNcrById(showNcrDto: ShowNCRDto) {
  //   const { ncr_init_id } = showNcrDto;
  //   const ncr = await this.prisma.ncr_initial.findUnique({
  //     where: { ncr_init_id },
  //   });

  //   if (ncr) {
  //     return {
  //       status: 200,
  //       message: 'Showing NCR Initial by ID',
  //       showProduct: [ncr],
  //     };
  //   } else {
  //     return {
  //       status: 200,
  //       message: 'No Data NCR Initial by ID',
  //       showProduct: [],
  //     };
  //   }
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

    // Step 2: Copy the Google Doc Template
    const templateDocId = process.env.TEMPLATE_DOCUMENT_NCR; // Replace with your actual template document ID
    const documentTitle = `NCR_${ncrInitial.ncr_no}`;
    const userEmailAddress = process.env.USER_EMAIL;

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
      '{regulationbased}': ncrInitial.regulationbased || '',
      '{Level_Finding}': ncrInitial.level_finding || '',
      '{Problem_Analysis}': ncrInitial.problem_analysis || '',
      '{Due_Date}':
        ncrInitial.answer_due_date.toISOString().split('T')[0] || '',
      '{IAN}': ncrInitial.issue_ian ? 'Yes' : 'No',
      '{No}': ncrInitial.ian_no || '',
      '{Encountered_Condition}': ncrInitial.encountered_condition || '',
      '{Audit_by}': ncrInitial.audit_by || '',
      '{Audit_Date}': ncrInitial.audit_date.toISOString().split('T')[0] || '',
      '{Acknowledge_by}': ncrInitial.acknowledge_by || '',
      '{Acknowledge_date}':
        ncrInitial.acknowledge_date.toISOString().split('T')[0] || '',
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
        firstFollowResult?.proposed_close_date.toISOString().split('T')[0] ||
        '',
      '{Accepted_IM}': firstFollowResult?.verified_chief_im || '',
      '{Accepted_IM_Date}':
        firstFollowResult?.verified_date.toISOString().split('T')[0] || '',
      // Additional placeholders for follow-up results
      '{Close_Corrective_Action}':
        firstFollowResult?.close_corrective_actions || '',
      '{Close_Approved_Date}':
        firstFollowResult?.close_approved_date?.toISOString().split('T')[0] ||
        '',
      '{Verified_by}': firstFollowResult?.verified_chief_im || '',
      '{Verified_Date}':
        firstFollowResult?.verified_date?.toISOString().split('T')[0] || '',
    };

    // Step 4: Replace placeholders in the document
    for (const [placeholder, value] of Object.entries(placeholders)) {
      await this.googleApiService.replaceTextInGoogleDocs(
        copiedDocumentId,
        placeholder,
        value,
      );
    }

    // Step 5: Move the document to a specific folder and generate PDF
    const targetFolderId = process.env.TARGET_FOLDER;
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

  // async addNcrReply(data: CreateNcrReplyDto, accountid: string) {
  //   // Step 1: Retrieve corresponding ncr_initial record
  //   const ncrInitial = await this.prisma.ncr_initial.findUnique({
  //     where: { ncr_init_id: data.ncr_init_id },
  //   });

  //   if (!ncrInitial) {
  //     throw new Error('NCR Initial record not found');
  //   }

  //   // Step 2: Create the NCR Reply in the database
  //   const ncrReply = await this.prisma.ncr_reply.create({
  //     data: {
  //       accountid,
  //       ncr_init_id: data.ncr_init_id,
  //       rca_problem: data.rca_problem,
  //       corrective_action: data.corrective_action,
  //       preventive_action: data.preventive_act,
  //       identified_by_auditee: data.identified_by,
  //       identified_date: data.identified_date,
  //       accept_by_auditor: data.accept_by,
  //       auditor_accept_date: data.audit_accept,
  //       temporarylink: data.temporarylink,
  //       recommend_corrective_action: data.recommend_corrective_action,
  //     },
  //   });

  //   // Step 3: Copy the Google Doc Template
  //   const templateDocId = process.env.TEMPLATE_DOCUMENT; // Replace with your actual template document ID for replies
  //   const documentTitle = `NCR_Reply_${ncrInitial.ncr_no}`;
  //   const userEmailAddress = process.env.USER_EMAIL;

  //   const copiedDocumentId = await this.googleApiService.copyGoogleDoc(
  //     templateDocId,
  //     documentTitle,
  //     userEmailAddress,
  //   );

  //   // Step 4: Prepare Placeholders
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
  //     '{Problem_Analysis}': ncrInitial.problem_analysis || '',
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
  //     '{Root_Cause}': ncrReply.rca_problem || '',
  //     '{Identified_by}': ncrReply.identified_by_auditee || '',
  //     '{Identified_Date}':
  //       ncrReply.identified_date.toISOString().split('T')[0] || '',
  //     '{Accept_by}': ncrReply.accept_by_auditor || '',
  //     '{Accept_date}':
  //       ncrReply.auditor_accept_date.toISOString().split('T')[0] || '',
  //     '{Recommended_Action}': ncrReply.recommend_corrective_action || '',
  //   };

  //   // Step 5: Replace placeholders in the document
  //   for (const [placeholder, value] of Object.entries(placeholders)) {
  //     await this.googleApiService.replaceTextInGoogleDocs(
  //       copiedDocumentId,
  //       placeholder,
  //       value,
  //     );
  //   }

  //   // Step 6: Move the document to a specific folder and generate PDF
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

  //   // Step 7: Update ncr_initial with the PDF link
  //   await this.prisma.ncr_initial.update({
  //     where: { ncr_init_id: ncrInitial.ncr_init_id },
  //     data: {
  //       document_id: pdfResult.message, // Storing the PDF link
  //     },
  //   });

  //   return {
  //     status: 200,
  //     message: 'NCR Reply Created and Documents Generated Successfully',
  //     data: ncrReply,
  //   };
  // }

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
