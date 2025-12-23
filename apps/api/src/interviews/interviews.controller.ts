import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto, UpdateInterviewDto, CreateQuestionDto } from './dto/interview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @Post()
  async create(@Body() dto: CreateInterviewDto, @CurrentUser() user: any) {
    return this.interviewsService.create(dto, user.id, user.company.id);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.interviewsService.findAll(user.company.id);
  }

  @Get('statistics')
  async getStatistics(@CurrentUser() user: any) {
    return this.interviewsService.getStatistics(user.company.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.interviewsService.findById(id, user.company.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInterviewDto,
    @CurrentUser() user: any,
  ) {
    return this.interviewsService.update(id, dto, user.company.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.interviewsService.delete(id, user.company.id);
  }

  @Post(':id/questions')
  async addQuestion(
    @Param('id') id: string,
    @Body() dto: CreateQuestionDto,
    @CurrentUser() user: any,
  ) {
    return this.interviewsService.addQuestion(id, dto, user.company.id);
  }

  @Put('questions/:questionId')
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() dto: CreateQuestionDto,
    @CurrentUser() user: any,
  ) {
    return this.interviewsService.updateQuestion(questionId, dto, user.company.id);
  }

  @Delete('questions/:questionId')
  async deleteQuestion(
    @Param('questionId') questionId: string,
    @CurrentUser() user: any,
  ) {
    return this.interviewsService.deleteQuestion(questionId, user.company.id);
  }
}

