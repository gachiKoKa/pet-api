import { Module } from '@nestjs/common';
import { REDIS_PROVIDER, UserMapper, UserRepository } from '@shared';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { AuthController } from './auth/auth.controller';
import { CookieStrategy } from './auth/strategies/cookie.strategy';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    UserRepository,
    UserMapper,
    AuthService,
    LocalStrategy,
    CookieStrategy,
    {
      provide: REDIS_PROVIDER,
      useFactory: (configService: ConfigService): Redis =>
        new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT')),
          username: configService.get<string>('REDIS_USER'),
          password: configService.get<string>('REDIS_PASSWORD'),
        }),
      inject: [ConfigService],
    },
  ],
})
export class CoreApiModule {}
