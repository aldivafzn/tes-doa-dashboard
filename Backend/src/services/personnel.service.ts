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
    const personnel = await this.prisma.tbl_personnel.create({
      data: {
        ...createPersonnelDto,
      },
    });
    return {
      status: 200,
      message: 'Personnel Created',
      personnel,
    };
  }

  async updatePersonnel(updatePersonnelDto: UpdatePersonnelDto) {
    const { person_id, ...data } = updatePersonnelDto;

    const personnel = await this.prisma.tbl_personnel.findUnique({
      where: { person_id },
    });

    if (!personnel) {
      throw new NotFoundException(`Personnel with ID ${person_id} not found`);
    }

    const newPersonnel = await this.prisma.tbl_personnel.update({
      where: { person_id },
      data,
    });

    return {
      status: 200,
      message: 'Personnel Updated',
      newPersonnel,
    };
  }

  async deletePersonnel(deletePersonnelDto: DeletePersonnelDto) {
    const { person_id } = deletePersonnelDto;

    const personnel = await this.prisma.tbl_personnel.findUnique({
      where: { person_id },
    });

    if (!personnel) {
      throw new NotFoundException(`Personnel with ID ${person_id} not found`);
    }

    await this.prisma.tbl_personnel.delete({
      where: { person_id },
    });

    return {
      status: 200,
      message: 'Personnel deleted',
    };
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

    return {
      status: 200,
      message: 'Personnel found',
      showProduct: personnel,
    };
  }

  async showAllPersonnel() {
    const personnels = await this.prisma.tbl_personnel.findMany({
      include: {
        certification: true,
        education: true,
        experience_record: true,
        training_record: true,
      },
    });
    return {
      status: 200,
      message: 'Showing Personnels',
      showProduct: personnels,
    };
  }

  async searchPersonnel(searchPersonnelDto: SearchPersonnelDto) {
    const input = searchPersonnelDto.input;

    const personnels = await this.prisma.tbl_personnel.findMany({
      where: {
        OR: [
          { person_name: { contains: input, mode: 'insensitive' } },
          { person_no: { contains: input, mode: 'insensitive' } },
        ],
      },
    });

    return {
      status: 200,
      message:
        personnels.length > 0
          ? 'Showing result of Personnel'
          : 'No Data Personnel',
      showProduct: personnels,
    };
  }

  /* 
    Education
  */
  async addEducation(addEducationDto: AddEducationDto) {
    const education = await this.prisma.education.create({
      data: addEducationDto,
    });
    return {
      status: 200,
      message: 'Education Created',
      education,
    };
  }

  async updateEducation(updateEducationDto: UpdateEducationDto) {
    const { edu_id, ...data } = updateEducationDto;
    const education = await this.prisma.education.update({
      where: { edu_id },
      data,
    });
    return {
      status: 200,
      message: 'Education updated',
      education,
    };
  }

  async deleteEducation(deleteEducationDto: DeleteEducationDto) {
    await this.prisma.education.delete({
      where: { edu_id: deleteEducationDto.edu_id },
    });
    return {
      status: 200,
      mesage: 'Education deleted',
    };
  }

  async showEducationById(showEducationById: ShowEducationByIdDto) {
    const { person_id } = showEducationById;
    const educations = await this.prisma.education.findMany({
      where: { person_id },
    });
    return {
      status: 200,
      message: 'Showing Education',
      showProduct: educations,
    };
  }

  /* Experience Management */
  async addExperience(addExperienceDto: AddExperienceDto) {
    const experience = await this.prisma.experience_record.create({
      data: addExperienceDto,
    });
    return {
      status: 200,
      message: 'Experience Created',
      experience,
    };
  }

  async updateExperience(updateExperienceDto: UpdateExperienceDto) {
    const { experience_id, ...data } = updateExperienceDto;
    const experience = await this.prisma.experience_record.update({
      where: { experience_id },
      data,
    });
    return {
      status: 200,
      message: 'Experience updated',
      experience,
    };
  }

  async deleteExperience(deleteExperienceDto: DeleteExperienceDto) {
    await this.prisma.experience_record.delete({
      where: { experience_id: deleteExperienceDto.experience_id },
    });
    return {
      status: 200,
      message: 'Experience deleted',
    };
  }

  async showExperienceByPersonId(showExperienceById: ShowExperienceByIdDto) {
    const { person_id } = showExperienceById;
    const experiences = await this.prisma.experience_record.findMany({
      where: { person_id },
    });
    return {
      status: 200,
      message: 'Showing experience',
      showProduct: experiences,
    };
  }

  /* Training Management */
  async addTraining(addTrainingDto: AddTrainingDto) {
    const training = await this.prisma.training_record.create({
      data: addTrainingDto,
    });
    return {
      status: 200,
      message: 'Training Created',
      training,
    };
  }

  async updateTraining(updateTrainingDto: UpdateTrainingDto) {
    const { training_id, ...data } = updateTrainingDto;
    const training = await this.prisma.training_record.update({
      where: { training_id },
      data,
    });
    return {
      status: 200,
      message: 'Training updated',
      training,
    };
  }

  async deleteTraining(deleteTrainingDto: DeleteTrainingDto) {
    await this.prisma.training_record.delete({
      where: { training_id: deleteTrainingDto.training_id },
    });
    return {
      status: 200,
      message: 'Training updated',
    };
  }

  async showTrainingByPersonId(showTrainingById: ShowTrainingByIdDto) {
    const { person_id } = showTrainingById;
    const trainings = await this.prisma.training_record.findMany({
      where: { person_id },
    });
    return {
      status: 200,
      message: 'Showing Training',
      showProduct: trainings,
    };
  }

  async addCert(addCertDto: AddCertDto) {
    const cert = await this.prisma.certification.create({
      data: addCertDto,
    });
    return {
      status: 200,
      message: 'Certification Created',
      cert,
    };
  }

  async updateCert(updateCertDto: UpdateCertDto) {
    const { cert_id, ...data } = updateCertDto;
    const cert = await this.prisma.certification.update({
      where: { cert_id },
      data,
    });
    return {
      status: 200,
      message: 'Certification updated',
      cert,
    };
  }

  async deleteCert(deleteCertDto: DeleteCertDto) {
    await this.prisma.certification.delete({
      where: { cert_id: deleteCertDto.cert_id },
    });
    return {
      status: 200,
      message: 'Certification deleted',
    };
  }

  async showCertByPersonId(showCertById: ShowCertByIdDto) {
    const { person_id } = showCertById;
    const certs = await this.prisma.certification.findMany({
      where: { person_id },
    });
    return {
      status: 200,
      message: 'Showing Certifications',
      showProduct: certs,
    };
  }
}
