import { Inject, Injectable } from '@nestjs/common';
import { REDIS_PROVIDER, RegisterUserDto, User } from '@shared';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly _authKeyPrefix = 'auth';

  constructor(
    private readonly _userService: UserService,
    @Inject(REDIS_PROVIDER) private readonly _redisClient: Redis,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this._userService.getOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }

  public async prepareToken(user: User): Promise<string> {
    const hash = await bcrypt.hash(user.uuid, 12);

    await this._redisClient.set(
      `${this._authKeyPrefix}-${hash}`,
      JSON.stringify(user),
      'EX',
      86400,
    );

    return hash;
  }

  public async findUserByToken(token: string): Promise<Partial<User> | null> {
    const user = await this._redisClient.get(`${this._authKeyPrefix}-${token}`);

    return JSON.parse(user) as Partial<User>;
  }

  public async removeUserByToken(token: string): Promise<void> {
    await this._redisClient.del(`${this._authKeyPrefix}-${token}`);
  }

  public async registerUser(registerUserDto: RegisterUserDto): Promise<{
    user: User;
    token: string;
  }> {
    const user = await this._userService.create(registerUserDto);

    return {
      token: await this.prepareToken(user),
      user,
    };
  }
}
