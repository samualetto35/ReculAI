import { Module, forwardRef } from '@nestjs/common';
import { QueueService } from './queue.service';
import { TranscriptionProcessor } from './processors/transcription.processor';
import { AnalysisProcessor } from './processors/analysis.processor';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [forwardRef(() => AIModule)],
  providers: [QueueService, TranscriptionProcessor, AnalysisProcessor],
  exports: [QueueService],
})
export class QueueModule {}

