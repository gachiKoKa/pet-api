import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { User } from '@shared';

import { AuthService } from '../auth.service';
import { CookieStrategy } from './cookie.strategy';

describe('CookieStrategy', () => {
  let cookieStrategy: CookieStrategy;
  let authService: Partial<AuthService>;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            findUserByToken: jest.fn(),
          },
        },
        CookieStrategy,
      ],
    }).compile();

    cookieStrategy = moduleRef.get<CookieStrategy>(CookieStrategy);
    authService = moduleRef.get<Partial<AuthService>>(AuthService);
  });

  beforeEach(() => {
    user = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: '+38 (096) 123-12-12',
      firstName: 'test',
      lastName: 'case',
    } as User;
  });

  describe('validate', () => {
    it('should return a user', async () => {
      const payload =
        '$2a$12$tTEUft9NjfKa/eHoiUeJr.n9VZ4VSW5fZIGkdFvRlPiyn/DYbLv.q';

      jest.spyOn(authService, 'findUserByToken').mockResolvedValueOnce(user);

      const actualResult = await cookieStrategy.validate(payload);

      expect(actualResult).toEqual(user);
      expect(authService.findUserByToken).toHaveBeenCalledWith(payload);
    });

    it('should throw an exception when payload is incorrect', async () => {
      const payload = undefined;

      jest
        .spyOn(authService, 'findUserByToken')
        .mockResolvedValueOnce(undefined);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const actualResult = cookieStrategy.validate(payload);

      expect(authService.findUserByToken).toHaveBeenCalledWith(payload);
      await expect(actualResult).rejects.toThrowError(ForbiddenException);
    });
  });
});
