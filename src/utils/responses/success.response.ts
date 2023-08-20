import { HttpCode, HttpException, HttpStatus } from '@nestjs/common';

export function successOkResponse(
  data: any,
  status: HttpStatus = HttpStatus.OK,
) {
  return new HttpException(data, status);
}
