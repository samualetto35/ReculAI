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
exports.CandidatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let CandidatesService = class CandidatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async invite(interviewId, dto, companyId) {
        const interview = await this.prisma.interview.findUnique({
            where: { id: interviewId },
        });
        if (!interview || interview.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (interview.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Interview is not active');
        }
        const existing = await this.prisma.candidate.findFirst({
            where: {
                email: dto.email,
                interviewId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Candidate already invited to this interview');
        }
        const candidate = await this.prisma.candidate.create({
            data: {
                email: dto.email,
                name: dto.name,
                phone: dto.phone,
                interviewId,
                accessToken: (0, uuid_1.v4)(),
            },
        });
        const interviewLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/interview/${candidate.accessToken}`;
        return {
            ...candidate,
            interviewLink,
        };
    }
    async bulkInvite(interviewId, candidates, companyId) {
        const results = [];
        for (const candidate of candidates) {
            try {
                const result = await this.invite(interviewId, candidate, companyId);
                results.push({ success: true, candidate: result });
            }
            catch (error) {
                results.push({ success: false, email: candidate.email, error: error.message });
            }
        }
        return results;
    }
    async findByInterview(interviewId, companyId) {
        const interview = await this.prisma.interview.findUnique({
            where: { id: interviewId },
        });
        if (!interview || interview.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.candidate.findMany({
            where: { interviewId },
            include: {
                evaluation: true,
                responses: {
                    include: {
                        analysis: true,
                        question: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id, companyId) {
        const candidate = await this.prisma.candidate.findUnique({
            where: { id },
            include: {
                interview: {
                    include: {
                        questions: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
                evaluation: true,
                responses: {
                    include: {
                        question: true,
                        transcription: true,
                        analysis: true,
                    },
                },
            },
        });
        if (!candidate || candidate.interview.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return candidate;
    }
    async updateStatus(id, dto, companyId) {
        const candidate = await this.findById(id, companyId);
        return this.prisma.candidate.update({
            where: { id: candidate.id },
            data: { status: dto.status },
        });
    }
    async updateEvaluation(candidateId, data, userId, companyId) {
        const candidate = await this.findById(candidateId, companyId);
        return this.prisma.evaluation.upsert({
            where: { candidateId: candidate.id },
            create: {
                candidateId: candidate.id,
                evaluatorId: userId,
                aiScore: 0,
                humanScore: data.humanScore,
                humanNotes: data.humanNotes,
                decision: data.decision,
                decidedAt: data.decision ? new Date() : null,
            },
            update: {
                evaluatorId: userId,
                humanScore: data.humanScore,
                humanNotes: data.humanNotes,
                decision: data.decision,
                decidedAt: data.decision ? new Date() : undefined,
            },
        });
    }
    async findByAccessToken(token) {
        const candidate = await this.prisma.candidate.findUnique({
            where: { accessToken: token },
            include: {
                interview: {
                    include: {
                        questions: {
                            orderBy: { order: 'asc' },
                        },
                        company: {
                            select: { id: true, name: true, logo: true },
                        },
                    },
                },
                responses: {
                    select: {
                        id: true,
                        questionId: true,
                        status: true,
                    },
                },
            },
        });
        if (!candidate) {
            throw new common_1.NotFoundException('Interview not found or link expired');
        }
        if (candidate.interview.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('This interview is no longer accepting responses');
        }
        if (candidate.interview.expiresAt && new Date() > candidate.interview.expiresAt) {
            throw new common_1.BadRequestException('This interview link has expired');
        }
        if (candidate.status === 'COMPLETED') {
            throw new common_1.BadRequestException('You have already completed this interview');
        }
        return candidate;
    }
    async startInterview(token, deviceInfo) {
        const candidate = await this.findByAccessToken(token);
        if (candidate.status === 'INVITED') {
            await this.prisma.candidate.update({
                where: { id: candidate.id },
                data: {
                    status: 'STARTED',
                    startedAt: new Date(),
                    deviceInfo,
                },
            });
        }
        return candidate;
    }
    async completeInterview(token) {
        const candidate = await this.findByAccessToken(token);
        return this.prisma.candidate.update({
            where: { id: candidate.id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        });
    }
    async reportSuspiciousBehavior(token, behavior) {
        const candidate = await this.prisma.candidate.findUnique({
            where: { accessToken: token },
        });
        if (!candidate)
            return;
        const existingBehavior = candidate.suspiciousBehavior || [];
        await this.prisma.candidate.update({
            where: { id: candidate.id },
            data: {
                suspiciousBehavior: [...existingBehavior, { ...behavior, timestamp: new Date() }],
            },
        });
    }
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CandidatesService);
//# sourceMappingURL=candidates.service.js.map