import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Job } from 'bullmq';
import IORedis from 'ioredis';
export type JobData = {
    responseId: string;
};
export declare class QueueService implements OnModuleInit, OnModuleDestroy {
    private config;
    private connection;
    private transcriptionQueue;
    private analysisQueue;
    private transcriptionWorker;
    private analysisWorker;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    addTranscriptionJob(responseId: string): Promise<Job<JobData>>;
    addAnalysisJob(responseId: string): Promise<Job<JobData>>;
    getTranscriptionQueue(): Queue<JobData>;
    getAnalysisQueue(): Queue<JobData>;
    getConnection(): IORedis;
    getStats(): Promise<{
        transcription: {
            [index: string]: number;
        };
        analysis: {
            [index: string]: number;
        };
    }>;
}
