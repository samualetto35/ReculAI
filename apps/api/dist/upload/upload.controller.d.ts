import { UploadService } from './upload.service';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    getPresignedUrl(body: {
        candidateId: string;
        questionId: string;
        fileType: 'video' | 'audio';
        contentType: string;
    }): Promise<{
        uploadUrl: string;
        fileKey: string;
        publicUrl: string;
    }>;
    getDownloadUrl(fileKey: string): Promise<{
        url: string;
    }>;
}
