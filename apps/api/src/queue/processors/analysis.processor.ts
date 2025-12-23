import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { AIService } from '../../ai/ai.service';
import { QueueService, JobData } from '../queue.service';

@Injectable()
export class AnalysisProcessor implements OnModuleInit {
  private worker: Worker<JobData> | null = null;

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private queueService: QueueService,
  ) {}

  async onModuleInit() {
    this.worker = new Worker<JobData>(
      'analysis',
      async (job: Job<JobData>) => {
        console.log(`🧠 Processing analysis job: ${job.id}`);
        await this.process(job);
      },
      {
        connection: this.queueService.getConnection(),
        concurrency: 5, // Process 5 jobs at a time
      },
    );

    this.worker.on('completed', (job) => {
      console.log(`✅ Analysis completed: ${job.id}`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ Analysis failed: ${job?.id}`, err);
    });
  }

  async process(job: Job<JobData>) {
    const { responseId } = job.data;
    const startTime = Date.now();

    try {
      // Get response with transcription
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

      // Update status
      await this.prisma.response.update({
        where: { id: responseId },
        data: { status: 'ANALYZING' },
      });

      // Get rubric if available
      const rubric = response.candidate.interview.rubric;

      // Analyze using GPT
      const analysis = await this.aiService.analyzeResponse({
        question: response.question.text,
        transcript: response.transcription.text,
        segments: response.transcription.segments as any[],
        rubric: rubric?.competencies as any,
      });

      // Save analysis
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

      // Update response status
      await this.prisma.response.update({
        where: { id: responseId },
        data: { status: 'COMPLETED' },
      });

      // Update candidate evaluation
      await this.updateCandidateEvaluation(response.candidateId);

      return { success: true, responseId };
    } catch (error: any) {
      // Update status to failed
      await this.prisma.response.update({
        where: { id: responseId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  }

  private async updateCandidateEvaluation(candidateId: string) {
    // Get all completed responses for this candidate
    const responses = await this.prisma.response.findMany({
      where: {
        candidateId,
        status: 'COMPLETED',
      },
      include: {
        analysis: true,
      },
    });

    if (responses.length === 0) return;

    // Calculate average AI score
    const totalScore = responses.reduce(
      (sum, r) => sum + (r.analysis?.overallScore || 0),
      0,
    );
    const avgScore = totalScore / responses.length;

    // Collect all competencies
    const allCompetencies: any[] = [];
    responses.forEach((r) => {
      if (r.analysis?.competencies) {
        allCompetencies.push(...(r.analysis.competencies as any[]));
      }
    });

    // Generate summary
    const summaries = responses
      .map((r) => r.analysis?.summary)
      .filter(Boolean)
      .join('\n\n');

    // Upsert evaluation
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
}

