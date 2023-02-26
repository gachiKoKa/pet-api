import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public lastName?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsMobilePhone('uk-UA')
  @IsOptional()
  public phoneNumber?: string;
}
