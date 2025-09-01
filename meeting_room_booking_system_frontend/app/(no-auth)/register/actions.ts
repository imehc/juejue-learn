"use server";

import { flattenValidationErrors } from "next-safe-action";

import { apiInstance } from "~/helper/auth";
import { actionClient } from "~/helper/safe-action";
import { CaptchaApi, UserApi } from "~/meeting-room-booking-api";

import { registerCaptchaSchema, registerSchema } from "./schema";

export const registerAction = actionClient
  .inputSchema(registerSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput }) => {
    const userApi = await apiInstance(UserApi);

    const text = await userApi.userRegister({
      registerUserDto: parsedInput,
    });

    return { message: text ?? "注册成功" };
  });

export const registerCaptchaAction = actionClient
  .inputSchema(registerCaptchaSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput: { email } }) => {
    const captchaApi = await apiInstance(CaptchaApi);
    const text = await captchaApi.registerCaptcha({ address: email });

    return { message: text ?? "获取注册验证码成功" };
  });
