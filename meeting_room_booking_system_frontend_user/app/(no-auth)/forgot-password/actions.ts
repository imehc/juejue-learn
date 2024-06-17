"use server";

import { forgotSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { CaptchaApi, ResponseError, UserApi } from "@/meeting-room-booking-api";

interface State {
  message?: {
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    captcha?: string;
  } | null;
  error?: string;
  success?: string;
}

export async function forgotPassword(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const payload = forgotSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!payload.success) {
    const usernameErr = payload.error.errors.find(
      (err) => err.path[0] === "username",
    )?.message;
    const passwordErr = payload.error.errors.find(
      (err) => err.path[0] === "password",
    )?.message;
    const confirmPasswordErr = payload.error.errors.find(
      (err) => err.path[0] === "confirmPassword",
    )?.message;
    const emailErr = payload.error.errors.find(
      (err) => err.path[0] === "email",
    )?.message;
    const captchaErr = payload.error.errors.find(
      (err) => err.path[0] === "captcha",
    )?.message;

    return {
      message: {
        username: usernameErr,
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
        email: emailErr,
        captcha: captchaErr,
      },
    };
  }

  try {
    const userApi = apiInstance(UserApi);

    const success = await userApi.forgotPassword({
      forgotUserPasswordDto: payload.data,
    });

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "找回失败",
      };
    }
    console.error(error);

    return {
      error: "找回密码失败",
    };
  }
}

export async function forgotPasswordCaptcha(
  prevState: State,
  formData: FormData,
): Promise<State> {
  // input已限制，所以不需要再校验邮箱
  const email = formData.get("email") as string | undefined;

  if (!email) {
    return {
      error: "请输入邮箱地址",
    };
  }

  try {
    const captchaApi = apiInstance(CaptchaApi);
    const success = await captchaApi.fotgotCaptcha({ address: email });

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "服务异常",
      };
    }

    return { error: "服务异常" };
  }
}
