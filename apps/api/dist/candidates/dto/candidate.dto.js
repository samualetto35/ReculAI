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
exports.UpdateEvaluationDto = exports.Decision = exports.UpdateCandidateStatusDto = exports.CandidateStatus = exports.InviteCandidateDto = void 0;
const class_validator_1 = require("class-validator");
class InviteCandidateDto {
}
exports.InviteCandidateDto = InviteCandidateDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteCandidateDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteCandidateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteCandidateDto.prototype, "phone", void 0);
var CandidateStatus;
(function (CandidateStatus) {
    CandidateStatus["INVITED"] = "INVITED";
    CandidateStatus["STARTED"] = "STARTED";
    CandidateStatus["IN_PROGRESS"] = "IN_PROGRESS";
    CandidateStatus["COMPLETED"] = "COMPLETED";
    CandidateStatus["EXPIRED"] = "EXPIRED";
    CandidateStatus["DISQUALIFIED"] = "DISQUALIFIED";
})(CandidateStatus || (exports.CandidateStatus = CandidateStatus = {}));
class UpdateCandidateStatusDto {
}
exports.UpdateCandidateStatusDto = UpdateCandidateStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(CandidateStatus),
    __metadata("design:type", String)
], UpdateCandidateStatusDto.prototype, "status", void 0);
var Decision;
(function (Decision) {
    Decision["PENDING"] = "PENDING";
    Decision["SHORTLISTED"] = "SHORTLISTED";
    Decision["REJECTED"] = "REJECTED";
    Decision["HIRED"] = "HIRED";
})(Decision || (exports.Decision = Decision = {}));
class UpdateEvaluationDto {
}
exports.UpdateEvaluationDto = UpdateEvaluationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Decision),
    __metadata("design:type", String)
], UpdateEvaluationDto.prototype, "decision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateEvaluationDto.prototype, "humanScore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEvaluationDto.prototype, "humanNotes", void 0);
//# sourceMappingURL=candidate.dto.js.map