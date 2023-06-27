import { HttpStatus } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

import { ExceptionResponse } from './types-and-interfaces';
import { DbExceptionsFilter } from './db-exceptions.filter';

describe('DbExceptionsFilter', () => {
  describe('prepareErrorMessage', () => {
    const fixedTime = '2023-06-26T18:06:51.364Z';
    let preparedError: ExceptionResponse;

    beforeEach(() => {
      const parsedDate = Date.parse(fixedTime);

      jest.useFakeTimers('modern');
      jest.setSystemTime(parsedDate);

      preparedError = {
        message: 'Bad Request',
        timestamp: new Date().toISOString(),
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        path: undefined,
        method: undefined,
      };
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return a correct prepared error response', () => {
      const error = new TypeORMError('Bad Request');
      const actualResult = new DbExceptionsFilter(error).prepareErrorMessage();

      expect(actualResult).toStrictEqual(preparedError);
    });
  });
});
