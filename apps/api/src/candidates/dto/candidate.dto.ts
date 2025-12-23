import { IsEmail, IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class InviteCandidateDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export enum CandidateStatus {
  INVITED = 'INVITED',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  DISQUALIFIED = 'DISQUALIFIED',
}

export class UpdateCandidateStatusDto {
  @IsEnum(CandidateStatus)
  status: CandidateStatus;
}

export enum Decision {
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
}

export class UpdateEvaluationDto {
  @IsOptional()
  @IsEnum(Decision)
  decision?: Decision;

  @IsOptional()
  @IsNumber()
  humanScore?: number;

  @IsOptional()
  @IsString()
  humanNotes?: string;
}

