import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'types/generated/i18n.generated';

export class CommonI18n {
  public static readonly i18n = i18nValidationMessage<I18nTranslations>;
}
