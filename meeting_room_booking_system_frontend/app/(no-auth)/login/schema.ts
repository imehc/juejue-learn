import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "请填写用户名" })
    .trim()
    .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
      message: "密码格式不合法",
    }),
  password: z
    .string({ required_error: "请填写密码" })
    .trim()
    .min(6, "密码不能少于6位")
    .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
      message: "密码格式不合法",
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
