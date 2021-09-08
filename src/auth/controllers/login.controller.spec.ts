import { Test, TestingModule } from '@nestjs/testing';
import { mockLoginService } from '../../__testing__/mocks/login-service.mock';
import { LoginService } from '../services/login.service';
import { LoginController } from './login.controller';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
