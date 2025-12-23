"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const prisma_service_1 = require("../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
const queue_service_1 = require("../queue.service");
let TranscriptionProcessor = class TranscriptionProcessor {
    constructor(prisma, aiService, queueService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.queueService = queueService;
        this.worker = null;
    }
    async onModuleInit() {
        this.worker = new bullmq_1.Worker('transcription', async (job) => {
            console.log(`🎤 Processing transcription job: ${job.id}`);
            await this.process(job);
        }, {
            connection: this.queueService.getConnection(),
            concurrency: 3,
        });
        this.worker.on('completed', (job) => {
            console.log(`✅ Transcription completed: ${job.id}`);
        });
        this.worker.on('failed', (job, err) => {
            console.error(`❌ Transcription failed: ${job?.id}`, err);
        });
    }
    async process(job) {
        const { responseId } = job.data;
        const startTime = Date.now();
        try {
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
            await this.prisma.response.update({
                where: { id: responseId },
                data: { status: 'TRANSCRIBING' },
            });
            const mediaUrl = response.videoUrl || response.audioUrl;
            if (!mediaUrl) {
                throw new Error('No media URL found');
            }
            const transcription = await this.aiService.transcribe(mediaUrl);
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
            await this.queueService.addAnalysisJob(responseId);
            return { success: true, responseId };
        }
        catch (error) {
            await this.prisma.response.update({
                where: { id: responseId },
                data: { status: 'FAILED' },
            });
            throw error;
        }
    }
};
exports.TranscriptionProcessor = TranscriptionProcessor;
exports.TranscriptionProcessor = TranscriptionProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AIService,
        queue_service_1.QueueService])
], TranscriptionProcessor);
//# sourceMappingURL=transcription.processor.js.map