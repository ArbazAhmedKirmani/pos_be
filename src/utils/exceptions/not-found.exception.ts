import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { i18n_constants } from 'src/constants/i18n.constant';

export class NotFound extends NotFoundException {
  constructor() {
    super(i18n_constants.responses.error.not_found);
  }
}

export class Forbidden extends ForbiddenException {
  constructor() {
    super(i18n_constants.responses.error.forbidden);
  }
}

export class BadRequest extends BadRequestException {
  constructor() {
    super(i18n_constants.responses.error.bad_request);
  }
}

export class Unauthorized extends UnauthorizedException {
  constructor() {
    super(i18n_constants.responses.error.unauthorized);
  }
}

export class BadGateway extends BadGatewayException {
  constructor() {
    super(i18n_constants.responses.error.unindentified);
  }
}
