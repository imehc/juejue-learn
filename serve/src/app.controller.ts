import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import type { I18nTranslations } from 'types/generated/i18n.generated';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@I18n() i18n: I18nContext<I18nTranslations>): Promise<string> {
    return await i18n.t('test.hello');
  }
}
