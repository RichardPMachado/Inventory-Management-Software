import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// import { UserType } from '@/enum/user-type.enum';

import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @IsEmail()
  @MinLength(3)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  name: string;

  @IsString()
  role: 'user' | 'root' | 'admin';
}
