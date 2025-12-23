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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
let QueueService = class QueueService {
    constructor(config) {
        this.config = config;
        this.transcriptionWorker = null;
        this.analysisWorker = null;
        const redisUrl = this.config.get('REDIS_URL') || 'redis://localhost:6379';
        this.connection = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: null,
        });
        this.transcriptionQueue = new bullmq_1.Queue('transcription', {
            connection: this.connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
                removeOnComplete: 100,
                removeOnFail: 50,
            },
        });
        this.analysisQueue = new bullmq_1.Queue('analysis', {
            connection: this.connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
                removeOnComplete: 100,
                removeOnFail: 50,
            },
        });
    }
    async onModuleInit() {
        console.log('🔄 Queue service initialized');
    }
    async onModuleDestroy() {
        await this.transcriptionQueue.close();
        await this.analysisQueue.close();
        if (this.transcriptionWorker)
            await this.transcriptionWorker.close();
        if (this.analysisWorker)
            await this.analysisWorker.close();
        await this.connection.quit();
    }
    async addTranscriptionJob(responseId) {
        console.log(`📝 Adding transcription job for response: ${responseId}`);
        return this.transcriptionQueue.add('transcribe', { responseId }, {
            priority: 1,
        });
    }
    async addAnalysisJob(responseId) {
        console.log(`🤖 Adding analysis job for response: ${responseId}`);
        return this.analysisQueue.add('analyze', { responseId }, {
            priority: 1,
        });
    }
    getTranscriptionQueue() {
        return this.transcriptionQueue;
    }
    getAnalysisQueue() {
        return this.analysisQueue;
    }
    getConnection() {
        return this.connection;
    }
    async getStats() {
        const [transcriptionCounts, analysisCounts] = await Promise.all([
            this.transcriptionQueue.getJobCounts(),
            this.analysisQueue.getJobCounts(),
        ]);
        return {
            transcription: transcriptionCounts,
            analysis: analysisCounts,
        };
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QueueService);
//# sourceMappingURL=queue.service.js.map