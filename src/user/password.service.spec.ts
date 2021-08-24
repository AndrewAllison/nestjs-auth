import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create an validate a password', () => {
    it('should create a password with hash and salt then validate it.', () => {
      const passwordService = new PasswordService();
      const result = passwordService.createPasswordHash('Pa$$20$$££"^&*()');

      const isValid = passwordService.validatePassword(
        'Pa$$20$$££"^&*()',
        result.hash,
        result.salt,
      );
      expect(isValid).toEqual(true);
    });
    it('should create a password with hash and salt then return false if it is invalid.', () => {
      const passwordService = new PasswordService();
      const result = passwordService.createPasswordHash('Pa$$20$$££"^&*()');

      const isValid = passwordService.validatePassword(
        'Pa$$20$$££"^&*(',
        result.hash,
        result.salt,
      );
      expect(isValid).toEqual(false);
    });
  });
  describe('create a random code', () => {
    it('should create a random digit number based on the given size', () => {
      const result = service.createRandomCode(6);
      expect(result).toHaveLength(12);
    });
  });
  describe('create a set of random digit', () => {
    it('should create a random digit number based on the given size', () => {
      const result = service.createRandomDigits(6);
      expect(result).toHaveLength(6);
    });
  });
});
