import { Controller, Post, UseGuards } from '@nestjs/common';
import { RequestUser, User } from '@shared';

import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  @Post()
  @UseGuards(LocalGuard)
  public login(@RequestUser() user: User): Partial<User> {
    return user;
  }
}
