import { PrismaService } from 'src/prisma/prisma.service';

import { createHash, validateHash } from '@/utils/hash';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as currentUser from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findByEmail(createUserDto.email);
    const data = {
      ...createUserDto,
      password: await createHash(createUserDto.password),
    };

    if (user) {
      throw new BadGatewayException('email registered in system');
    }

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User id: ${id} Not Found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User email: ${email} Not Found`);
    }
    return user;
  }

  async updatePassword(
    email: string,
    updatePasswordDto: UpdatePasswordDto,
    currentUser: currentUser.User,
  ) {
    const current: User = await this.findByEmail(email);
    if (email === currentUser.email) {
      if (
        !(await validateHash(
          updatePasswordDto.currentPassword,
          current.password,
        ))
      ) {
        throw new UnauthorizedException(
          'Email address or password provided is incorrect.',
        );
      }
      const newUser = await this.prisma.user.update({
        where: { email },
        data: {
          password: await createHash(updatePasswordDto.newPassword),
        },
      });
      return newUser;
    }
    throw new NotFoundException(`User email: ${email} Not Found`);
  }

  async updateUser(
    email: string,
    user: UpdateUserDto,
    currentUser: currentUser.User,
  ) {
    // if (!user.password) delete user.password;
    // console.log(user);

    if (email === currentUser.email) {
      const newUser = await this.prisma.user.update({
        where: { email },
        data: {
          ...user,
        },
      });
      console.log(newUser);
      return newUser;
    }
    throw new NotFoundException(`User email: ${email} Not Found`);
  }

  async removeById(id: number): Promise<void> {
    const user = await this.findOne(id);
    // console.log(user);
    if (!user) {
      throw new NotFoundException(`User id: ${id} Not Found`);
    }
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async removeByEmail(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    console.log(user);
    if (!user) {
      throw new NotFoundException(`User email: ${email} Not Found`);
    }
    await this.prisma.user.delete({
      where: { email },
    });
  }
}
