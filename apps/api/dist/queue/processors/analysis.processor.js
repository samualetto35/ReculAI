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
exports.AnalysisProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const prisma_service_1 = require("../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
const queue_service_1 = require("../queue.service");
let AnalysisProcessor = class AnalysisProcessor {
    constructor(prisma, aiService, queueService) {
        this.prisma = prisma;
        this.aiService = aiService;
        this.queueService = queueService;
        this.worker = null;
    }
    async onModuleInit() {
        this.worker = new bullmq_1.Worker('analysis', async (job) => {
            console.log(`🧠 Processing analysis job: ${job.id}`);
            await this.process(job);
        }, {
            connection: this.queueService.getConnection(),
            concurrency: 5,
        });
        this.worker.on('completed', (job) => {
            console.log(`✅ Analysis completed: ${job.id}`);
        });
        this.worker.on('failed', (job, err) => {
            console.error(`❌ Analysis failed: ${job?.id}`, err);
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
                    transcription: true,
                    candidate: {
                        include: {
                            interview: {
                                include: {
                                    rubric: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!response || !response.transcription) {
                throw new Error(`Response or transcription not found: ${responseId}`);
            }
            await this.prisma.response.update({
                where: { id: responseId },
                data: { status: 'ANALYZING' },
            });
            const rubric = response.candidate.interview.rubric;
            const analysis = await this.aiService.analyzeResponse({
                question: response.question.text,
                transcript: response.transcription.text,
                segments: response.transcription.segments,
                rubric: rubric?.competencies,
            });
            await this.prisma.analysis.upsert({
                where: { responseId },
                create: {
                    responseId,
                    overallScore: analysis.overallScore,
                    competencies: analysis.competencies,
                    highlights: analysis.highlights,
                    redFlags: analysis.redFlags || [],
                    summary: analysis.summary,
                    starAnalysis: analysis.starAnalysis,
                    rawLLMResponse: analysis.rawResponse,
                    processingTime: Date.now() - startTime,
                },
                update: {
                    overallScore: analysis.overallScore,
                    competencies: analysis.competencies,
                    highlights: analysis.highlights,
                    redFlags: analysis.redFlags || [],
                    summary: analysis.summary,
                    starAnalysis: analysis.starAnalysis,
                    rawLLMResponse: analysis.rawResponse,
                    processingTime: Date.now() - startTime,
                },
            });
            await this.prisma.response.update({
                where: { id: responseId },
                data: { status: 'COMPLETED' },
            });
            await this.updateCandidateEvaluation(response.candidateId);
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
    async updateCandidateEvaluation(candidateId) {
        const responses = await this.prisma.response.findMany({
            where: {
                candidateId,
                status: 'COMPLETED',
            },
            include: {
                analysis: true,
            },
        });
        if (responses.length === 0)
            return;
        const totalScore = responses.reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0);
        const avgScore = totalScore / responses.length;
        const allCompetencies = [];
        responses.forEach((r) => {
            if (r.analysis?.competencies) {
                allCompetencies.push(...r.analysis.competencies);
            }
        });
        const summaries = responses
            .map((r) => r.analysis?.summary)
            .filter(Boolean)
            .join('\n\n');
        await this.prisma.evaluation.upsert({
            where: { candidateId },
            create: {
                candidateId,
                aiScore: avgScore,
                aiNotes: summaries,
            },
            update: {
                aiScore: avgScore,
                aiNotes: summaries,
            },
        });
    }
};
exports.AnalysisProcessor = AnalysisProcessor;
exports.AnalysisProcessor = AnalysisProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AIService,
        queue_service_1.QueueService])
], AnalysisProcessor);
//# sourceMappingURL=analysis.processor.js.map