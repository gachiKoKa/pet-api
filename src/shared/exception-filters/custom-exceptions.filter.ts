import { HttpException } from '@nestjs/common';

import { ExceptionFactory, ExceptionResponse } from './types-and-interfaces';

export class CustomExceptionsFilter implements ExceptionFactory {
  constructor(private readonly _error: HttpException) {}

  public prepareErrorMessage(): ExceptionResponse {
    return {
      code: this._error.getStatus(),
      message: this._error.message,
      timestamp: new Date().toISOString(),
      path: undefined,
      method: undefined,
    };
  }
}
