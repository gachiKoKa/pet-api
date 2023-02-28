import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserMapper,
  UserRepository,
  UserResponseDto,
} from '@shared';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userMapper: UserMapper,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    let newEntity = this._userRepository.create(createUserDto);

    try {
      newEntity = await this._userRepository.save(newEntity);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(e.message);
    }

    return this._userMapper.mapToResponse(newEntity);
  }

  public async get(options: FindManyOptions<User>): Promise<UserResponseDto[]> {
    const users = await this._userRepository.find(options);

    return users.map((user) => this._userMapper.mapToResponse(user));
  }

  public async getOne(options: FindOneOptions<User>): Promise<UserResponseDto> {
    const user = await this._findOne(options);

    return this._userMapper.mapToResponse(user);
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
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

    return this._userMapper.mapToResponse(updatedEntity);
  }

  private async _findOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this._userRepository.findOne(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
