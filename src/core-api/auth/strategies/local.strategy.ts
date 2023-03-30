import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserResponseDto } from '@shared';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(
    username: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this._authService.validateUser(username, password);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
