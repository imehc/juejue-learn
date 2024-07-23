import i18Next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/zh-CN/zod.json";

i18Next.init({
  lng: "zh-CN",
  resources: {
    "zh-CN": {
      zod: translation,
    },
  },
});

z.setErrorMap(zodI18nMap);
// zod 汉化
export { z };
