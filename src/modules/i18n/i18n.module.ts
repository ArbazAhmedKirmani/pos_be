import { HeaderResolver, I18nModule, I18nService } from 'nestjs-i18n';
import { join } from 'path';
import { Global, Module } from '@nestjs/common';
import { I18nTranslate } from 'src/helpers';
import { AppConfig } from 'src/config/app.config';

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: AppConfig.I18N.FALLBACK_LANG, //configService.getOrThrow('FALLBACK_LANGUAGE'),
        disableMiddleware: false,
        fallbacks: {
          en: 'en',
          ur: 'ur',
        },
        loaderOptions: {
          path: join(__dirname, '../../i18n/'),
          watch: true,
        },
        typesOutputPath: join(__dirname, '../../i18n/i18n.generated.ts'),
      }),
      resolvers: [new HeaderResolver(['locale'])],
    }),
  ],
  providers: [I18nTranslate],
})
export class I18nLangModule {}
