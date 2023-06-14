import { HttpStatus } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

import { ExceptionFactory, ExceptionResponse } from './types-and-interfaces';

export class DbExceptionsFilter implements ExceptionFactory {
  private readonly _statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  prepareErrorMessage(error: TypeORMError): ExceptionResponse {
    return {
      code: this._statusCode,
      message: error.message,
      timestamp: new Date().toISOString(),
      path: undefined,
      method: undefined,
    };
  }
}
