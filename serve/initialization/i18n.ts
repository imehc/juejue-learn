import { getServerConfig } from 'config/server.config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

export const LoadI18n = I18nModule.forRootAsync({
  useFactory: () => {
    const { language } = getServerConfig();
    return {
      fallbackLanguage: language,
      loaderOptions: {
        path: join(__dirname, '../src/i18n/'),
        watch: true,
      }, // 配置项
      // ISSUE: https://github.com/toonvanstrijp/nestjs-i18n/issues/448#issuecomment-1382745690
      typesOutputPath: join(
        process.cwd() + '/types/generated/i18n.generated.ts',
      ),
    };
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    { use: HeaderResolver, options: ['x-lang'] },
    AcceptLanguageResolver,
    // new CookieResolver(),
  ],
});
