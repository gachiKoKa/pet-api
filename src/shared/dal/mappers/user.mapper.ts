import { User, UserResponseDto } from '@shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  public mapToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: this._mapPhoneNumber(user.phoneNumber),
    };
  }

  private _mapPhoneNumber(phoneNumber: string): string {
    const phoneRegex = /^(\+38)(\d{3})(\d{3})(\d{2})(\d{2})$/;

    return phoneRegex.test(phoneNumber)
      ? phoneNumber.replace(phoneRegex, '$1 ($2) $3-$4-$5')
      : phoneNumber;
  }
}
