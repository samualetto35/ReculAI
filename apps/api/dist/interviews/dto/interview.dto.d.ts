export declare class CreateQuestionDto {
    text: string;
    thinkingTime?: number;
    answerTime?: number;
    retakes?: number;
    isRequired?: boolean;
}
export declare class CreateInterviewDto {
    title: string;
    description?: string;
    expiresAt?: string;
    settings?: Record<string, any>;
    questions?: CreateQuestionDto[];
}
export declare enum InterviewStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED"
}
export declare class UpdateInterviewDto {
    title?: string;
    description?: string;
    status?: InterviewStatus;
    expiresAt?: string;
    settings?: Record<string, any>;
}
