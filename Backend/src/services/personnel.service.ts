import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import {
  CreatePersonnelDto,
  UpdatePersonnelDto,
  DeletePersonnelDto,
  ShowPersonnelByIdDto,
  SearchPersonnelDto,
  DeleteEducationDto,
  UpdateEducationDto,
  AddEducationDto,
  ShowEducationByIdDto,
  DeleteExperienceDto,
  UpdateExperienceDto,
  AddExperienceDto,
  ShowExperienceByIdDto,
  AddTrainingDto,
  UpdateTrainingDto,
  DeleteTrainingDto,
  ShowTrainingByIdDto,
  AddCertDto,
  UpdateCertDto,
  DeleteCertDto,
  ShowCertByIdDto,
  //ShowAllPersonnelDto,
} from '../dtos/personnel.dto';

@Injectable()
export class PersonnelService {
  constructor(private prisma: PrismaService) {}

  /* 
    Personnel
  */
  async addPersonnel(createPersonnelDto: CreatePersonnelDto) {
    return this.prisma.tbl_personnel.create({
      data: {
        ...createPersonnelDto,
      },
    });
  }

  async updatePersonnel(updatePersonnelDto: UpdatePersonnelDto) {
    const { person_id, ...data } = updatePersonnelDto;

    const personnel = await this.prisma.tbl_personnel.findUnique({
      where: { person_id },
    });

    if (!personnel) {
      throw new NotFoundException(`Personnel with ID ${person_id} not found`);
    }

    return this.prisma.tbl_personnel.update({
      where: { person_id },
      data,
    });
  }

  async deletePersonnel(deletePersonnelDto: DeletePersonnelDto) {
    const { person_id } = deletePersonnelDto;

    const personnel = await this.prisma.tbl_personnel.findUnique({
      where: { person_id },
    });

    if (!personnel) {
      throw new NotFoundException(`Personnel with ID ${person_id} not found`);
    }

    return this.prisma.tbl_personnel.delete({
      where: { person_id },
    });
  }

  async showPersonnelById(showPersonnelByIdDto: ShowPersonnelByIdDto) {
    const { person_id } = showPersonnelByIdDto;

    const personnel = await this.prisma.tbl_personnel.findUnique({
      where: { person_id },
      include: {
        certification: true,
        education: true,
        experience_record: true,
        training_record: true,
      },
    });

    if (!personnel) {
      throw new NotFoundException(`Personnel with ID ${person_id} not found`);
    }

    return personnel;
  }

  async showAllPersonnel() {
    return this.prisma.tbl_personnel.findMany({
      include: {
        certification: true,
        education: true,
        experience_record: true,
        training_record: true,
      },
    });
  }

  async searchPersonnel(searchPersonnelDto: SearchPersonnelDto) {
    const input = searchPersonnelDto.input;
    return this.prisma.tbl_personnel.findMany({
      where: {
        OR: [
          { person_name: { contains: input, mode: 'insensitive' } },
          { person_no: { contains: input, mode: 'insensitive' } },
        ],
      },
    });
  }

  /* 
    Education
  */
  async addEducation(addEducationDto: AddEducationDto) {
    return this.prisma.education.create({
      data: addEducationDto,
    });
  }

  async updateEducation(updateEducationDto: UpdateEducationDto) {
    const { edu_id, ...data } = updateEducationDto;
    return this.prisma.education.update({
      where: { edu_id },
      data,
    });
  }

  async deleteEducation(deleteEducationDto: DeleteEducationDto) {
    return this.prisma.education.delete({
      where: { edu_id: deleteEducationDto.edu_id },
    });
  }

  async showEducationById(showEducationById: ShowEducationByIdDto) {
    const { person_id } = showEducationById;
    return this.prisma.education.findMany({
      where: { person_id },
    });
  }

  /* Experience Management */
  async addExperience(addExperienceDto: AddExperienceDto) {
    return this.prisma.experience_record.create({
      data: addExperienceDto,
    });
  }

  async updateExperience(updateExperienceDto: UpdateExperienceDto) {
    const { experience_id, ...data } = updateExperienceDto;
    return this.prisma.experience_record.update({
      where: { experience_id },
      data,
    });
  }

  async deleteExperience(deleteExperienceDto: DeleteExperienceDto) {
    return this.prisma.experience_record.delete({
      where: { experience_id: deleteExperienceDto.experience_id },
    });
  }

  async showExperienceByPersonId(showExperienceById: ShowExperienceByIdDto) {
    const { person_id } = showExperienceById;
    return this.prisma.experience_record.findMany({
      where: { person_id },
    });
  }

  /* Training Management */
  async addTraining(addTrainingDto: AddTrainingDto) {
    return this.prisma.training_record.create({
      data: addTrainingDto,
    });
  }

  async updateTraining(updateTrainingDto: UpdateTrainingDto) {
    const { training_id, ...data } = updateTrainingDto;
    return this.prisma.training_record.update({
      where: { training_id },
      data,
    });
  }

  async deleteTraining(deleteTrainingDto: DeleteTrainingDto) {
    return this.prisma.training_record.delete({
      where: { training_id: deleteTrainingDto.training_id },
    });
  }

  async showTrainingByPersonId(showTrainingById: ShowTrainingByIdDto) {
    const { person_id } = showTrainingById;
    return this.prisma.training_record.findMany({
      where: { person_id },
    });
  }

  async addCert(addCertDto: AddCertDto) {
    return this.prisma.certification.create({
      data: addCertDto,
    });
  }

  async updateCert(updateCertDto: UpdateCertDto) {
    const { cert_id, ...data } = updateCertDto;
    return this.prisma.certification.update({
      where: { cert_id },
      data,
    });
  }

  async deleteCert(deleteCertDto: DeleteCertDto) {
    return this.prisma.certification.delete({
      where: { cert_id: deleteCertDto.cert_id },
    });
  }

  async showCertByPersonId(showCertById: ShowCertByIdDto) {
    const { person_id } = showCertById;
    return this.prisma.certification.findMany({
      where: { person_id },
    });
  }
}
