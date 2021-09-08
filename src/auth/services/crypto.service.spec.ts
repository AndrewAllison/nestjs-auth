import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

const getCryptoService = () => {
  const jwtService = new JwtService({
    secret: 'JustA$ecr£t',
  });
  const crypto = new CryptoService(jwtService);
  return crypto;
};

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CryptoService, useValue: getCryptoService() }],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createPasswordHash && validatePassword', () => {
    it('should create a password with hash and salt then validate it.', () => {
      const crypto = getCryptoService();
      const result = crypto.createPasswordHash('Pa$$20$$££"^&*()');

      const isValid = crypto.validatePassword(
        'Pa$$20$$££"^&*()',
        result.hash,
        result.salt,
      );
      expect(isValid).toEqual(true);
    });
    it('should create a password with hash and salt then return false if it is invalid.', () => {
      const crypto = getCryptoService();
      const result = crypto.createPasswordHash('Pa$$20$$££"^&*()');

      const isValid = crypto.validatePassword(
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
