import { ConfigService } from '@nestjs/config';
interface TranscriptionResult {
    text: string;
    segments: Array<{
        start: number;
        end: number;
        text: string;
    }>;
    language?: string;
    confidence?: number;
}
interface AnalysisInput {
    question: string;
    transcript: string;
    segments: Array<{
        start: number;
        end: number;
        text: string;
    }>;
    rubric?: any;
}
interface AnalysisResult {
    overallScore: number;
    competencies: Array<{
        name: string;
        score: number;
        maxScore: number;
        evidence: string;
        timestamp?: number;
    }>;
    highlights: Array<{
        type: 'positive' | 'negative' | 'notable';
        text: string;
        timestamp: number;
        reason: string;
    }>;
    redFlags?: Array<{
        type: string;
        description: string;
        severity: 'low' | 'medium' | 'high';
    }>;
    summary: string;
    starAnalysis?: {
        situation?: string;
        task?: string;
        action?: string;
        result?: string;
        score: number;
    };
    rawResponse?: any;
}
export declare class AIService {
    private config;
    private openai;
    constructor(config: ConfigService);
    transcribe(audioUrl: string): Promise<TranscriptionResult>;
    analyzeResponse(input: AnalysisInput): Promise<AnalysisResult>;
    private buildSystemPrompt;
    private buildUserPrompt;
    private formatTime;
    private calculateAverageConfidence;
    private mapHighlightsToTimestamps;
}
export {};
