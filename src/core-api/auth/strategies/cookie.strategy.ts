import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-cookie';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@shared';

import { AuthService } from '../auth.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly _authService: AuthService) {
    super({
      cookieName: 'authorization',
    });
  }

  public async validate(payload: string): Promise<Partial<User>> {
    const user = await this._authService.findUserByToken(payload);

    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }
}
