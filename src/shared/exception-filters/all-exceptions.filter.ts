import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { TypeORMError } from 'typeorm';

import {
  ErrorType,
  ExceptionFactory,
  ExceptionResponse,
} from './types-and-interfaces';
import { DbExceptionsFilter } from './db-exceptions.filter';
import { CustomExceptionsFilter } from './custom-exceptions.filter';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter, ExceptionFactory {
  private readonly _dbExceptionFiler = new DbExceptionsFilter();
  private readonly _customExceptionsFilter = new CustomExceptionsFilter();
  constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}
  public catch(exception: ErrorType, host: ArgumentsHost): void {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.prepareErrorMessage(exception);
    errorResponse.path = String(httpAdapter.getRequestMethod(request));
    errorResponse.method = String(httpAdapter.getRequestUrl(request));

    httpAdapter.reply(ctx.getResponse(), errorResponse, errorResponse.code);
  }

  public prepareErrorMessage(error: ErrorType): ExceptionResponse {
    let response: ExceptionResponse;

    if (error instanceof TypeORMError) {
      response = this._dbExceptionFiler.prepareErrorMessage(error);
    }

    if (error instanceof HttpException) {
      response = this._customExceptionsFilter.prepareErrorMessage(error);
    }

    return response;
  }
}
