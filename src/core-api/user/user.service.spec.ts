import { Test } from '@nestjs/testing';
import { GetUsersDto, User, UserMapper, UserRepository } from '@shared';
import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  TypeORMError,
} from 'typeorm';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let userRepositoryOutput: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
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
    userRepositoryOutput = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: '+380961231212',
      firstName: 'test',
      lastName: 'case',
    } as User;
  });

  describe('create', () => {
    let entityLike: DeepPartial<User>;

    beforeEach(() => {
      entityLike = {
        firstName: 'test',
        lastName: 'case',
        email: 'test@test.com',
        phoneNumber: '+380961231212',
        password: 'test',
      };

      jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(userRepositoryOutput);
    });

    it('should create a new user', async () => {
      jest

        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(userRepositoryOutput);

      const actualResult = await userService.create(entityLike);

      expect(userRepository.create).toHaveBeenCalledWith(entityLike);
      expect(userRepository.save).toHaveBeenCalledWith(userRepositoryOutput);
      expect(actualResult).toEqual(userRepositoryOutput);
    });

    it('should throw exception during save user operation', async () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce(new TypeORMError());

      const actualResult = userService.create(entityLike);

      await expect(actualResult).rejects.toThrowError(TypeORMError);
    });
  });

  describe('update', () => {
    let userId: number;
    let partEntityToUpdate: DeepPartial<User>;
    let findOneOptions: FindOneOptions<User>;
    let updatedEntity: User;

    beforeEach(() => {
      userId = 1;
      partEntityToUpdate = { lastName: 'jest' };
      findOneOptions = { where: { id: userId } };
      updatedEntity = {
        ...userRepositoryOutput,
        ...partEntityToUpdate,
      } as User;

      jest.spyOn(userRepository, 'create').mockReturnValue(updatedEntity);
    });

    it('should update the user', async () => {
      jest
        .spyOn(userService, 'getOne')
        .mockResolvedValueOnce(userRepositoryOutput);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedEntity);

      const actualResult = await userService.update(userId, partEntityToUpdate);

      expect(userService.getOne).toHaveBeenCalledWith(findOneOptions);
      expect(userRepository.create).toHaveBeenCalledWith(updatedEntity);
      expect(userRepository.save).toHaveBeenCalledWith(updatedEntity);
      expect(actualResult).toEqual(updatedEntity);
    });

    it('should throw exception when user not found', async () => {
      jest
        .spyOn(userService, 'getOne')
        .mockRejectedValueOnce(new NotFoundException());

      const actualResult = userService.update(userId, partEntityToUpdate);

      expect(userService.getOne).toHaveBeenCalledWith(findOneOptions);
      await expect(actualResult).rejects.toThrowError(NotFoundException);
    });

    it('should throw an exception during update user operation', async () => {
      jest
        .spyOn(userService, 'getOne')
        .mockResolvedValueOnce(userRepositoryOutput);
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce(new TypeORMError());

      const actualResult = userService.update(userId, partEntityToUpdate);

      expect(userService.getOne).toHaveBeenCalledWith(findOneOptions);
      expect(userRepository.create).toHaveBeenCalledWith(updatedEntity);
      expect(userRepository.save).toHaveBeenCalledWith(updatedEntity);
      await expect(actualResult).rejects.toThrowError(TypeORMError);
    });
  });

  describe('get', () => {
    it('should be called with correct parameters', async () => {
      const getUsersDto = { limit: 50 } as Partial<GetUsersDto>;
      const options: FindManyOptions<User> = {
        skip: 0,
        take: getUsersDto.limit,
      };

      jest
        .spyOn(userRepository, 'find')
        .mockResolvedValueOnce([userRepositoryOutput]);

      await userService.get(options);

      expect(userRepository.find).toHaveBeenCalledWith(options);
    });
  });

  describe('getOne', () => {
    let findOneOptions: FindOneOptions<User>;

    beforeEach(() => {
      findOneOptions = { where: { id: 1 } };
    });

    it('should return the user', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userRepositoryOutput);

      const actualResult = await userService.getOne(findOneOptions);

      expect(userRepository.findOne).toHaveBeenCalledWith(findOneOptions);
      expect(actualResult).toEqual(userRepositoryOutput);
    });

    it('should throw exception when user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValueOnce(new TypeORMError());

      const actualResult = userService.getOne(findOneOptions);

      expect(userRepository.findOne).toHaveBeenCalledWith(findOneOptions);
      await expect(actualResult).rejects.toThrowError(TypeORMError);
    });
  });
});
