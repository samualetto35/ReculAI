import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class ResponsesService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async createOrUpdate(
    candidateToken: string,
    questionId: string,
    data: { videoUrl?: string; audioUrl?: string; duration?: number; fileSize?: number },
  ) {
    // Get candidate by token
    const candidate = await this.prisma.candidate.findUnique({
      where: { accessToken: candidateToken },
      include: {
        interview: {
          include: { questions: true },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    // Verify question belongs to this interview
    const question = candidate.interview.questions.find(q => q.id === questionId);
    if (!question) {
      throw new BadRequestException('Question not found in this interview');
    }

    // Create or update response
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

    // Update candidate status
    await this.prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: 'IN_PROGRESS' },
    });

    // Queue for processing
    await this.queueService.addTranscriptionJob(response.id);

    return response;
  }

  async findByCandidate(candidateId: string) {
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

  async findById(id: string) {
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
      throw new NotFoundException('Response not found');
    }

    return response;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.response.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async saveTranscription(
    responseId: string,
    data: { text: string; segments: any[]; language?: string; confidence?: number; processingTime?: number },
  ) {
    // Create transcription
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

    // Update response status
    await this.prisma.response.update({
      where: { id: responseId },
      data: { status: 'TRANSCRIBING' },
    });

    // Queue for AI analysis
    await this.queueService.addAnalysisJob(responseId);
  }

  async saveAnalysis(
    responseId: string,
    data: {
      overallScore: number;
      competencies: any[];
      highlights: any[];
      redFlags?: any[];
      summary: string;
      starAnalysis?: any;
      rawLLMResponse?: any;
      processingTime?: number;
    },
  ) {
    // Create analysis
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

    // Update response status
    await this.prisma.response.update({
      where: { id: responseId },
      data: { status: 'COMPLETED' },
    });

    // Update candidate evaluation with AI score
    const response = await this.prisma.response.findUnique({
      where: { id: responseId },
      include: { candidate: true },
    });

    if (response) {
      // Calculate average score across all responses
      const allResponses = await this.prisma.response.findMany({
        where: { candidateId: response.candidateId },
        include: { analysis: true },
      });

      const completedResponses = allResponses.filter(r => r.analysis);
      if (completedResponses.length > 0) {
        const avgScore =
          completedResponses.reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0) /
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
}

