import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private config;
    private s3Client;
    private bucketName;
    private publicUrl;
    constructor(config: ConfigService);
    getPresignedUploadUrl(candidateId: string, questionId: string, fileType: 'video' | 'audio', contentType: string): Promise<{
        uploadUrl: string;
        fileKey: string;
        publicUrl: string;
    }>;
    initiateMultipartUpload(candidateId: string, questionId: string, fileType: 'video' | 'audio'): Promise<{
        uploadId: string;
        fileKey: string;
    }>;
    getPresignedDownloadUrl(fileKey: string): Promise<string>;
    getPublicUrl(fileKey: string): string;
}
