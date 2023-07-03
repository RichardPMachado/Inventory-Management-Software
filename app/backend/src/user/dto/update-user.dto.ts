import { IsEmail, IsString, MinLength } from 'class-validator';

import { UserType } from '@/enum/user-type.enum';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  role: UserType;
}
