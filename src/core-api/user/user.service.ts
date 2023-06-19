import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRepository } from '@shared';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async create(entityLike: DeepPartial<User>): Promise<User> {
    const newEntity = this._userRepository.create(entityLike);

    return this._userRepository.save(newEntity);
  }

  public async get(options: FindManyOptions<User>): Promise<User[]> {
    return this._userRepository.find(options);
  }

  public async update(
    id: number,
    entityLike: DeepPartial<User>,
  ): Promise<User> {
    const user = await this.getOne({ where: { id } });
    const updatedEntity = this._userRepository.create({
      ...user,
      ...entityLike,
    });

    return this._userRepository.save(updatedEntity);
  }

  public async getOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this._userRepository.findOne(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
