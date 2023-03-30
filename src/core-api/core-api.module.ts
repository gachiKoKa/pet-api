import { Module } from '@nestjs/common';
import { UserMapper, UserRepository } from '@shared';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { AuthController } from './auth/auth.controller';

@Module({
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    UserRepository,
    UserMapper,
    AuthService,
    LocalStrategy,
  ],
})
export class CoreApiModule {}
