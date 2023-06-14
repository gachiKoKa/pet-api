import { HttpException } from '@nestjs/common';

import { ExceptionFactory, ExceptionResponse } from './types-and-interfaces';

export class CustomExceptionsFilter implements ExceptionFactory {
  prepareErrorMessage(error: HttpException): ExceptionResponse {
    return {
      code: error.getStatus(),
      message: error.message,
      timestamp: new Date().toISOString(),
      path: undefined,
      method: undefined,
    };
  }
}
