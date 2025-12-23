import { InterviewsService } from './interviews.service';
import { CreateInterviewDto, UpdateInterviewDto, CreateQuestionDto } from './dto/interview.dto';
export declare class InterviewsController {
    private interviewsService;
    constructor(interviewsService: InterviewsService);
    create(dto: CreateInterviewDto, user: any): Promise<{
        _count: {
            candidates: number;
        };
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            thinkingTime: number;
            answerTime: number;
            retakes: number;
            isRequired: boolean;
            order: number;
            interviewId: string;
        }[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        description: string | null;
        expiresAt: Date | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        createdById: string;
        rubricId: string | null;
    }>;
    findAll(user: any): Promise<({
        _count: {
            questions: number;
            candidates: number;
        };
        createdBy: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        description: string | null;
        expiresAt: Date | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        createdById: string;
        rubricId: string | null;
    })[]>;
    getStatistics(user: any): Promise<{
        totalInterviews: number;
        activeInterviews: number;
        totalCandidates: number;
        completedCandidates: number;
        completionRate: number;
    }>;
    findById(id: string, user: any): Promise<{
        rubric: {
            name: string;
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            competencies: import("@prisma/client/runtime/library").JsonValue;
            isDefault: boolean;
        } | null;
        _count: {
            candidates: number;
        };
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            thinkingTime: number;
            answerTime: number;
            retakes: number;
            isRequired: boolean;
            order: number;
            interviewId: string;
        }[];
        createdBy: {
            email: string;
            name: string;
            id: string;
        };
        candidates: ({
            evaluation: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                candidateId: string;
                decision: import(".prisma/client").$Enums.Decision | null;
                humanScore: number | null;
                humanNotes: string | null;
                evaluatorId: string | null;
                aiScore: number;
                aiNotes: string | null;
                decidedAt: Date | null;
            } | null;
            responses: ({
                analysis: {
                    id: string;
                    createdAt: Date;
                    responseId: string;
                    processingTime: number | null;
                    overallScore: number;
                    competencies: import("@prisma/client/runtime/library").JsonValue;
                    highlights: import("@prisma/client/runtime/library").JsonValue;
                    redFlags: import("@prisma/client/runtime/library").JsonValue | null;
                    summary: string;
                    starAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
                    rawLLMResponse: import("@prisma/client/runtime/library").JsonValue | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ResponseStatus;
                videoUrl: string | null;
                audioUrl: string | null;
                duration: number | null;
                fileSize: number | null;
                retakeNumber: number;
                candidateId: string;
                questionId: string;
            })[];
        } & {
            email: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CandidateStatus;
            interviewId: string;
            phone: string | null;
            resumeUrl: string | null;
            accessToken: string;
            invitedAt: Date;
            startedAt: Date | null;
            completedAt: Date | null;
            deviceInfo: import("@prisma/client/runtime/library").JsonValue | null;
            suspiciousBehavior: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        description: string | null;
        expiresAt: Date | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        createdById: string;
        rubricId: string | null;
    }>;
    update(id: string, dto: UpdateInterviewDto, user: any): Promise<{
        questions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            thinkingTime: number;
            answerTime: number;
            retakes: number;
            isRequired: boolean;
            order: number;
            interviewId: string;
        }[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        description: string | null;
        expiresAt: Date | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        createdById: string;
        rubricId: string | null;
    }>;
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
    addQuestion(id: string, dto: CreateQuestionDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        thinkingTime: number;
        answerTime: number;
        retakes: number;
        isRequired: boolean;
        order: number;
        interviewId: string;
    }>;
    updateQuestion(questionId: string, dto: CreateQuestionDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        thinkingTime: number;
        answerTime: number;
        retakes: number;
        isRequired: boolean;
        order: number;
        interviewId: string;
    }>;
    deleteQuestion(questionId: string, user: any): Promise<{
        message: string;
    }>;
}
