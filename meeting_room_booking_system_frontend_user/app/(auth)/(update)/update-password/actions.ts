"use server";

import { updatePasswordSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { CaptchaApi, ResponseError, UserApi } from "@/meeting-room-booking-api";

interface State {
  message?: {
    password?: string;
    confirmPassword?: string;
    captcha?: string;
  } | null;
  error?: string;
  success?: string;
}

export async function updatePassword(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const payload = updatePasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!payload.success) {
    const passwordErr = payload.error.errors.find(
      (err) => err.path[0] === "password",
    )?.message;
    const confirmPasswordErr = payload.error.errors.find(
      (err) => err.path[0] === "confirmPassword",
    )?.message;
    const captchaErr = payload.error.errors.find(
      (err) => err.path[0] === "captcha",
    )?.message;

    return {
      message: {
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
        captcha: captchaErr,
      },
    };
  }

  try {
    const userApi = apiInstance(UserApi);

    const success = await userApi.updatePassword({
      updateUserPasswordDto: payload.data,
    });

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "修改失败",
      };
    }
    console.error(error);

    return {
      error: (error as Error)?.message || "修改失败",
    };
  }
}

export async function updatePasswordCaptcha(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const captchaApi = apiInstance(CaptchaApi);
    const success = await captchaApi.updatePasswordCaptcha();

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "服务异常",
      };
    }

    return { error: (error as Error)?.message || "服务异常" };
  }
}
