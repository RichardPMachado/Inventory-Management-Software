import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
// import { UserModule } from '@/user/user.module';
// import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// import { PrismaModule } from '@/prisma/prisma.module';
import { UserService } from '@/user/user.service';
import { MockAuthRequest } from '@/mocks/serviceUser.mock';
import { authorizantionToLoginPayload } from '@/utils/base-64-converter';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
      imports: [
        // UserModule,
        // ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: process.env.JWT_SECRET,
        }),
        // PrismaModule,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('when the login method is called', () => {
    it('should return a acces_token', async () => {
      const token = authService.login(MockAuthRequest);
      expect(token.access_token).toBeTruthy();
    });

    it('the access_token should be correct', async () => {
      const token = authService.login(MockAuthRequest);
      const result = authorizantionToLoginPayload(token.access_token);

      expect(result.email).toBe(MockAuthRequest.email);
      expect(result.name).toBe(MockAuthRequest.name);
      expect(result.sub).toBe(MockAuthRequest.id);
      expect(result.role).toBe(MockAuthRequest.role);
    });
  });
});
