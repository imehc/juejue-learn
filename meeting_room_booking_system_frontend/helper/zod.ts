import { z } from "zod";

import { makeZodI18nMap } from "./i18n.zod";

z.config({
  localeError: makeZodI18nMap({ ns: ["zod", "custom"] }),
});
// zod 汉化
export { z };
