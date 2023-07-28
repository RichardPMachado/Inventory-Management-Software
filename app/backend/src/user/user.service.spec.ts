import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  MockUser,
  createNewUser,
  errorCreateNewUser,
} from '@/mocks/createUser.mock';
import { mockPrisma } from '@/mocks/prismaUser.mock';
import { UserType } from '@/enum/user-type.enum';
import { validateHash } from '@/utils/hash';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return user list successfully', async () => {
      const result = await userService.findAll();

      expect(result).toBe(MockUser);
    });

    it('should throw an exception', async () => {
      jest.spyOn(prisma.user, 'findMany').mockRejectedValueOnce(new Error());

      expect(userService.findAll()).rejects.toThrowError();
    });
  });
  describe('create', () => {
    it('Should create user successfully', async () => {
      const newUser = {
        id: 12,
        email: 'newuser@email.com',
        name: 'New User',
        password: undefined,
        role: 'user',
        createdAt: '2023-07-18T01:54:18.864Z',
        updatedAt: '2023-07-18T01:54:18.864Z',
      };
      const result = await userService.create(createNewUser);

      expect(result).toEqual(newUser);
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      expect(userService.create(errorCreateNewUser)).rejects.toThrowError();
    });
  });
  describe('findOne', () => {
    it('Should return user by id successfully', async () => {
      const result = await userService.findOne(+MockUser[1].id);

      expect(result).toBe(MockUser[1]);
    });
    it('should throw an exception', async () => {
      // jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error());

      expect(userService.findOne(33)).rejects.toThrowError();
    });
  });

  describe('findByEmail', () => {
    it('Should return user by e-mail successfully', async () => {
      const result = await userService.findByEmail(MockUser[0].email);

      expect(result).toBe(MockUser[0]);
    });

    it('should throw an exception', async () => {
      // jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error());

      expect(userService.findByEmail('erro@email.com')).rejects.toThrowError();
    });
  });

  describe('updatePassword', () => {
    const updatePassword = {
      currentPassword: 'Pass@12345Test',
      newPassword: 'Pass@12345Test01',
    };
    const userMe = {
      id: 1,
      email: 'test@email.com',
      name: 'test',
      password: '$2b$10$ZnCM4YaUnAE.rNDwftvWre5vocsb8yW/.qr4hc/11RywG89ndByTu',
      role: UserType.User,
    };

    it('Should update password successfully', async () => {
      console.log('estou aqui');

      const result = await userService.updatePassword(
        MockUser[0].email,
        updatePassword,
        userMe,
      );
      const newPasswordHash = await validateHash(
        updatePassword.newPassword,
        result.password,
      );

      expect(newPasswordHash).toBeTruthy();
      expect(result.password).not.toEqual(MockUser[0].password);
      expect(result).toEqual({ ...MockUser[0], password: result.password });
    });

    it('should throw an exception', async () => {
      jest
        .spyOn(userService, 'updatePassword')
        .mockRejectedValueOnce(new Error());

      expect(
        userService.updatePassword('erro@email.com', updatePassword, userMe),
      ).rejects.toThrowError();
    });
  });
  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'test@email.com',
      role: UserType.Root,
      name: 'Efetuado com Sucesso',
    };
    const userMe = {
      id: 1,
      email: 'test@email.com',
      name: 'test',
      password: '$2b$10$ZnCM4YaUnAE.rNDwftvWre5vocsb8yW/.qr4hc/11RywG89ndByTu',
      role: UserType.User,
    };
    it('Should update user successfully', async () => {
      const result = await userService.updateUser(
        MockUser[0].email,
        updateUserDto,
        userMe,
      );
      expect(result).not.toEqual(MockUser[0]);
      expect(result.role).toEqual(updateUserDto.role);
      expect(result.name).toEqual(updateUserDto.name);
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'updateUser').mockRejectedValueOnce(new Error());

      expect(
        userService.updateUser('erro@email.com', updateUserDto, userMe),
      ).rejects.toThrowError();
    });
  });
  describe('removeByEmail', () => {
    it('Should remove by e-mail successfully', async () => {
      const result = await userService.removeByEmail(MockUser[1].email);

      expect(result).toEqual('The user was deleted');
    });

    it('should throw an exception', async () => {
      jest
        .spyOn(userService, 'removeByEmail')
        .mockRejectedValueOnce(new Error());

      expect(
        userService.removeByEmail('erro@email.com'),
      ).rejects.toThrowError();
    });
  });
  describe('removeById', () => {
    it('Should remove by id successfully', async () => {
      const result = await userService.removeById(+MockUser[1].id);

      expect(result).toEqual('The user was deleted');
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'removeById').mockRejectedValueOnce(new Error());

      expect(userService.removeById(5)).rejects.toThrowError();
    });
  });
});
