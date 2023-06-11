import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { REDIS_PROVIDER, RegisterUserDto, User } from '@shared';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let userService: UserService;
  let authService: AuthService;
  let redisClient: Redis;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: REDIS_PROVIDER,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    authService = moduleRef.get<AuthService>(AuthService);
    redisClient = moduleRef.get<Redis>(REDIS_PROVIDER);
  });

  beforeEach(() => {
    user = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: '+38 (096) 123-12-12',
      firstName: 'test',
      lastName: 'case',
      password: '$2a$12$tTEUft9NjfKa/eHoiUeJr.n9VZ4VSW5fZIGkdFvRlPiyn/DYbLv.q',
    } as User;
  });

  describe('validateUser', () => {
    it('should return the user if email and password are correct', async () => {
      const email = 'test@test.com';
      const password = '123';

      jest.spyOn(userService, 'getOne').mockResolvedValueOnce(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(true);

      const actualResult = await authService.validateUser(email, password);

      expect(userService.getOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(actualResult).toBe(user);
    });

    it('should return null if passwords do not match', async () => {
      const email = 'test@test.com';
      const password = '134';

      jest.spyOn(userService, 'getOne').mockResolvedValueOnce(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const actualResult = await authService.validateUser(email, password);

      expect(userService.getOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(actualResult).toBeNull();
    });

    it('should return null if user not found', async () => {
      const email = 't@t.com';
      const password = '134';

      jest.spyOn(userService, 'getOne').mockResolvedValueOnce(undefined);

      const actualResult = await authService.validateUser(email, password);

      expect(actualResult).toBeNull();
      expect(userService.getOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('registerUser', () => {
    it('should return a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        firstName: 'test',
        lastName: 'case',
        phoneNumber: '+380911231212',
        password: '123',
        email: 'test@test.com',
      };
      const expectedResult = { token: 'hashedPassword', user };

      jest.spyOn(userService, 'create').mockResolvedValueOnce(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
      jest.spyOn(redisClient, 'set').mockResolvedValueOnce('token');

      const actualResult = await authService.registerUser(registerUserDto);

      expect(actualResult).toStrictEqual(expectedResult);
      expect(userService.create).toHaveBeenCalledWith(registerUserDto);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(redisClient.set).toHaveBeenCalled();
    });

    it('should throw an error during register user', async () => {
      const registerUserDto: RegisterUserDto = {
        firstName: 'test',
        lastName: 'case',
        phoneNumber: '+380911231212',
        password: '123',
        email: 'test@test.com',
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new BadRequestException());

      const actualResult = authService.registerUser(registerUserDto);

      await expect(actualResult).rejects.toThrowError(BadRequestException);
      expect(userService.create).toHaveBeenCalledWith(registerUserDto);
    });
  });
});
