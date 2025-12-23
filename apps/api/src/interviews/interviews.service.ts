import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto, UpdateInterviewDto, CreateQuestionDto } from './dto/interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInterviewDto, userId: string, companyId: string) {
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

  async findAll(companyId: string) {
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

  async findById(id: string, companyId: string) {
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
      throw new NotFoundException('Interview not found');
    }

    if (interview.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    return interview;
  }

  async update(id: string, dto: UpdateInterviewDto, companyId: string) {
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

  async delete(id: string, companyId: string) {
    const interview = await this.findById(id, companyId);
    
    await this.prisma.interview.delete({
      where: { id: interview.id },
    });

    return { message: 'Interview deleted successfully' };
  }

  async addQuestion(interviewId: string, dto: CreateQuestionDto, companyId: string) {
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

  async updateQuestion(questionId: string, dto: CreateQuestionDto, companyId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { interview: true },
    });

    if (!question || question.interview.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
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

  async deleteQuestion(questionId: string, companyId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { interview: true },
    });

    if (!question || question.interview.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.question.delete({
      where: { id: questionId },
    });

    return { message: 'Question deleted successfully' };
  }

  async getStatistics(companyId: string) {
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
}

