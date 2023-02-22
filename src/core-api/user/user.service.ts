import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  GetUsersDto,
  UpdateUserDto,
  UserMapper,
  UserRepository,
  UserResponseDto,
} from '@shared';

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

  public async get(getUsersDto: GetUsersDto): Promise<UserResponseDto[]> {
    const users = await this._userRepository.find({
      skip: getUsersDto?.offset ?? 0,
      take: (getUsersDto?.limit > 0 && getUsersDto?.limit) || 20,
    });

    return users.map((user) => this._userMapper.mapToResponse(user));
  }

  public async getOne(id: number): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    return this._userMapper.mapToResponse(user);
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.getOne(id);
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
}
