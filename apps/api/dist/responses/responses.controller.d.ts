import { ResponsesService } from './responses.service';
export declare class ResponsesController {
    private responsesService;
    constructor(responsesService: ResponsesService);
    findByCandidate(candidateId: string): Promise<({
        question: {
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
        };
        transcription: {
            id: string;
            createdAt: Date;
            text: string;
            responseId: string;
            segments: import("@prisma/client/runtime/library").JsonValue;
            language: string | null;
            confidence: number | null;
            processingTime: number | null;
        } | null;
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
    })[]>;
    findById(id: string): Promise<{
        question: {
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
        };
        candidate: {
            interview: {
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
            };
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
        };
        transcription: {
            id: string;
            createdAt: Date;
            text: string;
            responseId: string;
            segments: import("@prisma/client/runtime/library").JsonValue;
            language: string | null;
            confidence: number | null;
            processingTime: number | null;
        } | null;
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
    }>;
}
