import { HttpException, HttpStatus } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

export interface ExceptionResponse {
  code: HttpStatus;
  message: string;
  path: string;
  method: string;
  timestamp: string;
}

export type ErrorType = TypeORMError | HttpException;

export interface ExceptionFactory {
  prepareErrorMessage(error: ErrorType): ExceptionResponse;
}
