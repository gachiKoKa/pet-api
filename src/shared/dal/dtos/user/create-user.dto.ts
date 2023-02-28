import { IsEmail, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsMobilePhone('uk-UA')
  public phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
