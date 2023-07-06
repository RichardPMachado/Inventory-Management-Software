import { UserType } from '@/enum/user-type.enum';

export interface IUserFromJwt {
  id: number;
  email: string;
  name: string;
  role: UserType;
}
