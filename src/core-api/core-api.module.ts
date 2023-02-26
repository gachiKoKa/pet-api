import { Module } from '@nestjs/common';
import { UserMapper, UserRepository } from '@shared';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserMapper],
})
export class CoreApiModule {}
