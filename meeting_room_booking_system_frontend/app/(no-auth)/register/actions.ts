"use server";

import { flattenValidationErrors } from "next-safe-action";

import { registerCaptchaSchema, registerSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { actionClient } from "@/helper/safe-action";
import { CaptchaApi, UserApi } from "@/meeting-room-booking-api";

export const registerAction = actionClient
  .schema(registerSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput }) => {
    const userApi = apiInstance(UserApi);

    const text = await userApi.userRegister({
      registerUserDto: parsedInput,
    });

    return { message: text ?? "注册成功" };
  });

export const registerCaptchaAction = actionClient
  .schema(registerCaptchaSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput: { email } }) => {
    const captchaApi = apiInstance(CaptchaApi);
    const text = await captchaApi.registerCaptcha({ address: email });

    return { message: text ?? "获取注册验证码成功" };
  });
