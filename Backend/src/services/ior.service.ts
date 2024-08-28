import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateOccurrenceDto,
  ShowOccurrenceDto,
  SearchIORDto,
  UpdateOccurrenceDto,
  DeleteOccurrenceDto,
  AddCategoryIORDto,
  AddFollowUpOccurrenceDto,
  UpdateFollowUpOccurrenceDto,
} from '../dtos/ior.dto';

@Injectable()
export class IorService {
  constructor(private readonly prisma: PrismaService) {}

  async createOccurrence(dto: CreateOccurrenceDto) {
    const {
      subject_ior,
      category_occur,
      occur_nbr,
      occur_date,
      reference_ior,
      type_or_pnbr,
      to_uic,
      cc_uic,
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

    // Handle Google Docs operations (copy, move, replace text) here

    return this.prisma.tbl_occurrence.create({
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
  }

  async getOccurrence(dto: ShowOccurrenceDto) {
    const { id_IOR } = dto;
    // Validate id_IOR
    if (!id_IOR) {
      throw new Error('id_IOR is required');
    }

    try {
      const occurrence = await this.prisma.tbl_occurrence.findUnique({
        where: { id_ior: id_IOR },
      });
      return occurrence;
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
      occurrences = await this.prisma.tbl_occurrence.findMany({
        where: {
          OR: [
            { subject_ior: { contains: input, mode: 'insensitive' } },
            { to_uic: { contains: input, mode: 'insensitive' } },
            { cc_uic: { contains: input, mode: 'insensitive' } },
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

  async addCategoryIOR(dto: AddCategoryIORDto) {
    const { id_IOR, number_cat, occur_nbr } = dto;
    return await this.prisma.tbl_category_ior.create({
      data: {
        id_ior: id_IOR,
        number_cat,
        occur_nbr,
      },
    });
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
