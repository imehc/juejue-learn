import { zfd } from "zod-form-data";

import { z } from "@/helper/zod";

export const profileModifySchema = zfd.formData({
  headPic: zfd.text(z.string().optional()),
  nickName: zfd.text(
    z
      .string({ required_error: "请输入昵称" })
      .trim()
      .min(2, "最少输入两位")
      .max(16, "最多输入16位"),
  ),
  captcha: zfd.numeric(
    z.coerce
      .number({ required_error: "请填写验证码" })
      .refine((num) => num.toString().length === 6, {
        message: "验证码长度只能为6位",
      }),
  ),
  // https://next-safe-action.dev/docs/recipes/upload-files
  // 由于此接口不接受文件类型，所以提交的时候需要移除
  picture: zfd.file(
    z
      .instanceof(File)
      .optional()
      .refine((file) => {
        if (file) {
          return file.size <= 5 * 1024 * 1024; // 5MB
        }

        return true;
      }, "文件大小不能大于5Mb"),
  ),
});

export type ProfileModifyValues = z.infer<typeof profileModifySchema>;
