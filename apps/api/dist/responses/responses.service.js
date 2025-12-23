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
exports.ResponsesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_service_1 = require("../queue/queue.service");
let ResponsesService = class ResponsesService {
    constructor(prisma, queueService) {
        this.prisma = prisma;
        this.queueService = queueService;
    }
    async createOrUpdate(candidateToken, questionId, data) {
        const candidate = await this.prisma.candidate.findUnique({
            where: { accessToken: candidateToken },
            include: {
                interview: {
                    include: { questions: true },
                },
            },
        });
        if (!candidate) {
            throw new common_1.NotFoundException('Candidate not found');
        }
        const question = candidate.interview.questions.find(q => q.id === questionId);
        if (!question) {
            throw new common_1.BadRequestException('Question not found in this interview');
        }
        const response = await this.prisma.response.upsert({
            where: {
                candidateId_questionId: {
                    candidateId: candidate.id,
                    questionId,
                },
            },
            create: {
                candidateId: candidate.id,
                questionId,
                videoUrl: data.videoUrl,
                audioUrl: data.audioUrl,
                duration: data.duration,
                fileSize: data.fileSize,
                status: 'UPLOADED',
            },
            update: {
                videoUrl: data.videoUrl,
                audioUrl: data.audioUrl,
                duration: data.duration,
                fileSize: data.fileSize,
                status: 'UPLOADED',
                retakeNumber: { increment: 1 },
            },
        });
        await this.prisma.candidate.update({
            where: { id: candidate.id },
            data: { status: 'IN_PROGRESS' },
        });
        await this.queueService.addTranscriptionJob(response.id);
        return response;
    }
    async findByCandidate(candidateId) {
        return this.prisma.response.findMany({
            where: { candidateId },
            include: {
                question: true,
                transcription: true,
                analysis: true,
            },
            orderBy: { question: { order: 'asc' } },
        });
    }
    async findById(id) {
        const response = await this.prisma.response.findUnique({
            where: { id },
            include: {
                question: true,
                candidate: {
                    include: {
                        interview: true,
                    },
                },
                transcription: true,
                analysis: true,
            },
        });
        if (!response) {
            throw new common_1.NotFoundException('Response not found');
        }
        return response;
    }
    async updateStatus(id, status) {
        return this.prisma.response.update({
            where: { id },
            data: { status: status },
        });
    }
    async saveTranscription(responseId, data) {
        await this.prisma.transcription.upsert({
            where: { responseId },
            create: {
                responseId,
                text: data.text,
                segments: data.segments,
                language: data.language,
                confidence: data.confidence,
                processingTime: data.processingTime,
            },
            update: {
                text: data.text,
                segments: data.segments,
                language: data.language,
                confidence: data.confidence,
                processingTime: data.processingTime,
            },
        });
        await this.prisma.response.update({
            where: { id: responseId },
            data: { status: 'TRANSCRIBING' },
        });
        await this.queueService.addAnalysisJob(responseId);
    }
    async saveAnalysis(responseId, data) {
        await this.prisma.analysis.upsert({
            where: { responseId },
            create: {
                responseId,
                overallScore: data.overallScore,
                competencies: data.competencies,
                highlights: data.highlights,
                redFlags: data.redFlags || [],
                summary: data.summary,
                starAnalysis: data.starAnalysis,
                rawLLMResponse: data.rawLLMResponse,
                processingTime: data.processingTime,
            },
            update: {
                overallScore: data.overallScore,
                competencies: data.competencies,
                highlights: data.highlights,
                redFlags: data.redFlags || [],
                summary: data.summary,
                starAnalysis: data.starAnalysis,
                rawLLMResponse: data.rawLLMResponse,
                processingTime: data.processingTime,
            },
        });
        await this.prisma.response.update({
            where: { id: responseId },
            data: { status: 'COMPLETED' },
        });
        const response = await this.prisma.response.findUnique({
            where: { id: responseId },
            include: { candidate: true },
        });
        if (response) {
            const allResponses = await this.prisma.response.findMany({
                where: { candidateId: response.candidateId },
                include: { analysis: true },
            });
            const completedResponses = allResponses.filter(r => r.analysis);
            if (completedResponses.length > 0) {
                const avgScore = completedResponses.reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0) /
                    completedResponses.length;
                await this.prisma.evaluation.upsert({
                    where: { candidateId: response.candidateId },
                    create: {
                        candidateId: response.candidateId,
                        aiScore: avgScore,
                    },
                    update: {
                        aiScore: avgScore,
                    },
                });
            }
        }
    }
};
exports.ResponsesService = ResponsesService;
exports.ResponsesService = ResponsesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], ResponsesService);
//# sourceMappingURL=responses.service.js.map