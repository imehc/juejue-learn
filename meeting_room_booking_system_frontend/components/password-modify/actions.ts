"use server";

import { z } from "zod";
import { flattenValidationErrors } from "next-safe-action";

import { passwordModifySchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { actionClient } from "@/helper/safe-action";
import { CaptchaApi, UserApi } from "@/meeting-room-booking-api";

export const passwordModifyAction = actionClient
  .schema(passwordModifySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput }) => {
    // const payload = passwordModifySchema.safeParse(
    //   Object.fromEntries(formData.entries()),
    // );
    const userApi = apiInstance(UserApi);

    const text = await userApi.updatePassword({
      updateUserPasswordDto: parsedInput,
    });

    return { message: text ?? "修改成功" };
  });

export const passwordModifyCaptchaAction = actionClient
  .schema(z.object({}))
  .stateAction(async () => {
    const captchaApi = apiInstance(CaptchaApi);
    const text = await captchaApi.updatePasswordCaptcha();

    return { message: text ?? "获取更改密码验证码成功" };
  });
