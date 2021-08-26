import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { any, anyString, mock } from 'jest-mock-extended';
import { mockLogService } from '../../__testing__/mocks/log-service.mock';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { LogService } from './log.service';

describe('AllExceptions2Filter', () => {
  let allExceptionsFilter: AllExceptionsFilter;
  const currentDate = Date.now();

  beforeEach(async () => {
    Date.now = jest.fn(() => currentDate);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        { provide: LogService, useValue: mockLogService },
      ],
    }).compile();

    allExceptionsFilter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });
  it('should be defined', () => {
    expect(allExceptionsFilter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle a simple exception', () => {
      const mockHost = mock<ArgumentsHost>();
      const mockHttpHost = mock<HttpArgumentsHost>();
      const mockRequest = { url: '/home' };
      const Status = {
        json: jest.fn(),
      };
      const mockResponse = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        status: () => Status,
      };
      const statusSpy = jest.spyOn(mockResponse, 'status');
      const jsonSpy = jest.spyOn(Status, 'json');

      mockHost.switchToHttp.mockReturnValueOnce(mockHttpHost);
      mockHttpHost.getResponse.mockReturnValue(mockResponse);
      mockHttpHost.getRequest.mockReturnValue(mockRequest);

      allExceptionsFilter.catch({ message: 'It Broke' }, mockHost);

      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(jsonSpy).toHaveBeenCalledWith({
        timestamp: currentDate,
        path: mockRequest.url,
        error: {
          error: 'Server Exception',
          message: ['It Broke'],
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    });
  });
});
