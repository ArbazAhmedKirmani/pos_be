import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as cache } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfig } from 'src/config/app.config';
import { RedisClientOptions } from 'redis';

@Global()
@Module({
  imports: [
    cache.register<RedisClientOptions>({
      store: redisStore,
      host: AppConfig.REDIS.HOST,
      port: AppConfig.REDIS.PORT,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
