import { UserType } from '@/enum/user-type.enum';

export class User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: UserType;
}
