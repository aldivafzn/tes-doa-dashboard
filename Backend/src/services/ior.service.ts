import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateOccurrenceDto,
  ShowOccurrenceDto,
  SearchIORDto,
  UpdateOccurrenceDto,
  DeleteOccurrenceDto,
  AddFollowUpOccurrenceDto,
  UpdateFollowUpOccurrenceDto,
} from '../dtos/ior.dto';
import { uic } from '@prisma/client';
import { GoogleApiService } from './googleapi.service';

@Injectable()
export class IorService {
  private readonly logger = new Logger(IorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  async createOccurrence(dto: CreateOccurrenceDto) {
    try {
      const createdOccurrence = await this.prisma.tbl_occurrence.create({
        data: {
          subject_ior: dto.subject_ior,
          occur_nbr: dto.occur_nbr,
          occur_date: dto.occur_date,
          reference_ior: dto.reference_ior,
          to_uic: dto.to_uic,
          cc_uic: dto.cc_uic,
          category_occur: dto.category_occur,
          type_or_pnbr: dto.type_or_pnbr,
          level_type: dto.level_type,
          detail_occurance: dto.detail_occurance,
          reportedby: dto.ReportedBy,
          reporter_uic: dto.reporter_uic,
          report_date: dto.report_date,
          reporter_identity: dto.reporter_identity,
          data_reference: dto.Data_reference,
          hirac_process: dto.hirac_process,
          initial_probability: dto.initial_probability,
          initial_severity: dto.initial_severity,
          initial_riskindex: dto.initial_riskindex,
          attachment: dto.attachment,
        },
      });
      return createdOccurrence;
    } catch (error) {
      console.error('Error creating occurrence:', error);
      throw new Error('Error Creating Occurrence');
    }
  }

  // async getOccurrence(dto: ShowOccurrenceDto) {
  //   const { id_IOR } = dto;
  //   // Validate id_IOR
  //   if (!id_IOR) {
  //     throw new Error('id_IOR is required');
  //   }

  //   try {
  //     const occurrence = await this.prisma.tbl_occurrence.findUnique({
  //       where: { id_ior: id_IOR },
  //     });
  //     return occurrence;
  //   } catch (error) {
  //     console.error('Error fetching occurrence:', error);
  //     throw new Error('Error Fetching Occurrence');
  //   }
  // }

  async getOccurrence(dto: ShowOccurrenceDto) {
    const { id_IOR } = dto;

    if (!id_IOR) {
      throw new Error('id_IOR is required');
    }

    try {
      // Step 1: Retrieve data from tbl_occurrence and tbl_follupoccur
      let occurrence = await this.prisma.tbl_occurrence.findUnique({
        where: { id_ior: id_IOR },
        include: {
          tbl_follupoccur: true, // Include sub-table data
        },
      });

      if (!occurrence) {
        throw new Error('Occurrence record not found');
      }

      const firstFollowUp = occurrence.tbl_follupoccur[0];

      // Step 2: Copy the Google Doc Template
      const templateDocId = process.env.TEMPLATE_DOCUMENT_IOR;
      const documentTitle = `IOR_${occurrence.occur_nbr}`;
      const userEmailAddress = process.env.USER_EMAIL;

      const copiedDocumentId = await this.googleApiService.copyGoogleDoc(
        templateDocId,
        documentTitle,
        userEmailAddress,
      );

      // Step 3: Prepare Placeholders including categories, level types, and other fields
      const categories = [
        '{DOA Management}',
        '{Partner or Subcontractor}',
        '{Procedure}',
        '{Material}',
        '{Document}',
        '{Information Technology}',
        '{Personnel}',
        '{Training}',
        '{Facility}',
        '{Others}',
      ];

      const levelTypes = ['{Aircraft}', '{Engine}', '{APU}', '{Others}'];

      const categoryReplacements = categories.reduce((acc, placeholder) => {
        // Normalize both the placeholder and occurrence category for comparison
        const normalizedCategory = placeholder
          .replace(/[{}]/g, '') // Remove curly braces
          .toLowerCase(); // Convert to lowercase

        const normalizedOccurrenceCategory = occurrence.category_occur
          .replace(/_/g, ' ') // Replace underscores with spaces in the input
          .toLowerCase(); // Convert to lowercase

        const isMatched = normalizedCategory === normalizedOccurrenceCategory;

        // Add the result to the accumulator
        acc[placeholder] = isMatched
          ? `☑ ${occurrence.category_occur.replace(/_/g, ' ')}` // Mark as checked, replacing underscores with spaces
          : `☐ ${normalizedCategory}`; // Keep unchecked placeholder as is

        return acc;
      }, {});

      const levelTypeReplacement = levelTypes.reduce((acc, placeholder) => {
        const normalizedLevelType = placeholder
          .replace(/[{}]/g, '')
          .toLowerCase();
        const isMatched =
          normalizedLevelType === occurrence.level_type.toLowerCase();
        acc[placeholder] = isMatched
          ? `☑ ${occurrence.level_type}`
          : `☐ ${normalizedLevelType}`;
        return acc;
      }, {});

      const reporterIdentityReplacement = {
        '{Shown}':
          occurrence.reporter_identity === 'Shown' ? '☑ Shown' : '☐ Shown',
        '{Hidden}':
          occurrence.reporter_identity === 'Hidden' ? '☑ Hidden' : '☐ Hidden',
      };

      const dataRefReplacement = {
        '{RefYes}': occurrence.data_reference ? '☑ Yes' : '☐ No',
        '{RefNo}': !occurrence.data_reference ? '☑ No' : '☐ No',
      };

      const hiracProcessReplacement = {
        '{HIRACYes}': occurrence.hirac_process === 'Yes' ? '☑ Yes' : '☐ No',
        '{HIRACNo}': occurrence.hirac_process === 'No' ? '☑ No' : '☐ No',
      };

      // Additional placeholders for other template fields
      const additionalReplacements = {
        '{Subject}': occurrence.subject_ior || '',
        '{OccurenceReport}': occurrence.occur_nbr || '',
        '{OccurenceDate}':
          occurrence.occur_date.toISOString().split('T')[0] || '',
        '{Ref}': occurrence.reference_ior || '',
        '{Type}': occurrence.type_or_pnbr || '',
        '{To}': occurrence.to_uic || '',
        '{Copy}': occurrence.cc_uic || '',
        '{Detail}': occurrence.detail_occurance || '',
        '{NameID}': occurrence.reportedby || '',
        '{Unit}': occurrence.reporter_uic || '',
        '{Date}': occurrence.report_date.toISOString().split('T')[0] || '',
        '{Init_Prob}': occurrence.initial_probability || '',
        '{Init_Severity}': occurrence.initial_severity || '',
        '{Init_Risk}': occurrence.initial_riskindex || '',
        // Additional placeholders for follow-up data
        '{FollowUp_Action}': firstFollowUp?.follup_detail || '',
        '{FollowUp_Date}':
          firstFollowUp?.follup_date.toISOString().split('T')[0] || '',
        '{FollowOn1}': firstFollowUp?.follup_detail || '',
        '{NameFollow1}': firstFollowUp?.follupby || '',
        '{Ref1Yes}':
          firstFollowUp?.follup_datarefer === true ? '☑ Yes' : '☐ No',
        '{Ref1No}':
          firstFollowUp?.follup_datarefer === false ? '☑ No' : '☐ No',
        '{UnitFollow1}': firstFollowUp?.follup_uic || '',
        '{Open1}':
          firstFollowUp?.follup_status === 'Open' ? '☑ Open' : '☐ Open',
        '{Close1}':
          firstFollowUp?.follup_status === 'Close' ? '☑ Close' : '☐ Close',
        '{DateFollow1}': firstFollowUp?.follup_date || '',
        '{NextUnit}': firstFollowUp?.nextuic_follup || '',
        '{Curr_Prob}': firstFollowUp?.current_probability || '',
        '{Curr_Severity}': firstFollowUp?.current_severity || '',
        '{Curr_Risk}': firstFollowUp?.current_riskindex || '',
      };

      // Combine all the replacements into one object
      const allReplacements = {
        ...categoryReplacements,
        ...levelTypeReplacement,
        ...reporterIdentityReplacement,
        ...dataRefReplacement,
        ...hiracProcessReplacement,
        ...additionalReplacements,
      };

      // Step 4: Replace placeholders in the document
      for (const [placeholder, value] of Object.entries(allReplacements)) {
        const formattedValue =
          value instanceof Date ? value.toISOString().split('T')[0] : value;
        await this.googleApiService.replaceTextInGoogleDocs(
          copiedDocumentId,
          placeholder,
          formattedValue,
        );
      }

      // Step 5: Move the document to a specific folder and generate PDF
      const targetFolderId = process.env.TARGET_FOLDER_IOR;
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

      // Step 6: Update tbl_occurrence with the PDF link
      await this.prisma.tbl_occurrence.update({
        where: { id_ior: occurrence.id_ior },
        data: {
          document_id: pdfResult.message,
        },
      });

      // Step 7: Re-fetch the updated Occurrence data to include the new document_id
      occurrence = await this.prisma.tbl_occurrence.findUnique({
        where: { id_ior: id_IOR },
        include: {
          tbl_follupoccur: true,
        },
      });

      // Step 8: Return the final response
      return {
        status: 200,
        message: 'Occurrence Retrieved and Documents Generated Successfully',
        data: occurrence,
      };
    } catch (error) {
      console.error('Error fetching occurrence:', error);
      throw new Error('Error Fetching Occurrence');
    }
  }

  async getAllOccurrences() {
    return this.prisma.tbl_occurrence.findMany();
  }

  async searchIOR(dto: SearchIORDto) {
    const { input } = dto;
    const numberRegex = /^\d+$/;
    let occurrences;

    if (numberRegex.test(input)) {
      occurrences = await this.prisma.tbl_occurrence.findMany({
        where: { id_ior: input },
      });
    } else {
      // Attempt to map input to a uic enum value
      const toUicValue = Object.keys(uic).find((key) =>
        uic[key].replace(/_/g, ' ').toLowerCase().includes(input.toLowerCase()),
      );

      const ccUicValue = Object.keys(uic).find((key) =>
        uic[key].replace(/_/g, ' ').toLowerCase().includes(input.toLowerCase()),
      );

      occurrences = await this.prisma.tbl_occurrence.findMany({
        where: {
          OR: [
            { subject_ior: { contains: input, mode: 'insensitive' } },
            ...(toUicValue ? [{ to_uic: toUicValue as uic }] : []),
            ...(ccUicValue ? [{ cc_uic: ccUicValue as uic }] : []),
          ],
        },
      });
    }

    return occurrences.length > 0
      ? {
          status: 200,
          message: 'Showing result of NCR',
          showProduct: occurrences,
        }
      : { status: 200, message: 'No Data NCR', showProduct: [] };
  }

  async updateOccurrence(dto: UpdateOccurrenceDto) {
    const {
      id_ior,
      subject_ior,
      occur_nbr,
      occur_date,
      reference_ior,
      to_uic,
      cc_uic,
      category_occur,
      type_or_pnbr,
      level_type,
      detail_occurance,
      ReportedBy,
      reporter_uic,
      report_date,
      reporter_identity,
      Data_reference,
      hirac_process,
      initial_probability,
      initial_severity,
      initial_riskindex,
    } = dto;

    const updatedOccurrence = await this.prisma.tbl_occurrence.update({
      where: { id_ior: id_ior },
      data: {
        subject_ior,
        occur_nbr,
        occur_date,
        reference_ior,
        to_uic,
        cc_uic,
        category_occur,
        type_or_pnbr,
        level_type,
        detail_occurance,
        reportedby: ReportedBy,
        reporter_uic,
        report_date,
        reporter_identity,
        data_reference: Data_reference,
        hirac_process,
        initial_probability,
        initial_severity,
        initial_riskindex,
      },
    });

    return updatedOccurrence
      ? { status: 200, message: 'Occurrence Updated' }
      : { status: 500, message: 'Error updating occurrence' };
  }

  async deleteOccurrence(dto: DeleteOccurrenceDto) {
    const { id_ior } = dto;

    const deletedOccurrence = await this.prisma.tbl_occurrence.delete({
      where: { id_ior: id_ior },
    });

    return deletedOccurrence
      ? { status: 200, message: 'Occurrence deleted' }
      : { status: 404, message: 'Occurrence not found' };
  }

  async addFollowUpOccurrence(dto: AddFollowUpOccurrenceDto) {
    const {
      id_IOR,
      follup_detail,
      follupby,
      follup_uic,
      follup_date,
      follup_datarefer,
      follup_status,
      nextuic_follup,
      current_probability,
      current_severity,
      current_riskindex,
    } = dto;

    // Validate that required fields are present
    if (!id_IOR) {
      throw new Error('id_IOR is required');
    }

    // Ensure the follow-up occurrence has a date
    if (!follup_date) {
      throw new Error('Follow-up date is required');
    }

    try {
      // Create the follow-up occurrence in the database
      const newFollowUpOccurrence = await this.prisma.tbl_follupoccur.create({
        data: {
          id_ior: id_IOR,
          follup_detail,
          follupby,
          follup_uic,
          follup_date,
          follup_datarefer,
          follup_status,
          nextuic_follup,
          current_probability,
          current_severity,
          current_riskindex,
        },
      });

      return {
        status: 201,
        message: 'Follow-up occurrence added successfully',
        data: newFollowUpOccurrence,
      };
    } catch (error) {
      console.error('Error adding follow-up occurrence:', error);
      throw new Error('Error Adding Follow-Up Occurrence');
    }
  }

  async updateFollowUpOccurrence(dto: UpdateFollowUpOccurrenceDto) {
    const {
      id_IOR,
      follup_detail,
      follupby,
      follup_uic,
      follup_date,
      follup_datarefer,
      follup_status,
      nextuic_follup,
      current_probability,
      current_severity,
      current_riskindex,
    } = dto;

    return await this.prisma.tbl_follupoccur.updateMany({
      where: { id_ior: id_IOR },
      data: {
        follup_detail,
        follupby,
        follup_uic,
        follup_date,
        follup_datarefer,
        follup_status,
        nextuic_follup,
        current_probability,
        current_severity,
        current_riskindex,
      },
    });
  }

  async getFollowUpOccurrence(id_follup: string) {
    if (!id_follup) {
      throw new Error('id_follup is required');
    }

    try {
      const followUpOccurrence = await this.prisma.tbl_follupoccur.findUnique({
        where: { id_follup },
      });
      if (!followUpOccurrence) {
        throw new Error('Follow-up occurrence not found');
      }
      return followUpOccurrence;
    } catch (error) {
      console.error('Error fetching follow-up occurrence:', error);
      throw new Error('Error Fetching Follow-Up Occurrence');
    }
  }

  async getAllFollowUpOccurrences() {
    return this.prisma.tbl_follupoccur.findMany();
  }
}
