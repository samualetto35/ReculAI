import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { PublicCandidateController } from './public-candidate.controller';

@Module({
  providers: [CandidatesService],
  controllers: [CandidatesController, PublicCandidateController],
  exports: [CandidatesService],
})
export class CandidatesModule {}

