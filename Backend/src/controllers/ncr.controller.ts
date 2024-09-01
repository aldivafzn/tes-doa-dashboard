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
import {
  CreateNCRDto,
  UpdateNCRDto,
  DeleteNCRDto,
  SearchNCRDto,
  ShowNCRDto,
  CreateNcrReplyDto,
  ShowNcrReplyDto,
  UpdateNcrReplyDto,
  CreateNcrResultDto,
  UpdateNcrResultDto,
  ShowNcrResultDto,
} from '../dtos/ncr.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('ncr')
export class NcrController {
  constructor(private readonly ncrService: NcrService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addNcr(@Body() createNcrDto: CreateNCRDto, @Request() req) {
    const accountid = req.user.userId;
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

  @UseGuards(JwtAuthGuard)
  @Post('search')
  async searchNcr(@Body() searchNcrDto: SearchNCRDto) {
    return this.ncrService.searchNcr(searchNcrDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('show')
  async showNcrById(@Body() showNcrDto: ShowNCRDto) {
    return this.ncrService.showNcrById(showNcrDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reply/add')
  async addNcrReply(
    @Body() createNcrReplyDto: CreateNcrReplyDto,
    @Request() req,
  ) {
    const accountid = req.user.userId;
    return this.ncrService.addNcrReply(createNcrReplyDto, accountid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reply/delete')
  async deleteNcrReply(@Body('ncr_init_id') ncr_init_id: string) {
    return this.ncrService.deleteNcrReply(ncr_init_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reply/update')
  async updateNcrReply(
    @Body() updateNcrReplyDto: UpdateNcrReplyDto,
    @Request() req,
  ) {
    const accountid = req.user.userId;
    return this.ncrService.updateNcrReply(updateNcrReplyDto, accountid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reply/show')
  async showNcrReply(@Body() showNcrReplyDto: ShowNcrReplyDto) {
    return this.ncrService.showNcrReply(showNcrReplyDto.ncr_init_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('result/add')
  async addNcrResult(
    @Body() createNcrResultDto: CreateNcrResultDto,
    @Request() req,
  ) {
    const accountid = req.user.userId;
    return this.ncrService.createNcrResult(createNcrResultDto, accountid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('result/delete')
  async deleteNcrResult(@Body('ncr_init_id') ncr_init_id: string) {
    return this.ncrService.deleteNcrResult(ncr_init_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('result/update')
  async updateNcrResult(
    @Body() updateNcrResultDto: UpdateNcrResultDto,
    @Request() req,
  ) {
    const accountid = req.user.userId;
    return this.ncrService.updateNcrResult(updateNcrResultDto, accountid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('result/show')
  async showNcrResult(@Body() showNcrResultDto: ShowNcrResultDto) {
    return this.ncrService.showNcrResult(showNcrResultDto.ncr_init_id);
  }
}
