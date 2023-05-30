import { User } from '@shared';
import { Injectable } from '@nestjs/common';

type ExcludeFields = (keyof User)[];

const baseExcludeFields: ExcludeFields = [
  'uuid',
  'updatedAt',
  'createdAt',
  'password',
];

@Injectable()
export class UserMapper {
  public mapToResponse(user: User, exclude = baseExcludeFields): Partial<User> {
    const mappedUser = {};
    const userKeys = Object.keys(user) as (keyof User)[];

    for (let i = 0; i < userKeys.length; i++) {
      if (!exclude.includes(userKeys[i])) {
        switch (userKeys[i]) {
          case 'phoneNumber':
            mappedUser[userKeys[i]] = this._mapPhoneNumber(
              user[userKeys[i]] as string,
            );
            break;
          default:
            mappedUser[userKeys[i]] = user[userKeys[i]];
        }
      }
    }

    return mappedUser;
  }

  private _mapPhoneNumber(phoneNumber: string): string {
    const phoneRegex = /^(\+38)(\d{3})(\d{3})(\d{2})(\d{2})$/;

    return phoneRegex.test(phoneNumber)
      ? phoneNumber.replace(phoneRegex, '$1 ($2) $3-$4-$5')
      : phoneNumber;
  }
}
