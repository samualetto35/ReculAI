import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('responses')
@UseGuards(JwtAuthGuard)
export class ResponsesController {
  constructor(private responsesService: ResponsesService) {}

  @Get('candidate/:candidateId')
  async findByCandidate(@Param('candidateId') candidateId: string) {
    return this.responsesService.findByCandidate(candidateId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.responsesService.findById(id);
  }
}

