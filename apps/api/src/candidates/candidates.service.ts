import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteCandidateDto, UpdateCandidateStatusDto } from './dto/candidate.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async invite(interviewId: string, dto: InviteCandidateDto, companyId: string) {
    // Verify interview belongs to company
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview || interview.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    if (interview.status !== 'ACTIVE') {
      throw new BadRequestException('Interview is not active');
    }

    // Check if candidate already invited
    const existing = await this.prisma.candidate.findFirst({
      where: {
        email: dto.email,
        interviewId,
      },
    });

    if (existing) {
      throw new BadRequestException('Candidate already invited to this interview');
    }

    const candidate = await this.prisma.candidate.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        interviewId,
        accessToken: uuidv4(),
      },
    });

    // Generate interview link
    const interviewLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/interview/${candidate.accessToken}`;

    return {
      ...candidate,
      interviewLink,
    };
  }

  async bulkInvite(interviewId: string, candidates: InviteCandidateDto[], companyId: string) {
    const results = [];
    
    for (const candidate of candidates) {
      try {
        const result = await this.invite(interviewId, candidate, companyId);
        results.push({ success: true, candidate: result });
      } catch (error: any) {
        results.push({ success: false, email: candidate.email, error: error.message });
      }
    }

    return results;
  }

  async findByInterview(interviewId: string, companyId: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview || interview.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
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

  async findById(id: string, companyId: string) {
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
      throw new ForbiddenException('Access denied');
    }

    return candidate;
  }

  async updateStatus(id: string, dto: UpdateCandidateStatusDto, companyId: string) {
    const candidate = await this.findById(id, companyId);

    return this.prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: dto.status },
    });
  }

  async updateEvaluation(
    candidateId: string,
    data: { decision?: string; humanScore?: number; humanNotes?: string },
    userId: string,
    companyId: string,
  ) {
    const candidate = await this.findById(candidateId, companyId);

    return this.prisma.evaluation.upsert({
      where: { candidateId: candidate.id },
      create: {
        candidateId: candidate.id,
        evaluatorId: userId,
        aiScore: 0,
        humanScore: data.humanScore,
        humanNotes: data.humanNotes,
        decision: data.decision as any,
        decidedAt: data.decision ? new Date() : null,
      },
      update: {
        evaluatorId: userId,
        humanScore: data.humanScore,
        humanNotes: data.humanNotes,
        decision: data.decision as any,
        decidedAt: data.decision ? new Date() : undefined,
      },
    });
  }

  // ========== PUBLIC ACCESS (for candidates) ==========

  async findByAccessToken(token: string) {
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
      throw new NotFoundException('Interview not found or link expired');
    }

    if (candidate.interview.status !== 'ACTIVE') {
      throw new BadRequestException('This interview is no longer accepting responses');
    }

    if (candidate.interview.expiresAt && new Date() > candidate.interview.expiresAt) {
      throw new BadRequestException('This interview link has expired');
    }

    if (candidate.status === 'COMPLETED') {
      throw new BadRequestException('You have already completed this interview');
    }

    return candidate;
  }

  async startInterview(token: string, deviceInfo?: any) {
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

  async completeInterview(token: string) {
    const candidate = await this.findByAccessToken(token);

    return this.prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  async reportSuspiciousBehavior(token: string, behavior: any) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { accessToken: token },
    });

    if (!candidate) return;

    const existingBehavior = (candidate.suspiciousBehavior as any[]) || [];
    
    await this.prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        suspiciousBehavior: [...existingBehavior, { ...behavior, timestamp: new Date() }],
      },
    });
  }
}

