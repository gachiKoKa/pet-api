import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CookieGuard, RegisterUserDto, RequestUser, User } from '@shared';

import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}
  @Post('login')
  @UseGuards(LocalGuard)
  public async login(
    @RequestUser() user: User,
    @Res() response: Response,
  ): Promise<void> {
    const token = await this._authService.prepareToken(user);

    response.cookie('authorization', token);
    response.send(user);
  }

  @Post('register')
  public async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() response: Response,
  ): Promise<void> {
    const { user, token } = await this._authService.registerUser(
      registerUserDto,
    );

    response.cookie('authorization', token);
    response.send(user);
  }

  @Get('logout')
  @UseGuards(CookieGuard)
  public async logout(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const cookieKey = 'authorization';

    await this._authService.removeUserByToken(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.cookies?.[cookieKey] as string,
    );

    response.clearCookie(cookieKey);
    response.status(200).end();
  }
}
