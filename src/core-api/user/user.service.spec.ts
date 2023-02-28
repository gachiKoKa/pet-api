import { Test } from '@nestjs/testing';
import { GetUsersDto, User, UserMapper, UserRepository } from '@shared';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let user: User;
  let userRepoFindException: boolean;
  let userRepoSaveException: boolean;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: {
            find: jest.fn(
              async (
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                options?: FindManyOptions<User>,
                // eslint-disable-next-line @typescript-eslint/require-await
              ): Promise<User[]> => [],
            ),
            findOne: jest.fn(
              async (
                // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/require-await
                options: FindOneOptions<User>,
                // eslint-disable-next-line @typescript-eslint/require-await
              ): Promise<User> => {
                if (userRepoFindException) {
                  throw new NotFoundException();
                }

                return user;
              },
            ),
            save: jest.fn(
              async (
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                entity: User,
                // eslint-disable-next-line @typescript-eslint/require-await
              ): Promise<User> => {
                if (userRepoSaveException) {
                  throw new BadRequestException();
                }

                return user;
              },
            ),
            create: jest.fn(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (entityLike: DeepPartial<User>): User => user,
            ),
          },
        },
        UserService,
        UserMapper,
      ],
    }).compile();

    userService = moduleRef.get(UserService);
    userRepository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    userRepoSaveException = false;
    userRepoFindException = false;
    user = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: '+38 (096) 123-12-12',
      firstName: 'test',
      lastName: 'case',
    } as User;
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const actualResult = await userService.create({
        firstName: 'test',
        lastName: 'case',
        email: 'test@test.com',
        phoneNumber: '+380961231212',
        password: 'test',
      });

      expect(actualResult).toEqual(user);
    });

    it('should throw exception during save user operation', async () => {
      userRepoSaveException = true;
      const actualResult = userService.create({
        firstName: 'test',
        lastName: 'case',
        email: 'test@test.com',
        phoneNumber: '+380961231212',
        password: 'test',
      });

      await expect(actualResult).rejects.toThrowError(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update the user', async () => {
      const actualResult = await userService.update(1, {
        lastName: 'jest',
      });

      expect(actualResult).toEqual(user);
    });

    it('should throw exception when user not found', async () => {
      userRepoFindException = true;
      const actualResult = userService.update(1, { lastName: 'jest' });

      await expect(actualResult).rejects.toThrowError(NotFoundException);
    });

    it('should throw exception during update user operation', async () => {
      userRepoSaveException = true;
      const actualResult = userService.update(1, { lastName: 'jest' });

      await expect(actualResult).rejects.toThrowError(BadRequestException);
    });
  });

  describe('get', () => {
    it('should be called with correct parameters', async () => {
      const filter = { limit: 50 } as Partial<GetUsersDto>;

      await userService.get(filter);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.find).toBeCalledWith({
        skip: 0,
        take: filter.limit,
      });
    });
  });

  describe('getOne', () => {
    it('should return the user', async () => {
      const actualResult = await userService.getOne(1);

      expect(actualResult).toEqual(user);
    });

    it('should throw exception when user not found', async () => {
      userRepoFindException = true;
      const actualResult = userService.getOne(1);

      await expect(actualResult).rejects.toThrowError(NotFoundException);
    });
  });
});
