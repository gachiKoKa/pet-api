import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

import { ErrorType } from './types-and-interfaces';
import { ExceptionFilterFactory } from './exception-filter-factory';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}
  public catch(exception: ErrorType, host: ArgumentsHost): void {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const errorResponse = new ExceptionFilterFactory(exception)
      .getExceptionFilter()
      .prepareErrorMessage();
    errorResponse.path = String(httpAdapter.getRequestMethod(request));
    errorResponse.method = String(httpAdapter.getRequestUrl(request));

    httpAdapter.reply(ctx.getResponse(), errorResponse, errorResponse.code);
  }
}
