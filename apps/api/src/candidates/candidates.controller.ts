import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { InviteCandidateDto, UpdateCandidateStatusDto, UpdateEvaluationDto } from './dto/candidate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('candidates')
@UseGuards(JwtAuthGuard)
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Post('invite/:interviewId')
  async invite(
    @Param('interviewId') interviewId: string,
    @Body() dto: InviteCandidateDto,
    @CurrentUser() user: any,
  ) {
    return this.candidatesService.invite(interviewId, dto, user.company.id);
  }

  @Post('bulk-invite/:interviewId')
  async bulkInvite(
    @Param('interviewId') interviewId: string,
    @Body() dto: { candidates: InviteCandidateDto[] },
    @CurrentUser() user: any,
  ) {
    return this.candidatesService.bulkInvite(interviewId, dto.candidates, user.company.id);
  }

  @Get('interview/:interviewId')
  async findByInterview(
    @Param('interviewId') interviewId: string,
    @CurrentUser() user: any,
  ) {
    return this.candidatesService.findByInterview(interviewId, user.company.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.candidatesService.findById(id, user.company.id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCandidateStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.candidatesService.updateStatus(id, dto, user.company.id);
  }

  @Put(':id/evaluation')
  async updateEvaluation(
    @Param('id') id: string,
    @Body() dto: UpdateEvaluationDto,
    @CurrentUser() user: any,
  ) {
    return this.candidatesService.updateEvaluation(id, dto, user.id, user.company.id);
  }
}

