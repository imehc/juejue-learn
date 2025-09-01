import { zfd } from "zod-form-data";

import { z } from "~/helper/zod";

export const forgotSchema = zfd
  .formData({
    username: zfd.text(
      z
        .string({ error: "请填写用户名" })
        .trim()
        .min(2, "用户名不能少于2位")
        .max(8, "用户名不能超过8位")
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
    confirmPassword: zfd.text(
      z
        .string({ error: "请填写确认密码" })
        .trim()
        .min(6, "密码不能少于6位")
        .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
          message: "密码格式不合法",
        }),
    ),
    email: zfd.text(
      z.string({ error: "请填写邮箱" }).trim().email("邮箱格式不合法"),
    ),
    captcha: zfd.numeric(
      z.coerce
        .number({
          error: "请填写验证码",
        })
        .refine((num) => num.toString().length === 6, {
          message: "验证码长度只能为6位",
        }),
    ),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    // 消息可以自定义
    message: "两次输入的密码不一致",
    // 或者你可以返回一个对象，里面包含一个键为路径的对象，该方案可以用来定制各字段的消息
    path: ["confirmPassword"],
  });

export type ForgotSchemaFormValues = z.infer<typeof forgotSchema>;

export const forgotPasswordCaptchaSchema = zfd.formData({
  email: zfd.text(z.email("邮箱格式不正确")),
});
