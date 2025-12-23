import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

// This controller handles public endpoints for candidates taking interviews
// No authentication required - access is controlled via unique access tokens

@Controller('public/interview')
export class PublicCandidateController {
  constructor(private candidatesService: CandidatesService) {}

  @Get(':token')
  async getInterview(@Param('token') token: string) {
    return this.candidatesService.findByAccessToken(token);
  }

  @Post(':token/start')
  async startInterview(
    @Param('token') token: string,
    @Body() body: { deviceInfo?: any },
  ) {
    return this.candidatesService.startInterview(token, body.deviceInfo);
  }

  @Post(':token/complete')
  async completeInterview(@Param('token') token: string) {
    return this.candidatesService.completeInterview(token);
  }

  @Post(':token/suspicious-behavior')
  async reportSuspiciousBehavior(
    @Param('token') token: string,
    @Body() body: { type: string; details?: any },
  ) {
    await this.candidatesService.reportSuspiciousBehavior(token, body);
    return { success: true };
  }
}

