import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

export class NotFoundException extends HttpException {
  constructor(i18n: I18nService) {
    super(i18n.t('error.not_found'), HttpStatus.NOT_FOUND);
  }
}
