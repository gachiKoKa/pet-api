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
  UserResponseDto,
} from '@shared';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  public get(@Query() getUsersDto: GetUsersDto): Promise<UserResponseDto[]> {
    return this._userService.get(getUsersDto);
  }

  @Get(':id')
  public getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this._userService.getOne(id);
  }

  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this._userService.create(createUserDto);
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this._userService.update(id, updateUserDto);
  }
}
