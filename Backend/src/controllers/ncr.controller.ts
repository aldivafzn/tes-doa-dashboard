import {
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NcrService } from '../services/ncr.service';
import { CreateNCRDto, UpdateNCRDto, DeleteNCRDto } from '../dtos/ncr.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('ncr')
export class NcrController {
  constructor(private readonly ncrService: NcrService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addNcr(@Body() createNcrDto: CreateNCRDto, @Request() req) {
    const accountid = req.user.userId; // Ensure this matches `JwtStrategy`
    return this.ncrService.addNcr(createNcrDto, accountid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteNcr(@Body() deleteNcrDto: DeleteNCRDto) {
    return this.ncrService.deleteNcr(deleteNcrDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateNcr(@Body() updateNcrDto: UpdateNCRDto, @Request() req) {
    const accountid = req.user.userId; // Ensure this matches `JwtStrategy`
    return this.ncrService.updateNcr(updateNcrDto, accountid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('show-all')
  async showAllNcrs() {
    return this.ncrService.showAllNcrs();
  }
}
