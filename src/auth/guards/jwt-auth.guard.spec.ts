import { Reflector } from '@nestjs/core';
import { mock } from 'jest-mock-extended';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const reflector = mock<Reflector>();
    expect(new JwtAuthGuard(reflector)).toBeDefined();
  });
});
