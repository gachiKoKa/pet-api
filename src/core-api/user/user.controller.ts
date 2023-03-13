import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateUserDto,
  GetUsersDto,
  UpdateUserDto,
  User,
  UserMapper,
} from '@shared';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _userMapper: UserMapper,
  ) {}

  @Get()
  public get(@Query() getUsersDto: GetUsersDto): Promise<Partial<User>[]> {
    return this._userService.get({
      skip: getUsersDto?.offset ?? 0,
      take: (getUsersDto?.limit > 0 && getUsersDto?.limit) || 20,
    });
  }

  @Get(':id')
  public getOne(@Param('id', ParseIntPipe) id: number): Promise<Partial<User>> {
    return this._userService.getOne({ where: { id } });
  }

  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    return this._userMapper.mapToResponse(
      await this._userService.create(createUserDto),
    );
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    return this._userMapper.mapToResponse(
      await this._userService.update(id, updateUserDto),
    );
  }
}
