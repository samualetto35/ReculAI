import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  // Get presigned URL for uploading video/audio
  @Post('presigned-url')
  async getPresignedUrl(
    @Body() body: {
      candidateId: string;
      questionId: string;
      fileType: 'video' | 'audio';
      contentType: string;
    },
  ) {
    return this.uploadService.getPresignedUploadUrl(
      body.candidateId,
      body.questionId,
      body.fileType,
      body.contentType,
    );
  }

  // Get presigned URL for downloading/viewing
  @Get('download-url')
  async getDownloadUrl(@Query('fileKey') fileKey: string) {
    const url = await this.uploadService.getPresignedDownloadUrl(fileKey);
    return { url };
  }
}

