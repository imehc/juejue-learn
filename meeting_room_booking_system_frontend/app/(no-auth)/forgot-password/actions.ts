"use server";

import { flattenValidationErrors } from "next-safe-action";

import { apiInstance } from "~/helper/auth";
import { actionClient } from "~/helper/safe-action";
import { CaptchaApi, UserApi } from "~/meeting-room-booking-api";

import { forgotPasswordCaptchaSchema, forgotSchema } from "./schema";

export const forgotPasswordAction = actionClient
  .inputSchema(forgotSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput }) => {
    const userApi = await apiInstance(UserApi);

    const text = await userApi.forgotPassword({
      forgotUserPasswordDto: parsedInput,
    });

    return { message: text ?? "设置密码成功" };
  });

export const forgotPasswordCaptchaAction = actionClient
  .inputSchema(forgotPasswordCaptchaSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput: { email } }) => {
    const captchaApi = await apiInstance(CaptchaApi);
    const text = await captchaApi.fotgotCaptcha({ address: email });

    return { message: text ?? "获取找回密码验证码成功" };
  });
