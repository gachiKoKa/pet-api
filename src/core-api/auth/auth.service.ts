import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '@shared';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly _userService: UserService) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this._userService.getOne({ where: { email } });

    if (!user || (await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }
}
