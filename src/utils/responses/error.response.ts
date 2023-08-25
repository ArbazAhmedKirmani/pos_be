import { HttpException, HttpStatus } from '@nestjs/common';

export function catchErrorResponse(error) {
  throw new HttpException(error, HttpStatus.EXPECTATION_FAILED);
}
