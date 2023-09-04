import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/utils/strategy';
import { QueueService } from '../queue/queue.service';
import { QueueModule } from '../queue/queue.module';
import { I18nTranslate } from 'src/helpers';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, I18nTranslate],
})
export class AuthModule {}
