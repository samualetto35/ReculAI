import { CandidatesService } from './candidates.service';
export declare class PublicCandidateController {
    private candidatesService;
    constructor(candidatesService: CandidatesService);
    getInterview(token: string): Promise<{
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
    startInterview(token: string, body: {
        deviceInfo?: any;
    }): Promise<{
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
    reportSuspiciousBehavior(token: string, body: {
        type: string;
        details?: any;
    }): Promise<{
        success: boolean;
    }>;
}
