import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InterviewsModule } from './interviews/interviews.module';
import { CandidatesModule } from './candidates/candidates.module';
import { ResponsesModule } from './responses/responses.module';
import { UploadModule } from './upload/upload.module';
import { QueueModule } from './queue/queue.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    InterviewsModule,
    CandidatesModule,
    ResponsesModule,
    UploadModule,
    QueueModule,
    AIModule,
  ],
})
export class AppModule {}

