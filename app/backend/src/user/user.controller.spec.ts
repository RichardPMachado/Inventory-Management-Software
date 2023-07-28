import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  MockUser,
  MockUserService,
  createNewUser,
  errorCreateNewUser,
} from '@/mocks/serviceUser.mock';
import { UserType } from '@/enum/user-type.enum';
import { UpdateUserDto } from './dto/update-user.dto';
// import { PrismaService } from '@/prisma/prisma.service';
// import { userSeed } from '@/data/userSeed';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: MockUserService,
        },
        // PrismaService,
      ],
    }).compile();

    // afterEach(() => {
    //   jest.clearAllMocks();
    // });

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return user list successfully', async () => {
      const result = await userController.findAll();
      // console.log(result);

      expect(result).toBe(MockUser);
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'findAll').mockRejectedValueOnce(new Error());

      expect(userController.findAll()).rejects.toThrowError();
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
      const result = await userController.create(createNewUser);

      expect(result).toEqual(newUser);
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      expect(userController.create(errorCreateNewUser)).rejects.toThrowError();
    });
  });
  describe('findOne', () => {
    it('Should return user by id successfully', async () => {
      const result = await userController.findOne(MockUser[1].id);

      expect(result).toBe(MockUser[1]);
    });
    it('should throw an exception', async () => {
      jest.spyOn(userService, 'findOne').mockRejectedValueOnce(new Error());

      expect(userController.findOne(MockUser[1].id)).rejects.toThrowError();
    });
  });
  describe('findByEmail', () => {
    it('Should return user by e-mail successfully', async () => {
      const result = await userController.findByEmail(MockUser[0].email);

      expect(result).toBe(MockUser[0]);
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'findByEmail').mockRejectedValueOnce(new Error());

      expect(
        userController.findByEmail(MockUser[1].email),
      ).rejects.toThrowError();
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
      const result = await userController.updatePassword(
        MockUser[0].email,
        updatePassword,
        userMe,
      );

      expect(result).toBe(MockUser[0]);
    });

    it('should throw an exception', async () => {
      jest
        .spyOn(userService, 'updatePassword')
        .mockRejectedValueOnce(new Error());

      expect(
        userController.updatePassword('erro@email.com', updatePassword, userMe),
      ).rejects.toThrowError();
    });
  });
  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'test@email.com',
      role: UserType.User,
      name: 'test',
    };
    const userMe = {
      id: 1,
      email: 'test@email.com',
      name: 'test',
      password: '$2b$10$ZnCM4YaUnAE.rNDwftvWre5vocsb8yW/.qr4hc/11RywG89ndByTu',
      role: UserType.User,
    };
    it('Should update user successfully', async () => {
      const result = await userController.updateUser(
        MockUser[0].email,
        updateUserDto,
        userMe,
      );

      expect(result).toBe(MockUser[0]);
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'updateUser').mockRejectedValueOnce(new Error());

      expect(
        userController.updateUser('erro@email.com', updateUserDto, userMe),
      ).rejects.toThrowError();
    });
  });
  describe('removeByEmail', () => {
    it('Should remove by e-mail successfully', async () => {
      const result = await userController.removeByEmail(MockUser[1].email);

      expect(result).toEqual('The user was deleted');
    });

    it('should throw an exception', async () => {
      jest
        .spyOn(userService, 'removeByEmail')
        .mockRejectedValueOnce(new Error());

      expect(
        userController.removeByEmail('erro@email.com'),
      ).rejects.toThrowError();
    });
  });
  describe('removeById', () => {
    it('Should remove by id successfully', async () => {
      const result = await userController.removeById(MockUser[1].id);

      expect(result).toEqual('The user was deleted');
    });

    it('should throw an exception', async () => {
      jest.spyOn(userService, 'removeById').mockRejectedValueOnce(new Error());

      expect(userController.removeById('5')).rejects.toThrowError();
    });
  });
});
