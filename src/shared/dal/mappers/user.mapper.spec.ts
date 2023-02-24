import { User, UserMapper } from '@shared';
import { Test } from '@nestjs/testing';

describe('UserMapper', () => {
  let userMapper: UserMapper;
  let user: User;
  const transformedPhoneNumber = '+38 (096) 123-12-12';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserMapper],
    }).compile();

    userMapper = moduleRef.get<UserMapper>(UserMapper);
  });

  beforeEach(() => {
    user = {
      id: 1,
      uuid: '6a35c97a-6148-4818-b606-8bc804d42816',
      email: 'test@test.com',
      phoneNumber: '+380961231212',
      firstName: 'test',
      lastName: 'case',
      createdAt: new Date('2023-01-20 12:00:00'),
      updatedAt: new Date('2023-01-20 12:00:00'),
    } as User;
  });

  describe('mapToResponse', () => {
    it('should map user entity to response', () => {
      // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
      const { uuid, createdAt, updatedAt, ...userData } = user;
      userData.phoneNumber = transformedPhoneNumber;

      expect(userMapper.mapToResponse(user)).toEqual(userData);
    });
  });
});
