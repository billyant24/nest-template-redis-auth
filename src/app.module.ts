import * as redisStore from 'cache-manager-redis-store';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './configs/database/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { redisConfig } from './configs/configs.constants';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    CacheModule.register({
      store: redisStore,
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    }),
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
