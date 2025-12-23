"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor(config) {
        this.config = config;
        const accountId = this.config.get('R2_ACCOUNT_ID');
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: accountId
                ? `https://${accountId}.r2.cloudflarestorage.com`
                : 'http://localhost:9000',
            credentials: {
                accessKeyId: this.config.get('R2_ACCESS_KEY_ID') || 'minioadmin',
                secretAccessKey: this.config.get('R2_SECRET_ACCESS_KEY') || 'minioadmin',
            },
        });
        this.bucketName = this.config.get('R2_BUCKET_NAME') || 'asyncview-videos';
        this.publicUrl = this.config.get('R2_PUBLIC_URL') || '';
    }
    async getPresignedUploadUrl(candidateId, questionId, fileType, contentType) {
        const extension = fileType === 'video' ? 'webm' : 'webm';
        const fileKey = `responses/${candidateId}/${questionId}/${(0, uuid_1.v4)()}.${extension}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            ContentType: contentType,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: 3600,
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
    async initiateMultipartUpload(candidateId, questionId, fileType) {
        const extension = fileType === 'video' ? 'webm' : 'webm';
        const fileKey = `responses/${candidateId}/${questionId}/${(0, uuid_1.v4)()}.${extension}`;
        return {
            uploadId: (0, uuid_1.v4)(),
            fileKey,
        };
    }
    async getPresignedDownloadUrl(fileKey) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: 3600,
        });
    }
    getPublicUrl(fileKey) {
        if (this.publicUrl) {
            return `${this.publicUrl}/${fileKey}`;
        }
        return `https://${this.bucketName}.r2.cloudflarestorage.com/${fileKey}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map