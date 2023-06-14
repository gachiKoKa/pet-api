import { TypeORMError } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { ErrorType, ExceptionFactory } from './types-and-interfaces';
import { DbExceptionsFilter } from './db-exceptions.filter';
import { CustomExceptionsFilter } from './custom-exceptions.filter';

export class ExceptionFilterFactory {
  constructor(private readonly _error: ErrorType) {}
  public getExceptionFilter(): ExceptionFactory {
    if (this._error instanceof TypeORMError) {
      return new DbExceptionsFilter(this._error);
    }

    if (this._error instanceof HttpException) {
      return new CustomExceptionsFilter(this._error);
    }
  }
}
