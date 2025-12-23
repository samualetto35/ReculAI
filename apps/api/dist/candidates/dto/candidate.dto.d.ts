export declare class InviteCandidateDto {
    email: string;
    name: string;
    phone?: string;
}
export declare enum CandidateStatus {
    INVITED = "INVITED",
    STARTED = "STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    EXPIRED = "EXPIRED",
    DISQUALIFIED = "DISQUALIFIED"
}
export declare class UpdateCandidateStatusDto {
    status: CandidateStatus;
}
export declare enum Decision {
    PENDING = "PENDING",
    SHORTLISTED = "SHORTLISTED",
    REJECTED = "REJECTED",
    HIRED = "HIRED"
}
export declare class UpdateEvaluationDto {
    decision?: Decision;
    humanScore?: number;
    humanNotes?: string;
}
