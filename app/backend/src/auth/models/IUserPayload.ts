import { UserType } from '@/enum/user-type.enum';

export interface IUserPayload {
  sub: number;
  email: string;
  name: string;
  role: UserType;
}
