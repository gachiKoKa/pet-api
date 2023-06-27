import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

import { ErrorType, ExceptionResponse } from './types-and-interfaces';
import { ExceptionFilterFactory } from './exception-filter-factory';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: ErrorType, host: ArgumentsHost): void {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const errorResponse = this._prepareErrorResponse(
      exception,
      String(httpAdapter.getRequestMethod(request)),
      String(httpAdapter.getRequestUrl(request)),
    );

    httpAdapter.reply(ctx.getResponse(), errorResponse, errorResponse.code);
  }

  private _prepareErrorResponse(
    exception: ErrorType,
    path: string,
    method: string,
  ): ExceptionResponse {
    const errorResponse = new ExceptionFilterFactory(exception)
      .getExceptionFilter()
      .prepareErrorMessage();
    errorResponse.path = path;
    errorResponse.method = method;

    return errorResponse;
  }
}
