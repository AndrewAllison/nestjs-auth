import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createPasswordHash && validatePassword', () => {
    it('should create a password with hash and salt then validate it.', () => {
      const passwordService = new CryptoService();
      const result = passwordService.createPasswordHash('Pa$$20$$££"^&*()');

      const isValid = passwordService.validatePassword(
        'Pa$$20$$££"^&*()',
        result.hash,
        result.salt,
      );
      expect(isValid).toEqual(true);
    });
    it('should create a password with hash and salt then return false if it is invalid.', () => {
      const passwordService = new CryptoService();
      const result = passwordService.createPasswordHash('Pa$$20$$££"^&*()');

      const isValid = passwordService.validatePassword(
        'Pa$$20$$££"^&*(',
        result.hash,
        result.salt,
      );
      expect(isValid).toEqual(false);
    });
  });
  describe('createRandomCode', () => {
    it('should create a random digit number based on the given size', () => {
      const result = service.createRandomCode(6);
      expect(result).toHaveLength(12);
    });
  });
  describe('createRandomDigits', () => {
    it('should create a random digit number based on the given size', () => {
      const result = service.createRandomDigits(6);
      expect(result).toHaveLength(6);
    });
  });
});
