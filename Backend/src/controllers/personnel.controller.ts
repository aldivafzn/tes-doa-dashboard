import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PersonnelService } from '../services/personnel.service';
import {
  CreatePersonnelDto,
  UpdatePersonnelDto,
  DeletePersonnelDto,
  ShowPersonnelByIdDto,
  SearchPersonnelDto,
  AddEducationDto,
  UpdateEducationDto,
  DeleteEducationDto,
  ShowEducationByIdDto,
  AddExperienceDto,
  UpdateExperienceDto,
  DeleteExperienceDto,
  ShowExperienceByIdDto,
  AddTrainingDto,
  UpdateTrainingDto,
  DeleteTrainingDto,
  ShowTrainingByIdDto,
  AddCertDto,
  UpdateCertDto,
  DeleteCertDto,
  ShowCertByIdDto,
} from '../dtos/personnel.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('personnel')
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  /* Personnel Management */
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addPersonnel(@Body() createPersonnelDto: CreatePersonnelDto) {
    return this.personnelService.addPersonnel(createPersonnelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updatePersonnel(@Body() updatePersonnelDto: UpdatePersonnelDto) {
    return this.personnelService.updatePersonnel(updatePersonnelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deletePersonnel(@Body() deletePersonnelDto: DeletePersonnelDto) {
    return this.personnelService.deletePersonnel(deletePersonnelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('show')
  async showPersonnelById(@Body() showPersonnelByIdDto: ShowPersonnelByIdDto) {
    return this.personnelService.showPersonnelById(showPersonnelByIdDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('show-all')
  async showAllPersonnel() {
    return this.personnelService.showAllPersonnel();
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  async searchPersonnel(@Body() searchPersonnelDto: SearchPersonnelDto) {
    return this.personnelService.searchPersonnel(searchPersonnelDto);
  }

  /* Education Management */
  @UseGuards(JwtAuthGuard)
  @Post('education/add')
  async addEducation(@Body() addEducationDto: AddEducationDto) {
    return this.personnelService.addEducation(addEducationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('education/update')
  async updateEducation(@Body() updateEducationDto: UpdateEducationDto) {
    return this.personnelService.updateEducation(updateEducationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('education/delete')
  async deleteEducation(@Body() deleteEducationDto: DeleteEducationDto) {
    return this.personnelService.deleteEducation(deleteEducationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('education/show')
  async showEducationById(@Body() showEducationDto: ShowEducationByIdDto) {
    return this.personnelService.showEducationById(showEducationDto);
  }

  /* Experience Management */
  @UseGuards(JwtAuthGuard)
  @Post('experience/add')
  async addExperience(@Body() addExperienceDto: AddExperienceDto) {
    return this.personnelService.addExperience(addExperienceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('experience/update')
  async updateExperience(@Body() updateExperienceDto: UpdateExperienceDto) {
    return this.personnelService.updateExperience(updateExperienceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('experience/delete')
  async deleteExperience(@Body() deleteExperienceDto: DeleteExperienceDto) {
    return this.personnelService.deleteExperience(deleteExperienceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('experience/show')
  async showExperienceByPersonId(
    @Body() showExperienceDto: ShowExperienceByIdDto,
  ) {
    return this.personnelService.showExperienceByPersonId(showExperienceDto);
  }

  /* Training Management */
  @UseGuards(JwtAuthGuard)
  @Post('training/add')
  async addTraining(@Body() addTrainingDto: AddTrainingDto) {
    return this.personnelService.addTraining(addTrainingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('training/update')
  async updateTraining(@Body() updateTrainingDto: UpdateTrainingDto) {
    return this.personnelService.updateTraining(updateTrainingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('training/delete')
  async deleteTraining(@Body() deleteTrainingDto: DeleteTrainingDto) {
    return this.personnelService.deleteTraining(deleteTrainingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('training/show')
  async showTrainingByPersonId(@Body() showTrainingDto: ShowTrainingByIdDto) {
    return this.personnelService.showTrainingByPersonId(showTrainingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cert/add')
  async addCert(@Body() addCertDto: AddCertDto) {
    return this.personnelService.addCert(addCertDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cert/update')
  async updateCert(@Body() updateCertDto: UpdateCertDto) {
    return this.personnelService.updateCert(updateCertDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cert/delete')
  async deleteCert(@Body() deleteCertDto: DeleteCertDto) {
    return this.personnelService.deleteCert(deleteCertDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cert/show')
  async showCertByPersonId(@Body() showCertDto: ShowCertByIdDto) {
    return this.personnelService.showCertByPersonId(showCertDto);
  }
}
