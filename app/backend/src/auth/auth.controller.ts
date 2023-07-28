import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuthRequest } from './models/IAuthRequest';
import { LocalAuthGuard } from '@/guards/local-auth.guards';
import { IsPublic } from '@/decorators/is-public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req: IAuthRequest) {
    // console.log(req.user, 'user');
    return this.authService.login(req.user);
  }
}
