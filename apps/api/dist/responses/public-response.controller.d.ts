import { ResponsesService } from './responses.service';
export declare class PublicResponseController {
    private responsesService;
    constructor(responsesService: ResponsesService);
    submitResponse(token: string, questionId: string, body: {
        videoUrl?: string;
        audioUrl?: string;
        duration?: number;
        fileSize?: number;
    }): Promise<{
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
