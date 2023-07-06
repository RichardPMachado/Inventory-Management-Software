import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';

import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class NewPasswordValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { newPassword, currentPassword } = req.body;

    const updatePasswordDto = new UpdatePasswordDto();
    updatePasswordDto.newPassword = newPassword;
    updatePasswordDto.currentPassword = currentPassword;

    const validationsPassword = newPassword === currentPassword;
    const validations = await validate(updatePasswordDto);

    if (validationsPassword) {
      throw new NotFoundException(`password has already been used`);
    }

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }
    next();
  }
}
