import { UserType } from '@/enum/user-type.enum';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdatePasswordDto } from '@/user/dto/update-password.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { User } from '@/user/entities/user.entity';
import { validateHash } from '@/utils/hash';

export const createMockUserController: CreateUserDto = {
  email: 'test22@email.com',
  name: 'test Richard',
  password: 'Pass@12345Test',
  role: UserType.Root,
};

export const MockUser = [
  {
    id: '1',
    email: 'test@email.com',
    name: 'test',
    password: '$2b$10$ZnCM4YaUnAE.rNDwftvWre5vocsb8yW/.qr4hc/11RywG89ndByTu',
    role: UserType.User,
    createdAt: '2023-07-18T01:54:18.864Z',
    updatedAt: '2023-07-18T01:54:18.864Z',
  },
  {
    id: '2',
    email: 'test2@email.com',
    name: 'test2',
    password: '$2b$10$uOwhJZTr1NdfFWgtQ5nEAOpFGxagHWXZfG9Nta0eAirtPSGZZDW5u',
    role: UserType.Admin,
    createdAt: '2023-07-18T01:54:18.864Z',
    updatedAt: '2023-07-18T01:54:18.864Z',
  },
  {
    id: '3',
    email: 'test3@email.com',
    name: 'test3',
    password: '$2b$10$jFhjRUz7pRCNHTVFz5dcI.sz9gNDobFk9lSKzJ5z4jG/OtyrND42.',
    role: 'user',
    createdAt: '2023-07-18T01:54:18.864Z',
    updatedAt: '2023-07-18T01:54:18.864Z',
  },
];
export const createNewUser = {
  email: 'newuser@email.com',
  name: 'New User',
  password: 'Pass@1234Abc',
  role: UserType.User,
  createdAt: '2023-07-18T01:54:18.864Z',
  updatedAt: '2023-07-18T01:54:18.864Z',
};

export const errorCreateNewUser = {
  email: 'errornewuser@email.com',
  name: 'Error New User',
  password: 'Error',
  role: UserType.User,
  createdAt: '2023-07-18T01:54:18.864Z',
  updatedAt: '2023-07-18T01:54:18.864Z',
};
export const MockUserService = {
  create: jest.fn((dto) => ({
    id: 12,
    ...dto,
    password: undefined,
    createdAt: '2023-07-18T01:54:18.864Z',
    updatedAt: '2023-07-18T01:54:18.864Z',
  })),
  findAll: jest.fn().mockResolvedValue(MockUser),
  findOne: jest.fn().mockImplementation((id) => {
    if (MockUser.some((e) => +e.id === id)) return MockUser[1];
  }),
  findByEmail: jest.fn().mockImplementation((email) => {
    if (MockUser.some((e) => e.email === email)) return MockUser[0];
  }),
  updatePassword: jest
    .fn()
    .mockImplementation(
      async (email, updatePasswordDto: UpdatePasswordDto, userMe: User) => {
        const isPasswordVerify = await validateHash(
          updatePasswordDto.currentPassword,
          userMe.password,
        );

        if (email === userMe.email && isPasswordVerify) return MockUser[0];
      },
    ),
  updateUser: jest
    .fn()
    .mockImplementation(
      async (email, updateUserDto: UpdateUserDto, userMe: User) => {
        if (updateUserDto.email === userMe.email) return MockUser[0];
      },
    ),
  removeById: jest.fn().mockImplementation((id) => {
    if (MockUser.some((e) => +e.id === id)) return 'The user was deleted';
  }),
  removeByEmail: jest.fn().mockImplementation((email) => {
    if (MockUser.some((e) => e.email === email)) return 'The user was deleted';
  }),
};
