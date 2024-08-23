import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { IorService } from '../services/ior.service';
import {
  CreateOccurrenceDto,
  ShowOccurrenceDto,
  SearchIORDto,
  DeleteOccurrenceDto,
  UpdateOccurrenceDto,
  AddCategoryIORDto,
  AddFollowUpOccurrenceDto,
  UpdateFollowUpOccurrenceDto,
} from '../dtos/ior.dto';

import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('ior')
export class IorController {
  constructor(private readonly iorService: IorService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addOccurrence(@Body() createOccurrenceDto: CreateOccurrenceDto) {
    try {
      const result =
        await this.iorService.createOccurrence(createOccurrenceDto);
      return {
        status: 200,
        message: 'Occurrence Created',
        result,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error Creating Occurrence',
        error,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('show')
  async showOccurrence(@Query() query: ShowOccurrenceDto) {
    const { id_IOR } = query;

    if (!id_IOR) {
      return {
        status: 400,
        message: 'id_IOR is required',
      };
    }

    try {
      const result = await this.iorService.getOccurrence({ id_IOR });
      return {
        status: 200,
        message: 'Occurrence found',
        result,
      };
    } catch (error) {
      console.error('Error fetching occurrence:', error);
      return {
        status: 500,
        message: 'Error Fetching Occurrence',
        error: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('show-all')
  async showAllOccurrences() {
    try {
      const result = await this.iorService.getAllOccurrences();
      return {
        status: 200,
        message: 'Occurrences found',
        result,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error Fetching Occurrences',
        error,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  async searchIOR(@Body() searchIORDto: SearchIORDto) {
    const result = await this.iorService.searchIOR(searchIORDto);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateOccurrence(@Body() updateOccurrenceDto: UpdateOccurrenceDto) {
    const result = await this.iorService.updateOccurrence(updateOccurrenceDto);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteOccurrence(@Body() deleteOccurrenceDto: DeleteOccurrenceDto) {
    const result = await this.iorService.deleteOccurrence(deleteOccurrenceDto);
    return result;
  }

  @Post('category/add')
  async addCategoryIOR(@Body() dto: AddCategoryIORDto) {
    const result = await this.iorService.addCategoryIOR(dto);
    return {
      status: 200,
      message: 'Category IOR Created',
      result,
    };
  }

  @Post('follow-up/add')
  async addFollowUpOccurrence(@Body() dto: AddFollowUpOccurrenceDto) {
    const result = await this.iorService.addFollowUpOccurrence(dto);
    return {
      status: 200,
      message: 'Follow-Up Occurrence Created',
      result,
    };
  }

  @Put('follow-up/update')
  async updateFollowUpOccurrence(@Body() dto: UpdateFollowUpOccurrenceDto) {
    const result = await this.iorService.updateFollowUpOccurrence(dto);
    return {
      status: 200,
      message: 'Follow-Up Occurrence Updated',
      result,
    };
  }
}
