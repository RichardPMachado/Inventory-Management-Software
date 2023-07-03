import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { IsPublic } from '@/decorators/is-public.decorator';
import { Roles } from '@/decorators/roles-key.decorator';
import { UserType } from '@/enum/user-type.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(UserType.Root, UserType.Admin)
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch('update-password/:email')
  updatePassword(
    @Param('email') email: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.updatePassword(
      email,
      updatePasswordDto,
      currentUser,
    );
  }

  @Patch('update-user/:email')
  updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.updateUser(email, updateUserDto, currentUser);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeById(@Param('id') id: string) {
    return this.userService.removeById(+id);
  }

  @Delete('email/:email')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByEmail(@Param('email') email: string) {
    return this.userService.removeByEmail(email);
  }
}
