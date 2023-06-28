import { HttpException } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

import { ExceptionFilterFactory } from './exception-filter-factory';
import { DbExceptionsFilter } from './db-exceptions.filter';
import { CustomExceptionsFilter } from './custom-exceptions.filter';

describe('ExceptionFilterFactory', () => {
  describe('getExceptionFilter', () => {
    it('should return DbExceptionsFilter instance', () => {
      const error = new TypeORMError();
      const actualResult = new ExceptionFilterFactory(
        error,
      ).getExceptionFilter();

      expect(actualResult).toBeInstanceOf(DbExceptionsFilter);
    });

    it('should return CustomExceptionsFilter instance', () => {
      const error = new HttpException('', 400);
      const actualResult = new ExceptionFilterFactory(
        error,
      ).getExceptionFilter();

      expect(actualResult).toBeInstanceOf(CustomExceptionsFilter);
    });
  });
});
