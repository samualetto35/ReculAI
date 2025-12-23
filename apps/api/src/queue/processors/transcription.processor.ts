import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { AIService } from '../../ai/ai.service';
import { QueueService, JobData } from '../queue.service';

@Injectable()
export class TranscriptionProcessor implements OnModuleInit {
  private worker: Worker<JobData> | null = null;

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private queueService: QueueService,
  ) {}

  async onModuleInit() {
    this.worker = new Worker<JobData>(
      'transcription',
      async (job: Job<JobData>) => {
        console.log(`🎤 Processing transcription job: ${job.id}`);
        await this.process(job);
      },
      {
        connection: this.queueService.getConnection(),
        concurrency: 3, // Process 3 jobs at a time
      },
    );

    this.worker.on('completed', (job) => {
      console.log(`✅ Transcription completed: ${job.id}`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ Transcription failed: ${job?.id}`, err);
    });
  }

  async process(job: Job<JobData>) {
    const { responseId } = job.data;
    const startTime = Date.now();

    try {
      // Get response with video URL
      const response = await this.prisma.response.findUnique({
        where: { id: responseId },
        include: {
          question: true,
          candidate: true,
        },
      });

      if (!response) {
        throw new Error(`Response not found: ${responseId}`);
      }

      // Update status
      await this.prisma.response.update({
        where: { id: responseId },
        data: { status: 'TRANSCRIBING' },
      });

      // Get video/audio URL
      const mediaUrl = response.videoUrl || response.audioUrl;
      if (!mediaUrl) {
        throw new Error('No media URL found');
      }

      // Transcribe using Whisper
      const transcription = await this.aiService.transcribe(mediaUrl);

      // Save transcription
      await this.prisma.transcription.upsert({
        where: { responseId },
        create: {
          responseId,
          text: transcription.text,
          segments: transcription.segments,
          language: transcription.language,
          confidence: transcription.confidence,
          processingTime: Date.now() - startTime,
        },
        update: {
          text: transcription.text,
          segments: transcription.segments,
          language: transcription.language,
          confidence: transcription.confidence,
          processingTime: Date.now() - startTime,
        },
      });

      // Queue for analysis
      await this.queueService.addAnalysisJob(responseId);

      return { success: true, responseId };
    } catch (error: any) {
      // Update status to failed
      await this.prisma.response.update({
        where: { id: responseId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  }
}

