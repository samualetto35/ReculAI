import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private config: ConfigService) {
    // Configure for Cloudflare R2 (S3-compatible)
    const accountId = this.config.get('R2_ACCOUNT_ID');
    
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: accountId 
        ? `https://${accountId}.r2.cloudflarestorage.com`
        : 'http://localhost:9000', // MinIO for local dev
      credentials: {
        accessKeyId: this.config.get('R2_ACCESS_KEY_ID') || 'minioadmin',
        secretAccessKey: this.config.get('R2_SECRET_ACCESS_KEY') || 'minioadmin',
      },
    });

    this.bucketName = this.config.get('R2_BUCKET_NAME') || 'asyncview-videos';
    this.publicUrl = this.config.get('R2_PUBLIC_URL') || '';
  }

  // Generate presigned URL for direct upload from browser
  async getPresignedUploadUrl(
    candidateId: string,
    questionId: string,
    fileType: 'video' | 'audio',
    contentType: string,
  ): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
    const extension = fileType === 'video' ? 'webm' : 'webm';
    const fileKey = `responses/${candidateId}/${questionId}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    const publicUrl = this.publicUrl 
      ? `${this.publicUrl}/${fileKey}`
      : `https://${this.bucketName}.r2.cloudflarestorage.com/${fileKey}`;

    return {
      uploadUrl,
      fileKey,
      publicUrl,
    };
  }

  // Generate presigned URL for chunked upload (multipart)
  async initiateMultipartUpload(
    candidateId: string,
    questionId: string,
    fileType: 'video' | 'audio',
  ): Promise<{ uploadId: string; fileKey: string }> {
    const extension = fileType === 'video' ? 'webm' : 'webm';
    const fileKey = `responses/${candidateId}/${questionId}/${uuidv4()}.${extension}`;

    // For simplicity, we'll use single presigned URLs
    // In production, implement proper multipart upload
    return {
      uploadId: uuidv4(),
      fileKey,
    };
  }

  // Generate presigned URL for reading/downloading
  async getPresignedDownloadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });
  }

  // Get public URL for a file
  getPublicUrl(fileKey: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${fileKey}`;
    }
    return `https://${this.bucketName}.r2.cloudflarestorage.com/${fileKey}`;
  }
}

