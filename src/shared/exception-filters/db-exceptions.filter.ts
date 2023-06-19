import { HttpStatus } from '@nestjs/common';

import { ExceptionFactory, ExceptionResponse } from './types-and-interfaces';

export class DbExceptionsFilter implements ExceptionFactory {
  constructor(private readonly _error: TypeError) {}

  private readonly _statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  prepareErrorMessage(): ExceptionResponse {
    return {
      code: this._statusCode,
      message: this._error.message,
      timestamp: new Date().toISOString(),
      path: undefined,
      method: undefined,
    };
  }
}
