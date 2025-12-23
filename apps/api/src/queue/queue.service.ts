import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

export type JobData = {
  responseId: string;
};

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private connection: IORedis;
  private transcriptionQueue: Queue<JobData>;
  private analysisQueue: Queue<JobData>;
  private transcriptionWorker: Worker<JobData> | null = null;
  private analysisWorker: Worker<JobData> | null = null;

  constructor(private config: ConfigService) {
    const redisUrl = this.config.get('REDIS_URL') || 'redis://localhost:6379';
    this.connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    });

    this.transcriptionQueue = new Queue('transcription', {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    this.analysisQueue = new Queue('analysis', {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });
  }

  async onModuleInit() {
    console.log('🔄 Queue service initialized');
  }

  async onModuleDestroy() {
    await this.transcriptionQueue.close();
    await this.analysisQueue.close();
    if (this.transcriptionWorker) await this.transcriptionWorker.close();
    if (this.analysisWorker) await this.analysisWorker.close();
    await this.connection.quit();
  }

  async addTranscriptionJob(responseId: string): Promise<Job<JobData>> {
    console.log(`📝 Adding transcription job for response: ${responseId}`);
    return this.transcriptionQueue.add('transcribe', { responseId }, {
      priority: 1,
    });
  }

  async addAnalysisJob(responseId: string): Promise<Job<JobData>> {
    console.log(`🤖 Adding analysis job for response: ${responseId}`);
    return this.analysisQueue.add('analyze', { responseId }, {
      priority: 1,
    });
  }

  getTranscriptionQueue(): Queue<JobData> {
    return this.transcriptionQueue;
  }

  getAnalysisQueue(): Queue<JobData> {
    return this.analysisQueue;
  }

  getConnection(): IORedis {
    return this.connection;
  }

  // Get queue statistics
  async getStats() {
    const [transcriptionCounts, analysisCounts] = await Promise.all([
      this.transcriptionQueue.getJobCounts(),
      this.analysisQueue.getJobCounts(),
    ]);

    return {
      transcription: transcriptionCounts,
      analysis: analysisCounts,
    };
  }
}

