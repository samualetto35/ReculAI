import { OnModuleInit } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { AIService } from '../../ai/ai.service';
import { QueueService, JobData } from '../queue.service';
export declare class TranscriptionProcessor implements OnModuleInit {
    private prisma;
    private aiService;
    private queueService;
    private worker;
    constructor(prisma: PrismaService, aiService: AIService, queueService: QueueService);
    onModuleInit(): Promise<void>;
    process(job: Job<JobData>): Promise<{
        success: boolean;
        responseId: string;
    }>;
}
