import { Injectable } from '@nestjs/common';
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

@Injectable()
export class IorService {
  constructor(private readonly prisma: PrismaService) {}

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
        },
      });
      return createdOccurrence;
    } catch (error) {
      console.error('Error creating occurrence:', error);
      throw new Error('Error Creating Occurrence');
    }
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
