"use server";

import { flattenValidationErrors } from "next-safe-action";

import { apiInstance } from "~/helper/auth";
import { CaptchaApi, FileApi, UserApi } from "~/meeting-room-booking-api";
import { actionClient } from "~/helper/safe-action";

import { profileModifySchema } from "./schema";

export const profileModifyAction = actionClient
  .inputSchema(profileModifySchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput: { picture: file, ...props } }) => {
    let headPic = props.headPic;
    const userApi = await apiInstance(UserApi);
    const fileApi = await apiInstance(FileApi);

    if (file?.size) {
      // 上传搭配静态文件夹
      // headPic = await fileApi.uploadPicture({ file: file });

      // 使用OSS对象存储
      const { presignedPutUrl } = await fileApi.getPresignedUrl();
      const payload = new Blob([file as File], {
        type: "application/octet-stream",
      });

      await fetch(presignedPutUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: payload,
      });
      const parsedUrl = new URL(presignedPutUrl);

      headPic = parsedUrl.pathname;
    }

    const success = await userApi.updateUserInfo({
      updateUserDto: { ...props, headPic },
    });

    return { message: success ?? "更新个人资料成功" };
  });

export const profileModifyCaptchaAction = actionClient.stateAction(async () => {
  const captchaApi = await apiInstance(CaptchaApi);
  const text = await captchaApi.updateUserInfoCaptcha();

  return { message: text ?? "获取更新用户信息验证码成功" };
});
