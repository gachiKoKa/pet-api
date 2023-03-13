import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User, UserRepository } from '@shared';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    let newEntity = this._userRepository.create(createUserDto);

    try {
      newEntity = await this._userRepository.save(newEntity);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(e.message);
    }

    return newEntity;
  }

  public async get(options: FindManyOptions<User>): Promise<User[]> {
    return this._userRepository.find(options);
  }

  public async getOne(options: FindOneOptions<User>): Promise<User> {
    return this._findOne(options);
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this._findOne({ where: { id } });
    let updatedEntity = this._userRepository.create({
      ...user,
      ...updateUserDto,
    });

    try {
      updatedEntity = await this._userRepository.save(updatedEntity);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(e.message);
    }

    return updatedEntity;
  }

  private async _findOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this._userRepository.findOne(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
