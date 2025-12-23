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
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InterviewsService = class InterviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId, companyId) {
        return this.prisma.interview.create({
            data: {
                title: dto.title,
                description: dto.description,
                companyId,
                createdById: userId,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
                settings: dto.settings || {},
                questions: {
                    create: dto.questions?.map((q, index) => ({
                        order: index + 1,
                        text: q.text,
                        thinkingTime: q.thinkingTime || 30,
                        answerTime: q.answerTime || 120,
                        retakes: q.retakes || 1,
                        isRequired: q.isRequired ?? true,
                    })) || [],
                },
            },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
                _count: {
                    select: { candidates: true },
                },
            },
        });
    }
    async findAll(companyId) {
        return this.prisma.interview.findMany({
            where: { companyId },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { candidates: true, questions: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id, companyId) {
        const interview = await this.prisma.interview.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
                rubric: true,
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                candidates: {
                    include: {
                        evaluation: true,
                        responses: {
                            include: {
                                analysis: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: { candidates: true },
                },
            },
        });
        if (!interview) {
            throw new common_1.NotFoundException('Interview not found');
        }
        if (interview.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return interview;
    }
    async update(id, dto, companyId) {
        const interview = await this.findById(id, companyId);
        return this.prisma.interview.update({
            where: { id: interview.id },
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
                settings: dto.settings,
            },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async delete(id, companyId) {
        const interview = await this.findById(id, companyId);
        await this.prisma.interview.delete({
            where: { id: interview.id },
        });
        return { message: 'Interview deleted successfully' };
    }
    async addQuestion(interviewId, dto, companyId) {
        await this.findById(interviewId, companyId);
        const lastQuestion = await this.prisma.question.findFirst({
            where: { interviewId },
            orderBy: { order: 'desc' },
        });
        return this.prisma.question.create({
            data: {
                interviewId,
                order: (lastQuestion?.order || 0) + 1,
                text: dto.text,
                thinkingTime: dto.thinkingTime || 30,
                answerTime: dto.answerTime || 120,
                retakes: dto.retakes || 1,
                isRequired: dto.isRequired ?? true,
            },
        });
    }
    async updateQuestion(questionId, dto, companyId) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { interview: true },
        });
        if (!question || question.interview.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.question.update({
            where: { id: questionId },
            data: {
                text: dto.text,
                thinkingTime: dto.thinkingTime,
                answerTime: dto.answerTime,
                retakes: dto.retakes,
                isRequired: dto.isRequired,
            },
        });
    }
    async deleteQuestion(questionId, companyId) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { interview: true },
        });
        if (!question || question.interview.companyId !== companyId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.question.delete({
            where: { id: questionId },
        });
        return { message: 'Question deleted successfully' };
    }
    async getStatistics(companyId) {
        const [totalInterviews, activeInterviews, totalCandidates, completedCandidates] = await Promise.all([
            this.prisma.interview.count({ where: { companyId } }),
            this.prisma.interview.count({ where: { companyId, status: 'ACTIVE' } }),
            this.prisma.candidate.count({
                where: { interview: { companyId } },
            }),
            this.prisma.candidate.count({
                where: { interview: { companyId }, status: 'COMPLETED' },
            }),
        ]);
        return {
            totalInterviews,
            activeInterviews,
            totalCandidates,
            completedCandidates,
            completionRate: totalCandidates > 0 ? (completedCandidates / totalCandidates) * 100 : 0,
        };
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map