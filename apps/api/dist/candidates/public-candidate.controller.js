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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCandidateController = void 0;
const common_1 = require("@nestjs/common");
const candidates_service_1 = require("./candidates.service");
let PublicCandidateController = class PublicCandidateController {
    constructor(candidatesService) {
        this.candidatesService = candidatesService;
    }
    async getInterview(token) {
        return this.candidatesService.findByAccessToken(token);
    }
    async startInterview(token, body) {
        return this.candidatesService.startInterview(token, body.deviceInfo);
    }
    async completeInterview(token) {
        return this.candidatesService.completeInterview(token);
    }
    async reportSuspiciousBehavior(token, body) {
        await this.candidatesService.reportSuspiciousBehavior(token, body);
        return { success: true };
    }
};
exports.PublicCandidateController = PublicCandidateController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCandidateController.prototype, "getInterview", null);
__decorate([
    (0, common_1.Post)(':token/start'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicCandidateController.prototype, "startInterview", null);
__decorate([
    (0, common_1.Post)(':token/complete'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCandidateController.prototype, "completeInterview", null);
__decorate([
    (0, common_1.Post)(':token/suspicious-behavior'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicCandidateController.prototype, "reportSuspiciousBehavior", null);
exports.PublicCandidateController = PublicCandidateController = __decorate([
    (0, common_1.Controller)('public/interview'),
    __metadata("design:paramtypes", [candidates_service_1.CandidatesService])
], PublicCandidateController);
//# sourceMappingURL=public-candidate.controller.js.map