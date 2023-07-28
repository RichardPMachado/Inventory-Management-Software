import { PrismaModule } from '@/prisma/prisma.module';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { NewPasswordValidationMiddleware } from './middleware/new-password-validation.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { RolesGuard } from '@/guards/roles.guards';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NewPasswordValidationMiddleware)
      .forRoutes('user/update-password/:email');
  }
}
