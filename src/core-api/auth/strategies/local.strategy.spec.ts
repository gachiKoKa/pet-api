import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { User } from '@shared';

import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: Partial<AuthService>;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
        LocalStrategy,
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<Partial<AuthService>>(AuthService);
  });

  beforeEach(() => {
    user = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: '+380961231212',
      firstName: 'test',
      lastName: 'case',
      password: '$2a$12$tTEUft9NjfKa/eHoiUeJr.n9VZ4VSW5fZIGkdFvRlPiyn/DYbLv.1',
    } as User;
  });

  describe('validate', () => {
    let username: string;
    let password: string;

    beforeEach(() => {
      username = 'test@test.com';
      password = '123';
    });

    it('should return a user', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);

      const actualResult = await localStrategy.validate(username, password);

      expect(actualResult).toEqual(user);
      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should throw an exception when username is incorrect', async () => {
      username = undefined;

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      const actualResult = localStrategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      await expect(actualResult).rejects.toThrowError(ForbiddenException);
    });

    it('should throw an exception when password is incorrect', async () => {
      password = undefined;

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      const actualResult = localStrategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      await expect(actualResult).rejects.toThrowError(ForbiddenException);
    });
  });
});
