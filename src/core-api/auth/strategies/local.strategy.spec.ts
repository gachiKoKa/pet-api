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
      phoneNumber: '+38 (096) 123-12-12',
      firstName: 'test',
      lastName: 'case',
    } as User;
  });

  describe('validate', () => {
    it('should return a user', async () => {
      const username = 'test@test.com';
      const password = '123';

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);

      const actualResult = await localStrategy.validate(username, password);

      expect(actualResult).toEqual(user);
      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should throw an exception when username is incorrect', async () => {
      const username = undefined;
      const password = '123';

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const actualResult = localStrategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      await expect(actualResult).rejects.toThrowError(ForbiddenException);
    });

    it('should throw an exception when password is incorrect', async () => {
      const username = 'test@test.com';
      const password = undefined;

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const actualResult = localStrategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      await expect(actualResult).rejects.toThrowError(ForbiddenException);
    });
  });
});
