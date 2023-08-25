import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super('Not Found', HttpStatus.NOT_FOUND);
  }
}
