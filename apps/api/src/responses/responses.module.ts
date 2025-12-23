import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { PublicResponseController } from './public-response.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [ResponsesService],
  controllers: [ResponsesController, PublicResponseController],
  exports: [ResponsesService],
})
export class ResponsesModule {}

