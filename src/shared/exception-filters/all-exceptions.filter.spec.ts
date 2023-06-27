import { Test } from '@nestjs/testing';
import { HttpAdapterHost } from '@nestjs/core';
import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { ExceptionResponse } from './types-and-interfaces';

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getNext: jest.fn(),
  getResponse: jest.fn(),
  getRequest: jest.fn(),
}));

const mockArgumentsHost: ArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
};

const mockHttpAdapter = {
  getRequestMethod: jest.fn().mockReturnValue('POST'),
  getRequestUrl: jest.fn().mockReturnValue('http://localhost:3000'),
  reply: jest.fn(),
};

const mockHttpAdapterHost: HttpAdapterHost = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  httpAdapter: mockHttpAdapter as any,
};

describe('AllExceptionsFilter', () => {
  const argumentsHost: ArgumentsHost = mockArgumentsHost;
  let allExceptionsFilter: AllExceptionsFilter;
  let exceptionResponse: ExceptionResponse;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: HttpAdapterHost,
          useValue: mockHttpAdapterHost,
        },
      ],
    }).compile();

    allExceptionsFilter =
      moduleRef.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  beforeEach(() => {
    exceptionResponse = {
      message: 'Bad Request',
      timestamp: new Date().toISOString(),
      code: HttpStatus.BAD_REQUEST,
      path: 'POST',
      method: 'http://localhost:3000',
    };
  });

  describe('catch', () => {
    const fixedTime = '2023-06-26T18:06:51.364Z';

    beforeEach(() => {
      const parsedDate = Date.parse(fixedTime);

      jest.useFakeTimers('modern');
      jest.setSystemTime(parsedDate);

      exceptionResponse.timestamp = new Date(parsedDate).toISOString();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should properly catch the error', () => {
      allExceptionsFilter.catch(new BadRequestException(), argumentsHost);
      expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
        argumentsHost.switchToHttp().getResponse(),
        exceptionResponse,
        exceptionResponse.code,
      );
    });
  });
});
