import { Controller, Post, Body, Param } from '@nestjs/common';
import { ResponsesService } from './responses.service';

@Controller('public/responses')
export class PublicResponseController {
  constructor(private responsesService: ResponsesService) {}

  @Post(':token/:questionId')
  async submitResponse(
    @Param('token') token: string,
    @Param('questionId') questionId: string,
    @Body() body: {
      videoUrl?: string;
      audioUrl?: string;
      duration?: number;
      fileSize?: number;
    },
  ) {
    return this.responsesService.createOrUpdate(token, questionId, body);
  }
}

