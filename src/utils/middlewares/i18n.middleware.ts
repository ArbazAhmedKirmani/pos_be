import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(private readonly i18n: I18nService) {}

  use(req: Request, res: Response, next: () => void) {
    const lang: string =
      req.headers['locale'].toString() || AppConfig.I18N.FALLBACK_LANG; // Set default language
    this.i18n.resolveLanguage(lang);
    next();
  }
}
