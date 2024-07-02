import { z } from "zod";

export const profileModifySchema = z.object({
  headPic: z.string().optional(),
  nickName: z.string().trim().optional(),
  captcha: z.coerce
    .number({ required_error: "请填写验证码" })
    .refine((num) => num.toString().length === 6, {
      message: "验证码长度只能为6位",
    }),
});

export type ProfileModifyValues = z.infer<typeof profileModifySchema>;
