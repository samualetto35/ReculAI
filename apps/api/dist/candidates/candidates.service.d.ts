import { PrismaService } from '../prisma/prisma.service';
import { InviteCandidateDto, UpdateCandidateStatusDto } from './dto/candidate.dto';
export declare class CandidatesService {
    private prisma;
    constructor(prisma: PrismaService);
    invite(interviewId: string, dto: InviteCandidateDto, companyId: string): Promise<{
        interviewLink: string;
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
    }>;
    bulkInvite(interviewId: string, candidates: InviteCandidateDto[], companyId: string): Promise<({
        success: boolean;
        candidate: {
            interviewLink: string;
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
        email?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        email: string;
        error: any;
        candidate?: undefined;
    })[]>;
    findByInterview(interviewId: string, companyId: string): Promise<({
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
    })[]>;
    findById(id: string, companyId: string): Promise<{
        interview: {
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
        };
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
    }>;
    updateStatus(id: string, dto: UpdateCandidateStatusDto, companyId: string): Promise<{
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
    }>;
    updateEvaluation(candidateId: string, data: {
        decision?: string;
        humanScore?: number;
        humanNotes?: string;
    }, userId: string, companyId: string): Promise<{
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
    }>;
    findByAccessToken(token: string): Promise<{
        interview: {
            company: {
                name: string;
                id: string;
                logo: string | null;
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
        };
        responses: {
            id: string;
            status: import(".prisma/client").$Enums.ResponseStatus;
            questionId: string;
        }[];
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
    }>;
    startInterview(token: string, deviceInfo?: any): Promise<{
        interview: {
            company: {
                name: string;
                id: string;
                logo: string | null;
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
        };
        responses: {
            id: string;
            status: import(".prisma/client").$Enums.ResponseStatus;
            questionId: string;
        }[];
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
    }>;
    completeInterview(token: string): Promise<{
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
    }>;
    reportSuspiciousBehavior(token: string, behavior: any): Promise<void>;
}
