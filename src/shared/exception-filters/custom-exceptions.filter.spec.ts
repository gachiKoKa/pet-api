import { BadRequestException, HttpStatus } from '@nestjs/common';

import { CustomExceptionsFilter } from './custom-exceptions.filter';
import { ExceptionResponse } from './types-and-interfaces';

describe('CustomExceptionsFilter', () => {
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
        code: HttpStatus.BAD_REQUEST,
        path: undefined,
        method: undefined,
      };
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return a correct prepared error response', () => {
      const error = new BadRequestException('Bad Request');
      const actualResult = new CustomExceptionsFilter(
        error,
      ).prepareErrorMessage();

      expect(actualResult).toStrictEqual(preparedError);
    });
  });
});
