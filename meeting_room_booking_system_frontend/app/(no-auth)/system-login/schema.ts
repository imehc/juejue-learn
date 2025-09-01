import { zfd } from "zod-form-data";

import { z } from "~/helper/zod";

export const loginSchema = zfd.formData({
  username: zfd.text(
    z
      .string({ error: "请填写用户名" })
      .trim()
      .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
        message: "用户名不合法",
      }),
  ),
  password: zfd.text(
    z
      .string({ error: "请填写密码" })
      .trim()
      .min(6, "密码不能少于6位")
      .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
        message: "密码格式不合法",
      }),
  ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
