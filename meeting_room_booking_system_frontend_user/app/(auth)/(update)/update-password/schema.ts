import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    password: z
      .string({ required_error: "请填写密码" })
      .trim()
      .min(6, "密码不能少于6位")
      .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
        message: "密码格式不合法",
      }),
    confirmPassword: z
      .string({ required_error: "请填写确认密码" })
      .trim()
      .min(6, "密码不能少于6位")
      .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
        message: "密码格式不合法",
      }),
    captcha: z.coerce
      .number({ required_error: "请填写验证码" })
      .refine((num) => num.toString().length === 6, {
        message: "验证码长度只能为6位",
      }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    // 消息可以自定义
    message: "两次输入的密码不一致",
    // 或者你可以返回一个对象，里面包含一个键为路径的对象，该方案可以用来定制各字段的消息
    path: ["confirmPassword"],
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
