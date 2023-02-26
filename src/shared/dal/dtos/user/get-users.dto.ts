import { IsNumber, IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsNumber()
  @IsOptional()
  public limit?: number;

  @IsNumber()
  @IsOptional()
  public offset?: number;
}
